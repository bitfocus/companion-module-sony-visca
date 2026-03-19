import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'
import { getChoices, CHOICES } from './choices.js'
import { UpgradeScripts } from './upgrades.js'
import { getConfigDefinitions } from './config.js'
import { getFeedbackDefinitions } from './feedbacks.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import { initVariables, updateVariables } from './variables.js'
import { MODELS } from './models.js'
import { INQUIRY_BLOCKS, parseInquiryResponse } from './inquiries.js'
import { INQUIRY_PROFILES } from './inquiry-profiles.js'
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
			config.model = 'other_all'
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

		this.registerDefinitions()
		this.startRecordingPulseTimer()
		this.setupInquiries()
		this.init_udp()
		this.updateVariables()
	}

	// When module gets deleted
	async destroy() {
		this.VISCA.stopPolling()
		this.clearRecordingStatusPollTimer()
		this.clearRecordingPulseTimer()
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
		this.registerDefinitions()
		if (!this.isFr7Model()) {
			this.updateRecordingStatus('unknown')
		}
		this.VISCA.stopPolling()
		this.setupInquiries()
		this.init_udp()
	}

	registerDefinitions() {
		const actions = getActionDefinitions(this)
		this.setActionDefinitions(actions)

		const actionIds = new Set(Object.keys(actions))
		this.setPresetDefinitions(getPresetDefinitions(this, actionIds))
		this.setFeedbackDefinitions(getFeedbackDefinitions(this))

		const modelId = this.config.model
		const model = MODELS.find((m) => m.id === modelId)
		if (modelId === 'other_min') {
			this.initVariables(new Set(), modelId)
		} else if (modelId === 'other_all') {
			this.initVariables(undefined, modelId)
		} else {
			const profileKeys = INQUIRY_PROFILES[model?.group] ?? INQUIRY_PROFILES['1a']
			this.initVariables(new Set(profileKeys), modelId)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return getConfigDefinitions(CHOICES)
	}

	init_udp() {
		this.clearRecordingStatusPollTimer()
		if (this.udpSocket) {
			try {
				this.udpSocket.close()
			} catch {
				// ignore
			}
			this.udpSocket = null
			this.updateStatus(InstanceStatus.Disconnected)
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.viscaHost = this.config.host
			this.viscaPort = parseInt(this.config.port) || 52381

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
				this.log('info', `SharedUDP listening on port ${this.viscaPort}`)
				this.updateStatus(InstanceStatus.Ok)
				this.startRecordingStatusPollTimer()
				this.VISCA.resetSequenceNumber()
				this.VISCA.startLowPriorityPolling()
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
		if (!this.isFr7Model() || !this.udpSocket) {
			return
		}
		const camId = String.fromCharCode(parseInt(this.state.viscaId))
		this.VISCA.send(camId + '\x09\x7E\x04\x1E\xFF', this.VISCA.inquiry, (payload) => {
			if (payload.length >= 4 && payload[1] === 0x50) {
				const status = payload[2] & 0x0f
				if (status === 0) this.updateRecordingStatus('standby')
				else if (status === 1) this.updateRecordingStatus('recording')
			}
		})
	}

	setupInquiries() {
		const model = MODELS.find((m) => m.id === this.config.model)
		const profileKeys = INQUIRY_PROFILES[model?.group] ?? INQUIRY_PROFILES['1a']
		const callbacks = {}
		for (const key of profileKeys) {
			const blockDef = INQUIRY_BLOCKS[key]
			if (!blockDef) continue
			callbacks[key] = (payload) => {
				if (parseInquiryResponse(blockDef, payload, this.state, this.choices)) {
					this.updateVariables()
					this.checkFeedbacks()
				}
			}
		}
		// CAM_PanTiltPosInq: 8x 09 06 12 FF → y0 50 0p 0p 0p 0p 0t 0t 0t 0t FF
		callbacks['090612'] = (payload) => {
			if (payload.length >= 10 && payload[1] === 0x50) {
				const panRaw =
					((payload[2] & 0x0f) << 12) | ((payload[3] & 0x0f) << 8) | ((payload[4] & 0x0f) << 4) | (payload[5] & 0x0f)
				const tiltRaw =
					((payload[6] & 0x0f) << 12) | ((payload[7] & 0x0f) << 8) | ((payload[8] & 0x0f) << 4) | (payload[9] & 0x0f)
				// Convert to signed 16-bit
				this.state.panPosition = panRaw > 0x7fff ? panRaw - 0x10000 : panRaw
				this.state.tiltPosition = tiltRaw > 0x7fff ? tiltRaw - 0x10000 : tiltRaw
				this.updateVariables()
			}
		}
		this.VISCA.initializeInquiries(callbacks)
		this.setupLowPriorityInquiries()
	}

	setupLowPriorityInquiries() {
		const callbacks = {
			// CAM_PanTiltSlowInq: 8x 09 06 44 FF → y0 50 0p FF (p: 2=On, 3=Off)
			'090644': (payload) => {
				if (payload.length >= 3 && payload[1] === 0x50) {
					const prev = this.state.ptSlowMode
					this.state.ptSlowMode = payload[2] === 0x02 ? 'slow' : 'normal'
					if (this.state.ptSlowMode !== prev) {
						this.updateVariables()
						this.checkFeedbacks()
					}
				}
			},
		}
		this.VISCA.initializeLowPriorityInquiries(callbacks)
	}

	updateRecordingStatus(status) {
		if (this.state.recordingStatus === status) {
			return
		}
		this.state.recordingStatus = status
		if (status !== 'recording') {
			this.state.recordingPulsePhase = false
		}
		if (this.activeVariableIds?.has('recordingStatus')) {
			this.setVariableValues({ recordingStatus: status })
		}
		this.checkFeedbacks()
	}
}

runEntrypoint(SonyVISCAInstance, UpgradeScripts)
