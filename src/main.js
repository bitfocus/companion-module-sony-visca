import { InstanceBase, InstanceStatus, runEntrypoint, UDPHelper } from '@companion-module/base'
import { getChoices, CHOICES } from './choices.js'
import { UpgradeScripts } from './upgrades.js'
import { getConfigDefinitions } from './config.js'
import { getFeedbackDefinitions } from './feedbacks.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import { initVariables, updateVariables } from './variables.js'

class SonyVISCAInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		this.initVariables = initVariables
		this.updateVariables = updateVariables
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
		this.VISCA = {
			// VISCA Communication Types
			command: Buffer.from([0x01, 0x00]),
			control: Buffer.from([0x02, 0x00]),
			inquiry: Buffer.from([0x01, 0x10]),

			send: (payload, type = this.VISCA.command) => {
				const buffer = Buffer.alloc(32)
				type.copy(buffer)

				this.packet_counter = (this.packet_counter + 1) % 0xffffffff

				buffer.writeUInt16BE(payload.length, 2)
				buffer.writeUInt32BE(this.packet_counter, 4)

				if (typeof payload == 'string') {
					buffer.write(payload, 8, 'binary')
				} else if (typeof payload == 'object' && payload instanceof Buffer) {
					payload.copy(buffer, 8)
				}

				const newBuffer = buffer.slice(0, 8 + payload.length)
				this.log('debug', 'send: ' + this.viscaToString(newBuffer))
				let lastCmdSent = this.viscaToString(newBuffer).slice(30)
				this.setVariableValues({ lastCmdSent: lastCmdSent })
				this.udp.send(newBuffer)
			},
		}

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
		this.choices = getChoices(config)
		this.setActionDefinitions(getActionDefinitions(this))
		this.init_udp()
	}

	// Return config fields for web config
	getConfigFields() {
		return getConfigDefinitions(CHOICES)
	}

	viscaToString(payload) {
		let response = payload.toString('hex').replaceAll(' ', '')

		let s = response.substr(0, 2)
		for (let i = 2; i < response.length; i = i + 2) {
			if (i == 4 || i == 8 || i == 16) {
				s += ' | '
			} else {
				s += ' '
			}
			s += response.substr(i, 2)
		}
		return s
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
				this.log('debug', 'UDP status_change: ' + status)
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
