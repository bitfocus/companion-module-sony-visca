const { InstanceBase, Regex, runEntrypoint, InstanceStatus, UDPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const CHOICES = require('./choices')

class SonyVISCAInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Disconnected)
		this.VISCA = {
			// VISCA Communication Types
			command: Buffer.from([0x01, 0x00]),
			control: Buffer.from([0x02, 0x00]),
			inquiry: Buffer.from([0x01, 0x10]),

			send: (payload, type = this.VISCA.command) => {
				// this.log('debug', 'cmd ' + this.formatBufferAsString(this.VISCA.command))
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

				this.log('debug', 'sending VISCA [' + this.VISCA.formatBufferAsString(newBuffer) + '] to ' + this.config.host)
				this.udp.send(newBuffer)
			},

			formatBufferAsString: (buffer) => {
				let str = ''
				for (let i = 0; i < buffer.length; i++) {
					if (i == 2 || (i > 0 && !(i % 4))) str += '| '
					str += buffer[i].toString(16).padStart(2, '0') + ' '
				}
				return str
			},
		}

		this.ptSpeed = '0C'
		this.updateActions() // export actions
		this.init_udp()

		// this.VISCA.send('\x81\x01\x06\x01\xFF', this.VISCA.inquiry)
	}

	// When module gets deleted
	async destroy() {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}
		this.log('debug', `destroy() completed`)
	}

	async configUpdated(config) {
		this.config = config
		// this.camId = String.fromCharCode(parseInt(self.config.id))
		this.log('info', 'new config = ' + JSON.stringify(config, undefined, 2))
		this.init_udp()
		this.log('debug', 'configUpdated() completed')
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

	updateActions() {
		UpdateActions(this)
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
			// Optionally bind to port 52381 to get camera responses. Only one instance can bind to a single outbound port at a time though.
			// this.udp = new UDPHelper(this.config.host, this.config.port, { bind_port: 52381 })

			// Reset sequence number
			// this.sendControlCommand('\x01')
			this.VISCA.send('\x01', this.VISCA.control)
			// VISCA.hello()
			this.packet_counter = 0

			this.udp.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			// If we status is 'listening', connection should be established
			this.udp.on('listening', () => {
				this.log('info', 'UDP listening')
				this.updateStatus(InstanceStatus.Ok)
				this.log('debug', InstanceStatus.Ok)
				// sample Inquiry to get camera info
				// this.sendVISCAInquiry(String.fromCharCode(parseInt(this.config.id)) + '\x09\x00\x02\xFF')
			})

			this.udp.on('status_change', (status, message) => {
				this.log('debug', 'UDP status_change(' + status + ', ' + message + ')')
				this.updateStatus(status, message)
			})

			// TODO: Handle Response Data
			//       This is especially challenging because all cameras send their
			//       response to the same port (52381) and only one instance can
			//	     listen to that port at a time.

			// this.udp.on('data', (data) => {

			// 	// VISCA Reply Packet:
			// 	//     VISCA Reply |  len  |     seq     | payload
			// 	// ACK:      01 11 | 00 03 | 00 00 00 16 | 90 4x ff
			// 	// Complete: 01 11 | 00 03 | 00 00 00 16 | 90 5c ff
			// 	this.log('debug', 'UDP data: ' + this.formatBufferAsString(data))
			// })

			// Inquiry Packet Reply Packet
			// CAM_VersionInq 8X 09 00 02 FF Y0 50 GG GG HH HH JJ JJ KK FF
			// X = 1 to 7: Address of the unit (Locked to “X = 1” for VISCA over IP)
			// Y = 9 to F: Address of the unit +8 (Locked to “Y = 9” for VISCA over IP)
			// GGGG = Vender ID
			//   0001: Sony
			// HHHH = Model ID
			//   0519 : BRC-X1000
			//   051A : BRC-H800
			//   051B : BRC-H780
			//   051C : BRC-X400
			//   051D : BRC-X401
			//   0617 : SRG-X400
			//   061C : SRG-X402
			//   0618 : SRG-X120
			//   061A : SRG-201M2
			//   061B : SRG-HD1M2
			// JJJJ = ROM revision
			// KK = Maximum socket # (02)
		} else {
			this.log('error', 'No host configured')
			this.updateStatus(InstanceStatus.BadConfig)
		}
		this.log('debug', 'init_udp() completed')
	}
}

runEntrypoint(SonyVISCAInstance, UpgradeScripts)
