const { InstanceBase, Regex, runEntrypoint, InstanceStatus, UDPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const GetFeedbacks = require('./feedbacks')
const GetPresets = require('./presets')
const CHOICES = require('./choices')

class SonyVISCAInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.data = { exposureMode: 'Auto', expCompState: 'On' }
		this.updateStatus(InstanceStatus.Disconnected)
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
				this.udp.send(newBuffer)
			},
		}

		this.ptSpeed = '0C'
		this.updateFeedbacks()
		this.updateActions() // export actions
		this.updatePresets()
		this.init_udp()
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
		this.init_udp()
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module controls PTZ cameras with VISCA over IP protocol',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 6,
				regex: Regex.PORT,
				default: '52381',
			},
			{
				type: 'dropdown',
				id: 'id',
				label: 'camera id',
				width: 6,
				default: '128',
				choices: CHOICES.CAMERA_ID,
			},
		]
	}

	updateFeedbacks() {
		this.setFeedbackDefinitions(GetFeedbacks(this))
	}

	updateActions() {
		UpdateActions(this)
	}

	updatePresets() {
		this.setPresetDefinitions(GetPresets(this))
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
