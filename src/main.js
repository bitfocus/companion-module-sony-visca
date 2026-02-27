import { InstanceBase, InstanceStatus, runEntrypoint, UDPHelper } from '@companion-module/base'
import { getChoices, CHOICES } from './choices.js'
import { UpgradeScripts } from './upgrades.js'
import { getConfigDefinitions } from './config.js'
import { getFeedbackDefinitions } from './feedbacks.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import { initVariables, updateVariables } from './variables.js'
import { Visca } from './visca.js'

class SonyVISCAInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.initVariables = initVariables
		this.updateVariables = updateVariables
		this.VISCA = new Visca(this)
		this.recordingStatusPollInterval = undefined
		this.recordingPulseInterval = undefined
	}

	async init(config) {
		this.updateStatus(InstanceStatus.Disconnected)
		if (!config.model) {
			config.model = 'other'
		}
		if (!config.frameRate) {
			config.frameRate = '60'
		}
		this.config = config
		this.choices = getChoices(config, this)
		this.state = {
			ptSlowMode: 'normal',
			zoomMode: 'optical',
			focusMode: 'auto',
			exposureMode: 'auto',
			expCompOnOff: 'off',
			backlightComp: 'off',
			spotlightComp: 'off',
			recordingStatus: 'unknown',
			recordingPulsePhase: false,
			viscaId: this.config.id,
			presetSelector: 1,
		}
		this.speed = { pan: 0x0c, tilt: 0x0c, zoom: 1, focus: 1 }

		this.setFeedbackDefinitions(getFeedbackDefinitions(this))
		this.setActionDefinitions(getActionDefinitions(this))
		this.setPresetDefinitions(getPresetDefinitions(this))
		this.initVariables()
		this.startRecordingPulseTimer()
		this.init_udp()
		this.updateVariables()
	}

	// When module gets deleted
	async destroy() {
		this.clearRecordingStatusPollTimer()
		this.clearRecordingPulseTimer()
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}
	}

	async configUpdated(config) {
		this.config = config
		this.choices = getChoices(config, this)
		this.setActionDefinitions(getActionDefinitions(this))
		if (!this.isFr7Model()) {
			this.updateRecordingStatus('unknown')
		}
		this.init_udp()
	}

	// Return config fields for web config
	getConfigFields() {
		return getConfigDefinitions(CHOICES)
	}

	init_udp() {
		this.clearRecordingStatusPollTimer()
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
			this.updateStatus(InstanceStatus.Disconnected)
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.udp = new UDPHelper(this.config.host, this.config.port)

			// Reset sequence number
			this.VISCA.send('\x01', this.VISCA.control)
			this.packet_counter = 0

			this.udp.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			// If the status is 'listening', connection should be established
			this.udp.on('listening', () => {
				this.log('info', 'UDP listening')
				this.updateStatus(InstanceStatus.Ok)
				this.startRecordingStatusPollTimer()
			})

			this.udp.on('status_change', (status, message) => {
				this.log('info', 'UDP status_change: ' + status)
				this.updateStatus(status, message)
			})

			this.udp.on('data', (msg) => {
				this.processUdpData(msg)
			})
		} else {
			this.log('error', 'No host configured')
			this.updateStatus(InstanceStatus.BadConfig)
		}
		this.log('info', 'Connection Initialized')
	}

	isFr7Model() {
		return this.config.model === '051E' || this.config.model === '051Ek'
	}

	clearRecordingStatusPollTimer() {
		if (this.recordingStatusPollInterval) {
			clearInterval(this.recordingStatusPollInterval)
			this.recordingStatusPollInterval = undefined
		}
	}

	clearRecordingPulseTimer() {
		if (this.recordingPulseInterval) {
			clearInterval(this.recordingPulseInterval)
			this.recordingPulseInterval = undefined
		}
	}

	startRecordingStatusPollTimer() {
		this.clearRecordingStatusPollTimer()
		if (!this.isFr7Model() || !this.udp || this.udp.isDestroyed) {
			return
		}
		this.sendRecordingStatusInquiry()
		this.recordingStatusPollInterval = setInterval(() => {
			this.sendRecordingStatusInquiry()
		}, 1000)
	}

	startRecordingPulseTimer() {
		this.clearRecordingPulseTimer()
		this.recordingPulseInterval = setInterval(() => {
			if (this.state.recordingStatus !== 'recording') {
				if (this.state.recordingPulsePhase) {
					this.state.recordingPulsePhase = false
					this.checkFeedbacks()
				}
				return
			}
			this.state.recordingPulsePhase = !this.state.recordingPulsePhase
			this.checkFeedbacks()
		}, 500)
	}

	sendRecordingStatusInquiry() {
		if (!this.isFr7Model() || !this.udp || this.udp.isDestroyed) {
			return
		}
		const camId = String.fromCharCode(parseInt(this.state.viscaId))
		this.VISCA.send(camId + '\x09\x7E\x04\x1E\xFF', this.VISCA.inquiry)
	}

	processUdpData(msg) {
		if (!Buffer.isBuffer(msg) || msg.length < 12) {
			return
		}

		const payloadLength = msg.readUInt16BE(2)
		const payloadStart = 8
		const payloadEnd = payloadStart + payloadLength
		if (payloadLength < 4 || payloadEnd > msg.length) {
			return
		}

		const payload = msg.subarray(payloadStart, payloadEnd)

		this.logViscaErrorPayload(payload)

		// FR7 recording status inquiry response: y0 50 0p FF, p: 0 standby, 1 recording
		if ((payload[0] & 0xf0) === 0x90 && payload.length === 4 && payload[1] === 0x50 && payload[3] === 0xff) {
			const status = payload[2] & 0x0f
			if (status === 0) {
				this.updateRecordingStatus('standby')
			} else if (status === 1) {
				this.updateRecordingStatus('recording')
			}
		}
	}

	logViscaErrorPayload(payload) {
		// Camera error packet format: z0 6y zz FF
		if ((payload[0] & 0xf0) !== 0x90 || payload.length !== 4 || (payload[1] & 0xf0) !== 0x60 || payload[3] !== 0xff) {
			return
		}

		const errorCode = payload[2]
		const knownErrors = {
			0x01: 'Message length error',
			0x02: 'Syntax error',
			0x03: 'Command buffer full',
			0x04: 'Command canceled',
			0x05: 'No socket',
			0x41: 'Command not executable',
		}
		const errorText = knownErrors[errorCode] ?? 'Unknown VISCA error'
		this.log('warn', `VISCA error 0x${errorCode.toString(16).padStart(2, '0')}: ${errorText}`)
		this.log('debug', `VISCA error payload: ${this.VISCA.msgToString(payload, false)}`)
	}

	updateRecordingStatus(status) {
		if (this.state.recordingStatus === status) {
			return
		}
		this.state.recordingStatus = status
		if (status !== 'recording') {
			this.state.recordingPulsePhase = false
		}
		this.setVariableValues({ recordingStatus: status })
		this.checkFeedbacks()
	}
}

runEntrypoint(SonyVISCAInstance, UpgradeScripts)
