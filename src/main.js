import { InstanceBase, InstanceStatus } from '@companion-module/base'
import { promises as dns } from 'dns'
import { getChoices, CHOICES } from './choices.js'
import { UpgradeScripts } from './upgrades.js'
import { getConfigDefinitions } from './config.js'
import { getFeedbackDefinitions } from './feedbacks.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import { initVariables, updateVariables } from './variables.js'
import { MODELS } from './models.js'
import { CAP_ADVANCED, CAP_AUTO_FRAMING, CAP_RAMP_CURVE, CAP_TALLY } from './model-caps.js'
import { getInquiryBlocks, parseInquiryResponse } from './inquiries.js'
import { Visca } from './visca.js'

class SonyVISCAInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.initVariables = initVariables
		this.updateVariables = updateVariables
		this.VISCA = new Visca(this)
		this.recordingStatusPollInterval = undefined
		this.recordingPulseInterval = undefined
		this.udpSocket = null
		this.viscaHost = null
		this.viscaPort = 52381
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
			ptSlowMode: 'Normal',
			zoomMode: 'Optical',
			focusMode: 'Auto',
			exposureMode: 'Auto',
			expCompOnOff: 'Off',
			backlightComp: 'Off',
			spotlightComp: 'Off',
			recordingStatus: 'Unknown',
			recordingPulsePhase: false,
			tallyYellow: 'Off',
			rampCurve: 2,
			lowLightBasisBrightness: 'Off',
			basisBrightnessLevel: 7,
			viscaId: this.config.id,
			presetSelector: 64,
		}
		this.speed = { pan: 0x0c, tilt: 0x0c, zoom: 1, focus: 1 }
		this.tallyKeepaliveTimers = {}

		this.registerDefinitions()
		this.startRecordingPulseTimer()
		this.setupInquiries()
		await this.init_udp()
		this.updateVariables()
	}

	sendTallyCommand(color, on) {
		const camId = String.fromCharCode(parseInt(this.state.viscaId))
		const colorCmd = color === 'green' ? '\x04\x1A' : color === 'yellow' ? '\x04\x11' : '\x01\x0A'
		const onOff = on ? '\x02' : '\x03'
		this.VISCA.send(Buffer.from(camId + '\x01\x7E' + colorCmd + '\x00' + onOff + '\xFF', 'binary'))
	}

	startTallyKeepalive(color) {
		this.stopTallyKeepalive(color, true)
		this.sendTallyCommand(color, true)
		const stateKey = color === 'green' ? 'tallyGreen' : color === 'yellow' ? 'tallyYellow' : 'tallyRed'
		this.state[stateKey] = 'On'
		this.updateVariables()
		this.checkAllFeedbacks()
		this.tallyKeepaliveTimers[color] = setInterval(() => {
			this.sendTallyCommand(color, true)
		}, 10000)
	}

	stopTallyKeepalive(color, skipOff = false) {
		if (this.tallyKeepaliveTimers[color]) {
			clearInterval(this.tallyKeepaliveTimers[color])
			delete this.tallyKeepaliveTimers[color]
		}
		if (!skipOff) {
			this.sendTallyCommand(color, false)
			const stateKey = color === 'green' ? 'tallyGreen' : color === 'yellow' ? 'tallyYellow' : 'tallyRed'
			this.state[stateKey] = 'Off'
			this.updateVariables()
			this.checkAllFeedbacks()
		}
	}

	clearAllTallyKeepalives() {
		for (const color of Object.keys(this.tallyKeepaliveTimers)) {
			clearInterval(this.tallyKeepaliveTimers[color])
		}
		this.tallyKeepaliveTimers = {}
	}

	// When module gets deleted
	async destroy() {
		this.VISCA.stopPolling()
		this.clearRecordingStatusPollTimer()
		this.clearRecordingPulseTimer()
		this.clearAllTallyKeepalives()
		if (this.udpSocket) {
			try {
				this.udpSocket.close()
			} catch {
				// ignore
			}
			this.udpSocket = null
		}
	}

	async configUpdated(config) {
		this.config = config
		this.choices = getChoices(config, this)
		this.clearAllTallyKeepalives()
		this.registerDefinitions()
		if (!this.isFr7Model()) {
			this.updateRecordingStatus('Unknown')
		}
		this.VISCA.stopPolling()
		this.setupInquiries()
		await this.init_udp()
	}

	registerDefinitions() {
		const actions = getActionDefinitions(this)
		this.setActionDefinitions(actions)
		const feedbacks = getFeedbackDefinitions(this)
		this.setFeedbackDefinitions(feedbacks)

		const actionIds = new Set(Object.keys(actions))
		const feedbackIds = new Set(Object.keys(feedbacks))
		const presets = getPresetDefinitions(this, actionIds, feedbackIds)

		const structure = []
		const cats = {}
		const presetKeys = Object.keys(presets)
		for (const id of presetKeys) {
			const cat = presets[id].category || 'Other'
			if (!cats[cat]) cats[cat] = []
			cats[cat].push(id)
		}

		const order = ['Pan/Tilt', 'Lens', 'Exposure', 'Color', 'System', 'Camera', 'Presets', 'Rotation Enabled']
		let sectionCount = 0
		for (const name of order) {
			if (cats[name]) {
				structure.push({
					id: `section-${sectionCount++}`,
					name: name,
					definitions: cats[name],
				})
				delete cats[name]
			}
		}
		for (const name of Object.keys(cats).sort()) {
			structure.push({
				id: `section-${sectionCount++}`,
				name: name,
				definitions: cats[name],
			})
		}

		this.setPresetDefinitions(structure, presets)

		// Initial check for feedbacks if any are registered
		if (feedbackIds.size > 0) {
			this.checkAllFeedbacks()
		}

		const modelId = this.config.model
		const model = MODELS.find((m) => m.id === modelId)
		if (modelId === 'other_min') {
			this.initVariables(new Set(), modelId)
		} else if (modelId === 'other') {
			this.initVariables(undefined, modelId)
		} else {
			const blocks = getInquiryBlocks(model?.group)
			const activeBlockKeys = new Set(Object.keys(blocks))
			// FR7 uses individual inquiries instead of block inquiries.
			// Add standard block keys so block-tagged variables are registered.
			if (model?.group === '4' || model?.group === '6') {
				activeBlockKeys.add('097e7e00')
				activeBlockKeys.add('097e7e01')
				activeBlockKeys.add('097e7e02')
			}
			this.initVariables(activeBlockKeys, modelId)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return getConfigDefinitions(CHOICES)
	}

	async init_udp() {
		this.clearRecordingStatusPollTimer()
		if (this.udpSocket) {
			await new Promise((resolve) => {
				try {
					this.udpSocket.close(resolve)
				} catch {
					resolve()
				}
			})
			this.udpSocket = null
			this.updateStatus(InstanceStatus.Disconnected)
		}

		if (!this.config.host) {
			this.log('error', 'No host configured')
			this.updateStatus(InstanceStatus.BadConfig)
			return
		}

		this.updateStatus(InstanceStatus.Connecting)
		this.viscaPort = parseInt(this.config.port) || 52381

		// Resolve hostname to IPv4 address for response matching and shared socket
		try {
			const { address } = await dns.lookup(this.config.host, { family: 4 })
			this.viscaHost = address
		} catch (err) {
			this.log('error', `DNS resolution failed for "${this.config.host}": ${err.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure, `DNS resolution failed: ${err.message}`)
			return
		}

		const msgHandler = (msg, rinfo) => {
			if (rinfo.address === this.viscaHost) {
				this.VISCA.handleResponse(msg)
			}
		}

		this.udpSocket = this.createSharedUdpSocket('udp4', msgHandler)

		this.udpSocket.on('error', (err) => {
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.log('error', 'Network error: ' + err.message)
		})

		this.udpSocket.bind(this.viscaPort, '', () => {
			this.log('info', `SharedUDP listening on port ${this.viscaPort} → ${this.viscaHost}`)
			this.updateStatus(InstanceStatus.Ok)
			this.startRecordingStatusPollTimer()
			this.VISCA.resetSequenceNumber()
			this.VISCA.startLowPriorityPolling()
		})
		this.log('info', 'Connection Initialized')
	}

	isFr7Model() {
		return this.config.model === '051E' || this.config.model === '051Ek' || this.config.model === '051F'
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
		if (!this.isFr7Model() || !this.udpSocket) {
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
			if (this.state.recordingStatus !== 'Recording') {
				if (this.state.recordingPulsePhase) {
					this.state.recordingPulsePhase = false
					this.checkAllFeedbacks()
				}
				return
			}
			this.state.recordingPulsePhase = !this.state.recordingPulsePhase
			this.checkAllFeedbacks()
		}, 500)
	}

	sendRecordingStatusInquiry() {
		if (!this.isFr7Model() || !this.udpSocket) {
			return
		}
		const camId = String.fromCharCode(parseInt(this.state.viscaId))
		this.VISCA.send(camId + '\x09\x7E\x04\x1E\xFF', this.VISCA.inquiry, (payload) => {
			if (payload.length >= 4 && payload[1] === 0x50) {
				const status = payload[2] & 0x0f
				if (status === 0) this.updateRecordingStatus('Standby')
				else if (status === 1) this.updateRecordingStatus('Recording')
			}
		})
	}

	setupInquiries() {
		const model = MODELS.find((m) => m.id === this.config.model)
		const blocks = getInquiryBlocks(model?.group)
		const callbacks = {}
		for (const [key, blockDef] of Object.entries(blocks)) {
			callbacks[key] = (payload) => {
				if (parseInquiryResponse(blockDef, payload, this.state, this.choices)) {
					this.updateVariables()
					this.checkAllFeedbacks()
				}
			}
		}
		// CAM_PanTiltPosInq: 8x 09 06 12 FF
		// Standard: y0 50 0p 0p 0p 0p 0t 0t 0t 0t FF         (4+4 nibble, 10 bytes)
		// X1000:    y0 50 0p 0p 0p 0p 0p 0t 0t 0t 0t FF      (5+4 nibble, 12 bytes)
		// FR7:      y0 50 0p 0p 0p 0p 0p 0t 0t 0t 0t 0t FF   (5+5 nibble, 13 bytes)
		callbacks['090612'] = (payload) => {
			if (payload[1] !== 0x50) return
			let panRaw, tiltRaw, panBits, tiltBits
			if (payload.length >= 13) {
				// FR7: 5-nibble pan + 5-nibble tilt (20+20 bit)
				panRaw =
					((payload[2] & 0x0f) << 16) |
					((payload[3] & 0x0f) << 12) |
					((payload[4] & 0x0f) << 8) |
					((payload[5] & 0x0f) << 4) |
					(payload[6] & 0x0f)
				tiltRaw =
					((payload[7] & 0x0f) << 16) |
					((payload[8] & 0x0f) << 12) |
					((payload[9] & 0x0f) << 8) |
					((payload[10] & 0x0f) << 4) |
					(payload[11] & 0x0f)
				panBits = 20
				tiltBits = 20
			} else if (payload.length >= 12) {
				// X1000: 5-nibble pan (20-bit) + 4-nibble tilt (16-bit)
				panRaw =
					((payload[2] & 0x0f) << 16) |
					((payload[3] & 0x0f) << 12) |
					((payload[4] & 0x0f) << 8) |
					((payload[5] & 0x0f) << 4) |
					(payload[6] & 0x0f)
				tiltRaw =
					((payload[7] & 0x0f) << 12) | ((payload[8] & 0x0f) << 8) | ((payload[9] & 0x0f) << 4) | (payload[10] & 0x0f)
				panBits = 20
				tiltBits = 16
			} else if (payload.length >= 10) {
				// Standard: 4-nibble pan + 4-nibble tilt (16+16 bit)
				panRaw =
					((payload[2] & 0x0f) << 12) | ((payload[3] & 0x0f) << 8) | ((payload[4] & 0x0f) << 4) | (payload[5] & 0x0f)
				tiltRaw =
					((payload[6] & 0x0f) << 12) | ((payload[7] & 0x0f) << 8) | ((payload[8] & 0x0f) << 4) | (payload[9] & 0x0f)
				panBits = 16
				tiltBits = 16
			} else {
				return
			}
			const panSign = 1 << (panBits - 1)
			const tiltSign = 1 << (tiltBits - 1)
			this.state.panPosition = panRaw >= panSign ? panRaw - (panSign << 1) : panRaw
			this.state.tiltPosition = tiltRaw >= tiltSign ? tiltRaw - (tiltSign << 1) : tiltRaw
			this.updateVariables()
			this.checkAllFeedbacks()
		}
		this.VISCA.initializeInquiries(callbacks)
		this.setupLowPriorityInquiries()
	}

	setupLowPriorityInquiries() {
		// Helper for on/off state updates from y0 50 0p FF responses
		const onOffCallback =
			(stateKey, on = 'On', off = 'Off') =>
			(payload) => {
				if (payload.length >= 4 && payload[1] === 0x50) {
					const prev = this.state[stateKey]
					this.state[stateKey] = payload[2] === 0x02 ? on : off
					if (this.state[stateKey] !== prev) {
						this.updateVariables()
						this.checkAllFeedbacks()
					}
				}
			}

		const callbacks = {
			// CAM_PanTiltSlowInq: 8x 09 06 44 FF → y0 50 0p FF (02=Slow, 03=Normal)
			'090644': onOffCallback('ptSlowMode', 'Slow', 'Normal'),
			// CAM_FocusNearLimitInq: 8x 09 04 28 FF → y0 50 0p 0p 0p 0p FF (16-bit position)
			// Block 00 only returns 2 nibbles (8-bit); this gives full 16-bit precision
			'090428': (payload) => {
				if (payload.length >= 7 && payload[1] === 0x50) {
					const value =
						((payload[2] & 0x0f) << 12) | ((payload[3] & 0x0f) << 8) | ((payload[4] & 0x0f) << 4) | (payload[5] & 0x0f)
					if (this.state.focusNearLimit !== value) {
						this.state.focusNearLimit = value
						this.updateVariables()
					}
				}
			},
		}

		// RampCurveInq: 8x 09 06 31 FF → y0 50 0p FF (p: 1-9)
		if (CAP_RAMP_CURVE.has(this.config.model)) {
			callbacks['090631'] = (payload) => {
				if (payload.length >= 4 && payload[1] === 0x50) {
					const val = payload[2] & 0x0f
					if (this.state.rampCurve !== val) {
						this.state.rampCurve = val
						this.updateVariables()
					}
				}
			}
		}

		// LowLightBasisBrightnessOnOffInq: 8x 09 05 39 FF → y0 50 0p FF (02=On, 03=Off)
		// BasisBrightnessLevelInq: 8x 09 05 49 FF → y0 50 0p FF (p: 4-A)
		if (CAP_ADVANCED.has(this.config.model)) {
			callbacks['090539'] = onOffCallback('lowLightBasisBrightness')
			callbacks['090549'] = (payload) => {
				if (payload.length >= 4 && payload[1] === 0x50) {
					const val = payload[2] & 0x0f
					if (this.state.basisBrightnessLevel !== val) {
						this.state.basisBrightnessLevel = val
						this.updateVariables()
					}
				}
			}
		}

		// FR7-specific individual inquiries — FR7 has no block inquiries, so
		// these low-priority queries provide state that other cameras get from blocks.
		if (this.isFr7Model()) {
			// KneeSettingInq: 8x 09 7E 01 6D FF → y0 50 0p FF (02=On, 03=Off)
			callbacks['097e016d'] = onOffCallback('kneeSetting')
			// KneeModeInq: 8x 09 7E 01 54 FF → y0 50 0p FF (00=Auto, 04=Manual)
			callbacks['097e0154'] = (payload) => {
				if (payload.length >= 4 && payload[1] === 0x50) {
					const prev = this.state.kneeMode
					this.state.kneeMode = payload[2] === 0x04 ? 'Manual' : 'Auto'
					if (this.state.kneeMode !== prev) {
						this.updateVariables()
						this.checkAllFeedbacks()
					}
				}
			}
			// DetailSettingInq: 8x 09 7E 01 60 FF → y0 50 0p FF (02=On, 03=Off)
			callbacks['097e0160'] = onOffCallback('detailMode', 'Manual', 'Auto')
			// AutoIrisInq: 8x 09 05 34 FF → y0 50 0p FF (02=On, 03=Off)
			callbacks['090534'] = onOffCallback('autoIris')
			// AGCInq: 8x 09 7E 01 75 FF → y0 50 0p FF (02=On, 03=Off)
			callbacks['097e0175'] = onOffCallback('agc')
			// AutoShutterInq: 8x 09 05 35 FF → y0 50 0p FF (02=On, 03=Off)
			callbacks['090535'] = onOffCallback('autoShutter')
			// NDFilterModeInq: 8x 09 7E 04 52 FF → y0 50 0p FF (0=Preset, 1=Variable)
			callbacks['097e0452'] = (payload) => {
				if (payload.length >= 4 && payload[1] === 0x50) {
					const prev = this.state.ndFilterMode
					this.state.ndFilterMode = (payload[2] & 0x0f) === 0x01 ? 'Variable' : 'Preset'
					if (this.state.ndFilterMode !== prev) {
						this.updateVariables()
						this.checkAllFeedbacks()
					}
				}
			}
			// AutoNDFilterInq: 8x 09 7E 04 53 FF → y0 50 0p FF (02=On, 03=Off)
			callbacks['097e0453'] = onOffCallback('autoNDFilter')
			// NDClearInq: 8x 09 7E 04 54 FF → y0 50 0p FF (02=Filtered, 03=Clear)
			callbacks['097e0454'] = onOffCallback('ndClear', 'Filtered', 'Clear')
			// CAM_IMGFlipInq: 8x 09 04 66 FF → y0 50 0p FF (02=On/Ceiling, 03=Off/Desktop)
			callbacks['090466'] = onOffCallback('imageFlip')
		}

		// PTZ Auto Framing inquiry — FR7 + SRG-A40/A12
		if (CAP_AUTO_FRAMING.has(this.config.model)) {
			// PTZAutoFramingInq: 8x 09 7E 04 3A FF → y0 50 0p FF (0=Off, 1=On)
			callbacks['097e043a'] = (payload) => {
				if (payload.length >= 4 && payload[1] === 0x50) {
					const prev = this.state.ptzAutoFraming
					this.state.ptzAutoFraming = (payload[2] & 0x0f) === 0x01 ? 'On' : 'Off'
					if (this.state.ptzAutoFraming !== prev) {
						this.updateVariables()
						this.checkAllFeedbacks()
					}
				}
			}
		}

		// Tally inquiries — all tally-capable models get red, FR7 also gets green
		if (CAP_TALLY.has(this.config.model)) {
			// TallyRedInq: 8x 09 7E 01 0A FF → y0 50 0p FF (02=On, 03=Off)
			callbacks['097e010a'] = onOffCallback('tallyRed')
			if (this.isFr7Model()) {
				// TallyGreenInq: 8x 09 7E 04 1A FF → y0 50 0p FF (02=On, 03=Off)
				callbacks['097e041a'] = onOffCallback('tallyGreen')
			}
			if (this.config.model === '051F') {
				// TallyYellowInq: 8x 09 7E 04 11 FF → y0 50 0p FF (02=On, 03=Off)
				callbacks['097e0411'] = onOffCallback('tallyYellow')
			}
		}

		this.VISCA.initializeLowPriorityInquiries(callbacks)
	}

	updateRecordingStatus(status) {
		if (this.state.recordingStatus === status) {
			return
		}
		this.state.recordingStatus = status
		if (status !== 'Recording') {
			this.state.recordingPulsePhase = false
		}
		if (this.activeVariableIds?.has('recordingStatus')) {
			this.setVariableValues({ recordingStatus: status })
		}
		this.checkAllFeedbacks()
	}
}

export default SonyVISCAInstance
export { UpgradeScripts }
