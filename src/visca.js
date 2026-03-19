import { InstanceStatus } from '@companion-module/base'

const COMMAND = Buffer.from([0x01, 0x00])
const CONTROL = Buffer.from([0x02, 0x00])
const INQUIRY = Buffer.from([0x01, 0x10])

const TIMEOUT_MS = 2000

export class Visca {
	#instance
	#packetCounter = 0
	#cts = true
	#queue = []
	#activePackets = {}
	#pendingSeq = null
	#inquiryCallbacks = {}
	#inquiryKeys = []
	#nextInquiry = 0
	#pollTimer = null
	#consecutiveTimeouts = 0
	#totalSuccesses = 0
	#inquiryTelemetry = {}
	#lowPriorityCallbacks = {}
	#lowPriorityKeys = []
	#nextLowPriority = 0

	constructor(instance) {
		this.#instance = instance
	}

	get command() {
		return COMMAND
	}
	get control() {
		return CONTROL
	}
	get inquiry() {
		return INQUIRY
	}

	send(payload, type = COMMAND, callback = null) {
		const packet = { payload, type, callback }
		if (this.#cts) {
			this.#sendPacket(packet)
		} else {
			this.#queue.push(packet)
		}
	}

	handleResponse(msg) {
		// SharedUdpSocket IPC delivers Uint8Array, not Buffer
		if (!Buffer.isBuffer(msg)) {
			if (msg instanceof Uint8Array) {
				msg = Buffer.from(msg)
			} else {
				return
			}
		}
		if (msg.length < 3) return

		const seq = msg.readUInt32BE(4)
		const payloadLength = msg.readUInt16BE(2)
		if (payloadLength < 2 || 8 + payloadLength > msg.length) return
		const payload = msg.subarray(8, 8 + payloadLength)

		if (payload[0] !== 0x90) return

		// Log errors regardless of correlation
		if ((payload[1] & 0xf0) === 0x60 && payload.length >= 3) {
			this.#logError(payload)
		}

		const ap = this.#activePackets[seq]
		if (!ap) return

		const isInitialResponse = seq === this.#pendingSeq
		const responseType = payload[1] >> 4

		if (responseType === 4) {
			// ACK — command accepted into a buffer slot
			clearTimeout(ap.timer)
			ap.timer = setTimeout(() => this.#handleTimeout(seq), TIMEOUT_MS)
			this.#onSuccessfulResponse()
			if (isInitialResponse) {
				this.#pendingSeq = null
				this.#drainOrIdle()
			}
			return
		}

		if (payload[1] === 0x50 && payload.length > 3) {
			// Inquiry response: 90 50 <data...> FF
			clearTimeout(ap.timer)
			delete this.#activePackets[seq]
			if (ap.inquiryKey) {
				this.#recordInquiryResult(ap.inquiryKey, true)
			}
			if (ap.callback) {
				try {
					ap.callback(payload)
				} catch (e) {
					this.#instance.log('warn', `Inquiry callback error: ${e.message}`)
				}
			}
			this.#onSuccessfulResponse()
			if (isInitialResponse) {
				this.#pendingSeq = null
				this.#drainOrIdle()
			}
			return
		}

		if (responseType === 5) {
			// Completion: 90 5x FF
			clearTimeout(ap.timer)
			delete this.#activePackets[seq]
			this.#onSuccessfulResponse()
			if (isInitialResponse) {
				this.#pendingSeq = null
				this.#drainOrIdle()
			}
			return
		}

		if (responseType === 6) {
			// Error response: 90 6x <err> FF
			clearTimeout(ap.timer)
			delete this.#activePackets[seq]
			if (ap.inquiryKey) {
				this.#recordInquiryResult(ap.inquiryKey, false)
			}
			this.#onSuccessfulResponse()
			if (isInitialResponse) {
				this.#pendingSeq = null
				this.#drainOrIdle()
			}
			return
		}
	}

	initializeInquiries(inquiryCallbacks) {
		this.#inquiryCallbacks = {}
		this.#inquiryKeys = []
		this.#inquiryTelemetry = {}
		for (const [key, callback] of Object.entries(inquiryCallbacks)) {
			this.#inquiryKeys.push(key)
			this.#inquiryCallbacks[key] = callback
		}
		this.#nextInquiry = 0
	}

	initializeLowPriorityInquiries(callbacks) {
		this.#lowPriorityCallbacks = {}
		this.#lowPriorityKeys = []
		this.#nextLowPriority = 0
		for (const [key, callback] of Object.entries(callbacks)) {
			this.#lowPriorityKeys.push(key)
			this.#lowPriorityCallbacks[key] = callback
		}
	}

	startLowPriorityPolling() {
		// Low-priority inquiries are now interleaved into the main polling loop.
		// Fire all once at startup for immediate state.
		for (const key of this.#lowPriorityKeys) {
			this.sendLowPriorityInquiry(key)
		}
	}

	sendLowPriorityInquiry(key) {
		const callback = this.#lowPriorityCallbacks[key]
		if (!callback) return
		const camId = parseInt(this.#instance.state.viscaId)
		const keyBytes = Buffer.from(key, 'hex')
		const payload = Buffer.alloc(keyBytes.length + 2)
		payload[0] = camId
		keyBytes.copy(payload, 1)
		payload[payload.length - 1] = 0xff
		this.send(payload, INQUIRY, callback)
	}

	stopPolling() {
		if (this.#pollTimer) {
			clearTimeout(this.#pollTimer)
			this.#pollTimer = null
		}
		for (const ap of Object.values(this.#activePackets)) {
			clearTimeout(ap.timer)
		}
		this.#activePackets = {}
		this.#pendingSeq = null
		this.#queue = []
		this.#cts = true
	}

	resetSequenceNumber() {
		this.stopPolling()
		this.#packetCounter = 0
		if (this.#instance.udpSocket) {
			const resetBuffer = Buffer.alloc(9)
			resetBuffer.write('020000010000000001', 'hex')
			this.#instance.udpSocket.send(resetBuffer, this.#instance.viscaPort, this.#instance.viscaHost)
		}
		this.#cts = true
		this.#schedulePoll()
	}

	msgToString(msg, separateBlocks = true) {
		let s = ''
		for (let i = 0; i < msg.length; i++) {
			s += msg[i].toString(16).padStart(2, '0') + ' '
			if (separateBlocks && (i == 1 || i == 3 || i == 7 || i == 15 || i == 23)) {
				s += '| '
			}
		}
		return s.trim()
	}

	#sendPacket({ payload, type, callback, inquiryKey }) {
		if (!this.#instance.udpSocket) {
			this.#cts = true
			return
		}

		this.#cts = false
		this.#packetCounter++
		if (this.#packetCounter >= 0xffffffff) {
			this.resetSequenceNumber()
			return
		}

		const payloadBuf = typeof payload === 'string' ? Buffer.from(payload, 'binary') : payload

		const buffer = Buffer.alloc(payloadBuf.length + 8)
		type.copy(buffer)
		buffer.writeUInt16BE(payloadBuf.length, 2)
		buffer.writeUInt32BE(this.#packetCounter, 4)
		payloadBuf.copy(buffer, 8)

		const seq = this.#packetCounter
		this.#pendingSeq = seq
		this.#activePackets[seq] = {
			callback,
			inquiryKey,
			timer: setTimeout(() => this.#handleTimeout(seq), TIMEOUT_MS),
		}

		this.#instance.log('debug', this.msgToString(buffer))
		const lastCmdSent = this.msgToString(buffer.subarray(8), false)
		this.#instance.setVariableValues({ lastCmdSent })
		this.#instance.udpSocket.send(buffer, this.#instance.viscaPort, this.#instance.viscaHost)
	}

	#drainOrIdle() {
		if (this.#queue.length > 0) {
			this.#sendPacket(this.#queue.shift())
		} else {
			this.#cts = true
			this.#schedulePoll()
		}
	}

	#onSuccessfulResponse() {
		this.#consecutiveTimeouts = 0
		this.#totalSuccesses++
		this.#instance.updateStatus(InstanceStatus.Ok)
	}

	#handleTimeout(seq) {
		const ap = this.#activePackets[seq]
		if (!ap) return
		delete this.#activePackets[seq]

		this.#instance.log('warn', `VISCA timeout for packet seq=${seq}`)
		this.#consecutiveTimeouts++

		if (ap.inquiryKey) {
			this.#recordInquiryResult(ap.inquiryKey, false)
		}

		if (this.#consecutiveTimeouts >= 10) {
			this.#instance.log('warn', 'Too many timeouts, resetting connection')
			this.#instance.updateStatus(InstanceStatus.ConnectionFailure)
			this.resetSequenceNumber()
			this.#consecutiveTimeouts = 0
			return
		}

		if (this.#consecutiveTimeouts >= 4) {
			this.#instance.updateStatus(InstanceStatus.UnknownWarning, 'Communication issues')
		}

		this.#pendingSeq = null
		this.#cts = true
		if (this.#queue.length > 0) {
			this.#sendPacket(this.#queue.shift())
		} else {
			this.#schedulePollWithBackoff()
		}
	}

	#schedulePoll() {
		if (this.#pollTimer) clearTimeout(this.#pollTimer)
		if (this.#inquiryKeys.length > 0) {
			this.#pollTimer = setTimeout(() => this.#sendNextInquiry(), 200)
		}
	}

	#schedulePollWithBackoff() {
		if (this.#pollTimer) clearTimeout(this.#pollTimer)
		if (this.#inquiryKeys.length === 0) return
		const baseDelay = 200
		const maxDelay = 10000
		const delay = Math.min(baseDelay * Math.pow(2, this.#consecutiveTimeouts), maxDelay)
		this.#pollTimer = setTimeout(() => this.#sendNextInquiry(), delay)
	}

	#sendNextInquiry() {
		this.#pollTimer = null
		if (this.#inquiryKeys.length === 0 || !this.#cts) return
		if (!this.#instance.udpSocket) return

		// At the end of each main cycle, interleave one low-priority inquiry
		if (this.#nextInquiry >= this.#inquiryKeys.length) {
			this.#nextInquiry = 0
			if (this.#lowPriorityKeys.length > 0) {
				if (this.#nextLowPriority >= this.#lowPriorityKeys.length) this.#nextLowPriority = 0
				const lpKey = this.#lowPriorityKeys[this.#nextLowPriority++]
				this.sendLowPriorityInquiry(lpKey)
				return
			}
		}

		const key = this.#inquiryKeys[this.#nextInquiry++]

		const camId = parseInt(this.#instance.state.viscaId)
		const keyBytes = Buffer.from(key, 'hex')
		const payload = Buffer.alloc(keyBytes.length + 2)
		payload[0] = camId
		keyBytes.copy(payload, 1)
		payload[payload.length - 1] = 0xff

		const callback = this.#inquiryCallbacks[key]
		this.#sendPacket({ payload, type: INQUIRY, callback, inquiryKey: key })
	}

	#recordInquiryResult(key, success) {
		if (!this.#inquiryTelemetry[key]) {
			this.#inquiryTelemetry[key] = { success: 0, failed: 0 }
		}
		if (success) {
			this.#inquiryTelemetry[key].success++
		} else {
			this.#inquiryTelemetry[key].failed++
		}
		const t = this.#inquiryTelemetry[key]
		if (t.failed > 10 && t.success === 0 && this.#totalSuccesses > 50) {
			const idx = this.#inquiryKeys.indexOf(key)
			if (idx !== -1) {
				this.#inquiryKeys.splice(idx, 1)
				this.#instance.log('warn', `Removed unsupported inquiry block ${key}`)
			}
		}
	}

	#logError(payload) {
		if (payload.length < 3) return
		const errorCode = payload[2]
		const errors = {
			0x01: 'Message length error',
			0x02: 'Syntax error',
			0x03: 'Command buffer full',
			0x04: 'Command cancelled',
			0x05: 'No socket',
			0x41: 'Command not executable',
		}
		const errorText = errors[errorCode] ?? 'Unknown VISCA error'
		this.#instance.log('warn', `VISCA error 0x${errorCode.toString(16).padStart(2, '0')}: ${errorText}`)
		this.#instance.log('debug', `VISCA error payload: ${this.msgToString(payload, false)}`)
	}
}
