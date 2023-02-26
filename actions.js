const CHOICES = require('./choices')

module.exports = function (self) {
	const camId = String.fromCharCode(parseInt(self.config.id))
	let ptSpeed = String.fromCharCode(parseInt(self.ptSpeed, 16) & 0xff)
	self.setActionDefinitions({
		left: {
			name: 'Pan Left',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + ptSpeed + ptSpeed + '\x01\x03\xFF')
			},
		},
		right: {
			name: 'Pan Right',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + ptSpeed + ptSpeed + '\x02\x03\xFF')
			},
		},
		up: {
			name: 'Tilt Up',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + ptSpeed + ptSpeed + '\x03\x01\xFF')
			},
		},
		down: {
			name: 'Tilt Down',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + ptSpeed + ptSpeed + '\x03\x02\xFF')
			},
		},
		upLeft: {
			name: 'Up Left',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + ptSpeed + ptSpeed + '\x01\x01\xFF')
			},
		},
		upRight: {
			name: 'Up Right',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + ptSpeed + ptSpeed + '\x02\x01\xFF')
			},
		},
		downLeft: {
			name: 'Down Left',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + ptSpeed + ptSpeed + '\x01\x02\xFF')
			},
		},
		downRight: {
			name: 'Down Right',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + ptSpeed + ptSpeed + '\x02\x02\xFF')
			},
		},
		stop: {
			name: 'Pan/Tilt Stop',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + ptSpeed + ptSpeed + '\x03\x03\xFF')
			},
		},
		home: {
			name: 'Pan/Tilt Home',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x04\xFF')
			},
		},
		ptSpeedS: {
			name: 'P/T Speed',
			options: [
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: CHOICES.SPEED,
				},
			],
			callback: async (event) => {
				self.ptSpeed = event.options.speed
				ptSpeed = String.fromCharCode(parseInt(self.ptSpeed, 16) & 0xff)
				// self.VISCA.send(cmd)
			},
			// SAMPLE EVENT RESPONSE
			// event: {
			//     "id": "dXms1abehCE3MUvIBTGvE",
			//     "actionId": "ptSpeedS",
			//     "controlId": "bank:2-18",
			//     "options": { "speed": "18" },
			//     "_deviceId": "streamdeck:CL18I1A00191",
			//     "_page": 2,
			//     "_bank": 18
			// },
		},
		ptSpeedU: {
			name: 'P/T Speed Up',
			options: [],
			callback: async () => {
				const ptSpeedIndex = CHOICES.SPEED.findIndex((item) => item.id === self.ptSpeed)
				if (ptSpeedIndex > 0) {
					self.ptSpeed = CHOICES.SPEED[ptSpeedIndex - 1].id
					ptSpeed = String.fromCharCode(parseInt(self.ptSpeed, 16) & 0xff)
				}
			},
		},
		ptSpeedD: {
			name: 'P/T Speed Down',
			options: [],
			callback: async () => {
				const ptSpeedIndex = CHOICES.SPEED.findIndex((item) => item.id === self.ptSpeed)
				if (ptSpeedIndex < CHOICES.SPEED.length - 1) {
					self.ptSpeed = CHOICES.SPEED[ptSpeedIndex + 1].id
					ptSpeed = String.fromCharCode(parseInt(self.ptSpeed, 16) & 0xff)
				}
			},
		},
		ptSlow: {
			name: 'P/T Slow Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Slow Mode On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				if (event.options.bol == '1') {
					self.VISCA.send(camId + '\x01\x06\x44\x03\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x06\x44\x02\xFF')
				}
			},
		},
		brightnessU: {
			name: 'Brightness +',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0D\x02\xFF')
			},
		},
		brightnessD: {
			name: 'Brightness -',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0D\x03\xFF')
			},
		},
		backlightComp: {
			name: 'Backlight Compensation On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'Backlight Compensation On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				if (event.options.bol == '1') {
					self.VISCA.send(camId + '\x01\x04\x33\x02\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x04\x33\x03\xFF')
				}
			},
		},
		zoomI: {
			name: 'Zoom In',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x07\x02\xFF')
			},
		},
		zoomO: {
			name: 'Zoom Out',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x07\x03\xFF')
			},
		},
		zoomS: {
			name: 'Zoom Stop',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x07\x00\xFF')
			},
		},
		ciZoom: {
			name: 'Clear Image Zoom',
			options: [
				{
					type: 'dropdown',
					label: 'Clear Image On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
				},
			],
			callback: async (event) => {
				if (event.options.bol == '1') {
					self.VISCA.send(camId + '\x01\x04\x06\x04\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x04\x06\x03\xFF')
				}
			},
		},
		camOn: {
			name: 'Power On Camera',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x00\x02\xFF')
			},
		},
		camOff: {
			name: 'Power Off Camera',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x00\x03\xFF')
			},
		},
		wbOutdoor: {
			name: 'Outdoor',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x35\x02\xFF')
			},
		},
		wbIndoor: {
			name: 'Indoor',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x35\x01\xFF')
			},
		},
		focusN: {
			name: 'Focus Near',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x08\x03\xFF')
			},
		},
		focusF: {
			name: 'Focus Far',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x08\x02\xFF')
			},
		},
		focusS: {
			name: 'Focus Stop',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x08\x00\xFF')
			},
		},
		focusM: {
			name: 'Focus Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Auto / Manual Focus',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Auto Focus' },
						{ id: '1', label: 'Manual Focus' },
					],
				},
			],
			callback: async (event) => {
				if (event.options.bol == '1') {
					self.VISCA.send(camId + '\x01\x04\x38\x03\xFF')
					self.data.oaf = 'Manual'
				} else {
					self.VISCA.send(camId + '\x01\x04\x38\x02\xFF')
					self.data.oaf = 'Auto'
				}
				self.checkFeedbacks()
			},
		},
		focusOpaf: {
			name: 'One Push Auto Focus',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x18\x01\xFF')
			},
		},
		expM: {
			name: 'Exposure Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode setting',
					id: 'val',
					choices: [
						{ id: '0', label: 'Full auto' },
						{ id: '1', label: 'Manual' },
						{ id: '2', label: 'Shutter Pri' },
						{ id: '3', label: 'Iris Pri' },
						{ id: '4', label: 'Gain Pri' },
					],
				},
			],
			callback: async (event) => {
				switch (event.options.val) {
					case 0:
						self.VISCA.send(camId + '\x01\x04\x39\x00\xFF')
						self.data.exposureMode = 'Auto'
						break
					case 1:
						self.VISCA.send(camId + '\x01\x04\x39\x03\xFF')
						self.data.exposureMode = 'Manual'
						break
					case 2:
						self.VISCA.send(camId + '\x01\x04\x39\x0A\xFF')
						self.data.exposureMode = 'Shutter Priority'
						break
					case 3:
						self.VISCA.send(camId + '\x01\x04\x39\x0B\xFF')
						self.data.exposureMode = 'Iris Priority'
						break
					case 4:
						self.VISCA.send(camId + '\x01\x04\x39\x0E\xFF')
						self.data.exposureMode = 'Gain Priority'
						break
				}
				self.checkFeedbacks()
			},
		},
		aperture: {
			name: 'Lens Aperture',
			options: [
				{
					type: 'dropdown',
					label: 'Mode setting',
					id: 'val',
					choices: [
						{ id: '0', label: 'Reset' },
						{ id: '1', label: 'Aperture +' },
						{ id: '2', label: 'Aperture -' },
					],
				},
			],
			callback: async (event) => {
				if (event.options.val == 0) {
					self.VISCA.send(camId + '\x01\x04\x02\x00\xFF')
					return
				}
				if (event.options.val == 1) {
					self.VISCA.send(camId + '\x01\x04\x02\x02\xFF')
					return
				}
				if (event.options.val == 2) {
					self.VISCA.send(camId + '\x01\x04\x02\x03\xFF')
					return
				}
			},
		},
		whiteBal: {
			name: 'White Balance Mode',
			options: [
				{
					type: 'dropdown',
					label: 'WB setting',
					id: 'val',
					choices: [
						{ id: '0', label: 'Auto1 - Auto' },
						{ id: '1', label: 'Indoor' },
						{ id: '2', label: 'Outdoor' },
						{ id: '3', label: 'One push WB' },
						{ id: '4', label: 'Auto2 - ATW' },
						{ id: '5', label: 'Manual' },
					],
				},
			],
			callback: async (event) => {
				if (event.options.val == 0) {
					self.VISCA.send(camId + '\x01\x04\x35\x00\xFF')
					return
				}
				if (event.options.val == 1) {
					self.VISCA.send(camId + '\x01\x04\x35\x01\xFF')
					return
				}
				if (event.options.val == 2) {
					self.VISCA.send(camId + '\x01\x04\x35\x02\xFF')
					return
				}
				if (event.options.val == 3) {
					self.VISCA.send(camId + '\x01\x04\x35\x03\xFF')
					return
				}
				if (event.options.val == 4) {
					self.VISCA.send(camId + '\x01\x04\x35\x04\xFF')
					return
				}
				if (event.options.val == 5) {
					self.VISCA.send(camId + '\x01\x04\x35\x05\xFF')
					return
				}
			},
		},
		wbTrigger: {
			name: 'One push WB trigger',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x10\x05\xFF')
			},
		},
		wbCustom: {
			name: 'White Balance - Custom',
			options: [
				{
					type: 'number',
					label: 'Red',
					id: 'rVal',
					tooltip: 'Sets the red gain, 192 is the default',
					min: 0,
					max: 255,
					default: 192,
					step: 1,
				},
				{
					type: 'number',
					label: 'Blue',
					id: 'bVal',
					tooltip: 'Sets the blue gain, 192 is the default',
					min: 0,
					max: 255,
					default: 192,
					step: 1,
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x35\x05\xFF')
				setTimeout(() => {
					// Set Red Gain
					const r = event.options.rVal
						.toString(16)
						.padStart(2, '0')
						.split('')
						.map((x) => String.fromCharCode(parseInt(x, 16)))
					self.VISCA.send(camId + '\x01\x04\x43\x00\x00' + r[0] + r[1] + '\xFF')
					setTimeout(() => {
						// Set Blue Gain
						const b = event.options.bVal
							.toString(16)
							.padStart(2, '0')
							.split('')
							.map((x) => String.fromCharCode(parseInt(x, 16)))
						self.VISCA.send(camId + '\x01\x04\x44\x00\x00' + b[0] + b[1] + '\xFF')
					}, 50)
				}, 50)
			},
		},
		wbRedUp: {
			name: 'White Balance - Red Gain Up',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x03\x02\xFF')
			},
		},
		wbRedDown: {
			name: 'White Balance - Red Gain Down',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x03\x03\xFF')
			},
		},
		wbBlueUp: {
			name: 'White Balance - Blue Gain Up',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x04\x02\xFF')
			},
		},
		wbBlueDown: {
			name: 'White Balance - Blue Gain Down',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x04\x03\xFF')
			},
		},
		wbOffsetReset: {
			name: 'White Balance - Offset Reset',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x7E\x01\x2E\x00\x00\xFF')
			},
		},
		wbOffsetUp: {
			name: 'White Balance - Offset Up',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x7E\x01\x2E\x00\x02\xFF')
			},
		},
		wbOffsetDown: {
			name: 'White Balance - Offset Down',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x7E\x01\x2E\x00\x03\xFF')
			},
		},
		WDR: {
			name: 'Wide Dynamic Range',
			options: [
				{
					type: 'dropdown',
					label: 'WDR Settings',
					id: 'val',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'Low' },
						{ id: '2', label: 'Mid' },
						{ id: '3', label: 'High' },
					],
				},
			],
			callback: async (event) => {
				if (event.options.val == 0) {
					self.VISCA.send(camId + '\x01\x7E\x04\x00\x00\xFF')
					return
				}
				if (event.options.val == 1) {
					self.VISCA.send(camId + '\x01\x7E\x04\x00\x01\xFF')
					return
				}
				if (event.options.val == 2) {
					self.VISCA.send(camId + '\x01\x7E\x04\x00\x02\xFF')
					return
				}
				if (event.options.val == 3) {
					self.VISCA.send(camId + '\x01\x7E\x04\x00\x03\xFF')
					return
				}
			},
		},
		gainU: {
			name: 'Gain Up',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0C\x02\xFF')
			},
		},
		gainD: {
			name: 'Gain Down',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0C\x03\xFF')
			},
		},
		gainS: {
			name: 'Set Gain',
			options: [
				{
					type: 'dropdown',
					label: 'Gain setting',
					id: 'val',
					choices: CHOICES.GAIN,
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x04\x4C\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		irisU: {
			name: 'Iris Up',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0B\x02\xFF')
			},
		},
		irisD: {
			name: 'Iris Down',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0B\x03\xFF')
			},
		},
		irisS: {
			name: 'Set Iris',
			options: [
				{
					type: 'dropdown',
					label: 'Iris setting',
					id: 'val',
					choices: CHOICES.IRIS,
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x04\x4B\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		shutU: {
			name: 'Shutter Up',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0A\x02\xFF')
			},
		},
		shutD: {
			name: 'Shutter Down',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0A\x03\xFF')
			},
		},
		shutS: {
			name: 'Set Shutter',
			options: [
				{
					type: 'dropdown',
					label: 'Shutter setting',
					id: 'val',
					choices: CHOICES.SHUTTER,
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x04\x4A\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		savePset: {
			name: 'Save Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: CHOICES.PRESET,
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x04\x3F\x01' + String.fromCharCode(parseInt(event.options.val, 16) & 0xff) + '\xFF'
				)
			},
		},
		recallPset: {
			name: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: CHOICES.PRESET,
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x04\x3F\x02' + String.fromCharCode(parseInt(event.options.val, 16) & 0xff) + '\xFF'
				)
			},
		},
		speedPset: {
			name: 'Preset Drive Speed',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: CHOICES.PRESET,
				},
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: CHOICES.SPEED,
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId +
						'\x01\x7E\x01\x0B' +
						String.fromCharCode(parseInt(event.options.val, 16) & 0xff) +
						String.fromCharCode(parseInt(event.options.speed, 16) & 0xff) +
						'\xFF'
				)
			},
		},
		tally: {
			name: 'Tally on/off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
				},
			],
			callback: async (event) => {
				if (event.options.bol == 1) {
					self.VISCA.send(camId + '\x01\x7E\x01\x0A\x00\x02\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x7E\x01\x0A\x00\x03\xFF')
				}
			},
		},
	})
}
