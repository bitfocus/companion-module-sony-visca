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
			viscaId: this.config.id,
			presetSelector: 1,
		}
		this.speed = { pan: 0x0c, tilt: 0x0c, zoom: 1, focus: 1 }

		this.setFeedbackDefinitions(getFeedbackDefinitions(this))
		this.setActionDefinitions(getActionDefinitions(this))
		this.setPresetDefinitions(getPresetDefinitions(this))
		this.initVariables()
		this.init_udp()
		this.updateVariables()
	}

	// When module gets deleted
	async destroy() {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}
	}

	async configUpdated(config) {
		this.config = config
		this.choices = getChoices(config, this)
		this.setActionDefinitions(getActionDefinitions(this))
		this.init_udp()
	}

	// Return config fields for web config
	getConfigFields() {
		return getConfigDefinitions(CHOICES)
	}

	init_udp() {
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
			})

			this.udp.on('status_change', (status, message) => {
				this.log('info', 'UDP status_change: ' + status)
				this.updateStatus(status, message)
			})
		} else {
			this.log('error', 'No host configured')
			this.updateStatus(InstanceStatus.BadConfig)
		}
		this.log('info', 'Connection Initialized')
	}
}

runEntrypoint(SonyVISCAInstance, UpgradeScripts)
