import { CHOICES } from './choices.js'

export function getActionDefinitions(self) {
	const camId = String.fromCharCode(parseInt(self.config.id))
	return {
		...getPanTiltActionDefinitions(self, camId),
		...getLensActionDefinitions(self, camId),
		...getExposureActionDefinitions(self, camId),
		...getColorActionDefinitions(self, camId),
		...getPresetActionDefinitions(self, camId),
		...getMiscActionDefinitions(self, camId),
	}
}
function getPanTiltActionDefinitions(self, camId) {
	let ptSpeed = String.fromCharCode(parseInt(self.ptSpeed, 16) & 0xff)
	return {
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
		// TODO: Upgrade Script (values were wrong)
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
				if (event.options.bol == '0') {
					self.VISCA.send(camId + '\x01\x06\x44\x03\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x06\x44\x02\xFF')
				}
			},
		},
		panSpeedAdjust: {
			name: 'Pan Speed (up/down/default)',
			options: [
				{
					type: 'dropdown',
					label: 'Pan Speed Adjust',
					id: 'val',
					default: '3',
					choices: [
						{ id: '1', label: 'Pan Speed +' },
						{ id: '2', label: 'Pan Speed -' },
						{ id: '3', label: 'Default' },
					],
				},
			],
			callback: async (action) => {
				switch (action.options.val) {
					case '1':
						if (self.speed.pan < 24) self.speed.pan++
						break
					case '2':
						if (self.speed.pan > 1) self.speed.pan--
						break
					case '3':
						self.speed.pan = 12
						break
				}
			},
		},
		tiltSpeedAdjust: {
			name: 'Tilt Speed (up/down/default)',
			options: [
				{
					type: 'dropdown',
					label: 'Tilt Speed Adjust',
					id: 'val',
					default: '3',
					choices: [
						{ id: '1', label: 'Tilt Speed +' },
						{ id: '2', label: 'Tilt Speed -' },
						{ id: '3', label: 'Default' },
					],
				},
			],
			callback: async (action) => {
				switch (action.options.val) {
					case '1':
						if (self.speed.tilt < 24) self.speed.tilt++
						break
					case '2':
						if (self.speed.tilt > 1) self.speed.tilt--
						break
					case '3':
						self.speed.tilt = 12
						break
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		ptSpeedU: {
			name: 'P/T Speed Up . . . . . . deprecated',
			options: [],
			callback: async () => {
				const ptSpeedIndex = CHOICES.SPEED.findIndex((item) => item.id === self.ptSpeed)
				if (ptSpeedIndex > 0) {
					self.ptSpeed = CHOICES.SPEED[ptSpeedIndex - 1].id
					ptSpeed = String.fromCharCode(parseInt(self.ptSpeed, 16) & 0xff)
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		ptSpeedD: {
			name: 'P/T Speed Down . . . . . . deprecated',
			options: [],
			callback: async () => {
				const ptSpeedIndex = CHOICES.SPEED.findIndex((item) => item.id === self.ptSpeed)
				if (ptSpeedIndex < CHOICES.SPEED.length - 1) {
					self.ptSpeed = CHOICES.SPEED[ptSpeedIndex + 1].id
					ptSpeed = String.fromCharCode(parseInt(self.ptSpeed, 16) & 0xff)
				}
			},
		},
		speedSet: {
			name: 'Pan and/or Tilt Speed Set',
			options: [
				{
					type: 'checkbox',
					label: 'Set Pan Value',
					id: 'pSet',
					default: true,
				},
				{
					type: 'checkbox',
					label: 'Set Tilt Value',
					id: 'tSet',
					default: true,
				},
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'speed',
					default: '0C',
					choices: CHOICES.SPEED,
				},
			],
			callback: async (action) => {
				const speed = parseInt(action.options.speed, 16)
				if (action.options.pSet) {
					self.speed.pan = speed
				}
				if (action.options.tSet) {
					self.speed.tilt = speed
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		ptSpeedS: {
			name: 'P/T Speed Set . . . . . . deprecated',
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
			},
		},
	}
}

function getLensActionDefinitions(self, camId) {
	return {
		zoomI: {
			name: 'Zoom In - standard speed',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x07\x02\xFF')
			},
		},
		zoomO: {
			name: 'Zoom Out - standard speed',
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
		// TODO: Add variable rework feedback
		zoomMode: {
			name: 'Zoom Mode (digital/optical/clear image)',
			options: [
				{
					type: 'dropdown',
					label: 'Zoom Mode',
					id: 'mode',
					choices: [
						{ id: '2', label: 'Digital' },
						{ id: '3', label: 'Optical only' },
						{ id: '4', label: 'Clear Image Zoom' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x06' + String.fromCharCode(parseInt(event.options.mode, 16) & 0xff) + '\xFF')
				self.data.zoomMode = event.options.mode
				self.checkFeedbacks()
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		ciZoom: {
			name: 'Clear Image Zoom . . . . . . deprecated',
			options: [
				{
					type: 'dropdown',
					label: 'Clear Image On/Off',
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
					self.VISCA.send(camId + '\x01\x04\x06\x04\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x04\x06\x03\xFF')
				}
			},
		},
		focusM: {
			name: 'Focus Mode (auto/manual)',
			options: [
				{
					type: 'dropdown',
					label: 'Auto / Manual Focus',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Auto Focus' },
						{ id: '1', label: 'Manual Focus' },
					],
					default: '0',
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
		focusN: {
			name: 'Focus Near - standard speed',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x08\x03\xFF')
			},
		},
		focusF: {
			name: 'Focus Far - standard speed',
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
		focusOpaf: {
			name: 'One Push Auto Focus',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x18\x01\xFF')
			},
		},
	}
}

function getExposureActionDefinitions(self, camId) {
	return {
		// TODO Add variable and rework feedbacks
		expM: {
			name: 'Exposure Mode (auto/manual/shutter/iris/gain priority)',
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
					default: '0',
				},
			],
			callback: async (event) => {
				switch (parseInt(event.options.val)) {
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
		irisAdjust: {
			name: 'Iris Adjust (up/down)',
			options: [
				{
					type: 'dropdown',
					label: 'Iris setting',
					id: 'val',
					choices: [
						{ id: '1', label: 'Iris Up' },
						{ id: '2', label: 'Iris Down' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				switch (parseInt(event.options.val)) {
					case 1:
						self.VISCA.send(camId + '\x01\x04\x0B\x02\xFF')
						break
					case 2:
						self.VISCA.send(camId + '\x01\x04\x0B\x03\xFF')
						break
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		irisU: {
			name: 'Iris Up . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0B\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		irisD: {
			name: 'Iris Down . . . . . . deprecated',
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
					label: 'Iris adjust',
					id: 'val',
					choices: CHOICES.IRIS,
					default: '15',
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x04\x4B\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		gainAdjust: {
			name: 'Gain Adjust (up/down)',
			options: [
				{
					type: 'dropdown',
					label: 'Gain adjust',
					id: 'val',
					default: '1',
					choices: [
						{ id: '1', label: 'Gain Up' },
						{ id: '2', label: 'Gain Down' },
					],
				},
			],
			callback: async (event) => {
				switch (parseInt(event.options.val)) {
					case 1:
						self.VISCA.send(camId + '\x01\x04\x0C\x02\xFF')
						break
					case 2:
						self.VISCA.send(camId + '\x01\x04\x0C\x03\xFF')
						break
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		gainU: {
			name: 'Gain Up . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0C\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		gainD: {
			name: 'Gain Down . . . . . . deprecated',
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
					default: '01',
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x04\x4C\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		shutterAdjust: {
			name: 'Shutter Adjust (up/down)',
			options: [
				{
					type: 'dropdown',
					label: 'Shutter adjust',
					id: 'val',
					choices: [
						{ id: '1', label: 'Shutter Up' },
						{ id: '2', label: 'Shutter Down' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				switch (parseInt(event.options.val)) {
					case 1:
						self.VISCA.send(camId + '\x01\x04\x0A\x02\xFF')
						break
					case 2:
						self.VISCA.send(camId + '\x01\x04\x0A\x03\xFF')
						break
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		shutU: {
			name: 'Shutter Up . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0A\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		shutD: {
			name: 'Shutter Down . . . . . . deprecated',
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
		brightness: {
			name: 'Brightness Adjust (up/down)',
			options: [
				{
					type: 'dropdown',
					label: 'Brightness adjust',
					id: 'val',
					choices: [
						{ id: '1', label: 'Brightness Up' },
						{ id: '2', label: 'Brightness Down' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				switch (parseInt(event.options.val)) {
					case '1':
						self.VISCA.send(camId + '\x01\x04\x0D\x02\xFF')
						break
					case '2':
						self.VISCA.send(camId + '\x01\x04\x0D\x03\xFF')
						break
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		brightnessU: {
			name: 'Brightness Up . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0D\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		brightnessD: {
			name: 'Brightness Down . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0D\x03\xFF')
			},
		},
		exposureCompOnOff: {
			name: 'Exposure Compensation On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'Exposure Compensation On/Off',
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
					self.VISCA.send(camId + '\x01\x04\x3E\x02\xFF')
					self.data.expCompState = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x3E\x03\xFF')
					self.data.expCompState = 'Off'
				}
				self.checkFeedbacks()
			},
		},
		exposureComp: {
			name: 'Exposure Compensation (up/down/reset)',
			options: [
				{
					type: 'dropdown',
					label: 'Exp Comp Adjust',
					id: 'val',
					default: '3',
					choices: [
						{ id: '1', label: 'Exposure Compensation +' },
						{ id: '2', label: 'Exposure Compensation -' },
						{ id: '3', label: 'Reset' },
					],
				},
			],
			callback: async (event) => {
				if (event.options.val == 1) {
					self.VISCA.send(camId + '\x01\x04\x0E\x02\xFF')
					return
				}
				if (event.options.val == 2) {
					self.VISCA.send(camId + '\x01\x04\x0E\x03\xFF')
					return
				}
				if (event.options.val == 3) {
					self.VISCA.send(camId + '\x01\x04\x0E\x00\xFF')
					return
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		exposureCompU: {
			name: 'Exposure Compensation Up . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0E\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		exposureCompD: {
			name: 'Exposure Compensation Down . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0E\x03\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		exposureCompReset: {
			name: 'Exposure Compensation Reset . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x0E\x00\xFF')
			},
		},
		exposureCompDirect: {
			name: 'Exposure Compensation Set Value',
			options: [
				{
					type: 'dropdown',
					label: 'Offset',
					id: 'offset',
					choices: CHOICES.EXPOSURE_COMPENSATION,
					default: '07',
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x04\x4E\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.offset, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(event.options.offset, 16) & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		aperture: {
			name: 'Aperture Compensation (up/down/reset)',
			options: [
				{
					type: 'dropdown',
					label: 'Mode setting',
					id: 'val',
					choices: [
						{ id: '1', label: 'Aperture +' },
						{ id: '2', label: 'Aperture -' },
						{ id: '3', label: 'Reset' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				if (event.options.val == 1) {
					self.VISCA.send(camId + '\x01\x04\x02\x02\xFF')
					return
				}
				if (event.options.val == 2) {
					self.VISCA.send(camId + '\x01\x04\x02\x03\xFF')
					return
				}
				if (event.options.val == 3) {
					self.VISCA.send(camId + '\x01\x04\x02\x00\xFF')
					return
				}
			},
		},
		WDR: {
			name: 'Wide Dynamic Range (off/low/mid/high)',
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
					default: '0',
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
		noiseReduction: {
			name: 'Noise Reduction Level (off-strong)',
			options: [
				{
					type: 'dropdown',
					label: 'Noise Reduction Level',
					id: 'level',
					choices: [
						{ id: '0', label: '0-Off' },
						{ id: '1', label: '1-Weak' },
						{ id: '2', label: '2' },
						{ id: '3', label: '3-Default' },
						{ id: '4', label: '4' },
						{ id: '5', label: '5-Strong' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x53' + String.fromCharCode(parseInt(event.options.level, 16) & 0xff) + '\xFF')
			},
		},
		backlightComp: {
			name: 'Backlight Compensation (on/off)',
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
					self.data.backlightComp = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x33\x03\xFF')
					self.data.backlightComp = 'Off'
				}
				self.checkFeedbacks()
			},
		},
		spotlightComp: {
			name: 'Spotlight Compensation (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Spotlight Compensation On/Off',
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
					self.VISCA.send(camId + '\x01\x04\x3A\x02\xFF')
					self.data.spotlightComp = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x3A\x03\xFF')
					self.data.spotlightComp = 'Off'
				}
				self.checkFeedbacks()
			},
		},
	}
}

function getColorActionDefinitions(self, camId) {
	return {
		whiteBal: {
			name: 'White Balance Mode (auto/indoor/outdoor/one push/ATW/manual)',
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
					default: '0',
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
		// TODO: Add to upgrade scripts and merge with whiteBal
		wbOutdoor: {
			name: 'Outdoor . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x35\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with whiteBal
		wbIndoor: {
			name: 'Indoor . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x35\x01\xFF')
			},
		},

		wbTrigger: {
			name: 'One push WB trigger',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x10\x05\xFF')
			},
		},
		wbAdjust: {
			name: 'White Balance Adjust (red/blue - up/down)',
			options: [
				{
					type: 'dropdown',
					label: 'Red/Blue',
					id: 'rb',
					choices: [
						{ id: 'r', label: 'Red' },
						{ id: 'b', label: 'Blue' },
					],
					default: 'r',
				},
				{
					type: 'dropdown',
					label: 'Up/Down',
					id: 'val',
					choices: [
						{ id: '1', label: 'Up' },
						{ id: '2', label: 'Down' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				if (event.options.rb == 'r') {
					if (event.options.val == '1') {
						self.VISCA.send(camId + '\x01\x04\x03\x02\xFF')
					} else {
						self.VISCA.send(camId + '\x01\x04\x03\x03\xFF')
					}
				} else {
					if (event.options.val == '2') {
						self.VISCA.send(camId + '\x01\x04\x04\x02\xFF')
					} else {
						self.VISCA.send(camId + '\x01\x04\x04\x03\xFF')
					}
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		wbRedUp: {
			name: 'White Balance - Red Gain Up . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x03\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		wbRedDown: {
			name: 'White Balance - Red Gain Down . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x03\x03\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		wbBlueUp: {
			name: 'White Balance - Blue Gain Up . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x04\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		wbBlueDown: {
			name: 'White Balance - Blue Gain Down . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x04\x03\xFF')
			},
		},
		wbCustom: {
			name: 'White Balance - Set custom values',
			options: [
				{
					type: 'checkbox',
					label: 'Set Red Gain',
					id: 'rSet',
					default: true,
				},
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
					type: 'checkbox',
					label: 'Set Blue Gain',
					id: 'bSet',
					default: true,
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
				// TODO: Use queues to be more efficient
				self.VISCA.send(camId + '\x01\x04\x35\x05\xFF')
				setTimeout(() => {
					if (event.options.rSet) {
						// Set Red Gain
						const r = event.options.rVal
							.toString(16)
							.padStart(2, '0')
							.split('')
							.map((x) => String.fromCharCode(parseInt(x, 16)))
						self.VISCA.send(camId + '\x01\x04\x43\x00\x00' + r[0] + r[1] + '\xFF')
					}
					setTimeout(() => {
						if (event.options.bSet) {
							// Set Blue Gain
							const b = event.options.bVal
								.toString(16)
								.padStart(2, '0')
								.split('')
								.map((x) => String.fromCharCode(parseInt(x, 16)))
							self.VISCA.send(camId + '\x01\x04\x44\x00\x00' + b[0] + b[1] + '\xFF')
						}
					}, 50)
				}, 50)
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		wbRedS: {
			name: 'White Balance - Red Set Value . . . . . . deprecated',
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
			],
			callback: async (event) => {
				// Set Red Gain
				const r = event.options.rVal
					.toString(16)
					.padStart(2, '0')
					.split('')
					.map((x) => String.fromCharCode(parseInt(x, 16)))
				self.VISCA.send(camId + '\x01\x04\x43\x00\x00' + r[0] + r[1] + '\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		wbBlueS: {
			name: 'White Balance - Blue Set Value . . . . . . deprecated',
			options: [
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
				// Set Blue Gain
				const b = event.options.bVal
					.toString(16)
					.padStart(2, '0')
					.split('')
					.map((x) => String.fromCharCode(parseInt(x, 16)))
				self.VISCA.send(camId + '\x01\x04\x44\x00\x00' + b[0] + b[1] + '\xFF')
			},
		},
		wbOffsetAdjust: {
			name: 'White Balance - Offset Adjust (up/down/reset)',
			options: [
				{
					type: 'dropdown',
					label: 'Adjust',
					id: 'val',
					default: '3',
					choices: [
						{ id: '1', label: 'Up' },
						{ id: '2', label: 'Down' },
						{ id: '3', label: 'Reset' },
					],
				},
			],
			callback: async (event) => {
				switch (event.options.val) {
					case '1':
						self.VISCA.send(camId + '\x01\x7E\x01\x2E\x00\x02\xFF')
						break
					case '2':
						self.VISCA.send(camId + '\x01\x7E\x01\x2E\x00\x03\xFF')
						break
					case '3':
						self.VISCA.send(camId + '\x01\x7E\x01\x2E\x00\x00\xFF')
						break
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		wbOffsetUp: {
			name: 'White Balance - Offset Up . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x7E\x01\x2E\x00\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		wbOffsetDown: {
			name: 'White Balance - Offset Down . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x7E\x01\x2E\x00\x03\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		wbOffsetReset: {
			name: 'White Balance - Offset Reset . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x7E\x01\x2E\x00\x00\xFF')
			},
		},
	}
}

function getPresetActionDefinitions(self, camId) {
	return {
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
			name: 'Preset Drive Speed (individual)',
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
	}
}

function getMiscActionDefinitions(self, camId) {
	return {
		cameraPower: {
			name: 'Camera Power (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'val',
					choices: [
						{ id: '03', label: 'Off' },
						{ id: '02', label: 'On' },
					],
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x00' + String.fromCharCode(parseInt(event.options.val, 16) & 0xff) + '\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		camOn: {
			name: 'Power On Camera . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x00\x02\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		camOff: {
			name: 'Power Off Camera . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x00\x03\xFF')
			},
		},
		tally: {
			name: 'Tally (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '0',
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
		menu: {
			name: 'Menu (on/off/enter)',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off (back) or Enter',
					id: 'val',
					choices: [
						{ id: '1', label: 'On or Back (toggle)' },
						{ id: '2', label: 'Enter' },
					],
				},
			],
			callback: async (event) => {
				if (event.options.val == 1) {
					self.VISCA.send(camId + '\x01\x06\x06\x10\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x7E\x01\x02\x00\x01\xFF')
				}
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		menuToggle: {
			name: 'Menu/Back . . . . . . deprecated',
			options: [],
			callback: async () => {
				// self.log('info', 'menuToggle: ' + self.viscaToString(camId + '\x01\x06\x06\x10\xFF'))
				self.VISCA.send(camId + '\x01\x06\x06\x10\xFF')
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		menuEnter: {
			name: 'Menu Enter . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x7E\x01\x02\x00\x01\xFF')
			},
		},
		latency: {
			name: 'Video Latency (normal/low)',
			options: [
				{
					type: 'dropdown',
					label: 'Latency',
					id: 'val',
					choices: [
						{ id: '03', label: 'Normal' },
						{ id: '02', label: 'Low Latency (disables digital zoom)' },
					],
					default: '03',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x01\x5A' + String.fromCharCode(parseInt(event.options.val, 16)) + '\xFF')
			},
		},
		buttonFeedback: {
			name: 'Button Feedback (highlight/clear)',
			options: [
				{
					type: 'dropdown',
					label: 'highlight/clear',
					id: 'bol',
					choices: [
						{ id: 1, label: 'Highlight' },
						{ id: 0, label: 'Clear' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				self.data.heldThresholdReached = event.options.bol
				self.checkFeedbacks()
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		setHeldFeedback: {
			name: 'Set Held Feedback On . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.data.heldThresholdReached = true
				self.checkFeedbacks()
			},
		},
		// TODO: Add to upgrade scripts and merge with above
		clearHeldFeedback: {
			name: 'Clear Held Feedback . . . . . . deprecated',
			options: [],
			callback: async () => {
				self.data.heldThresholdReached = false
				self.checkFeedbacks()
			},
		},
		customCommand: {
			name: 'Custom Command',
			description: 'Request additional actions at https://github.com/bitfocus/companion-module-sony-visca/issues/35',
			options: [
				{
					type: 'textinput',
					label: 'Command example: 81 01 06 06 10 FF',
					id: 'cmd',
					regex: '/^81 ?([0-9a-fA-F]{2} ?){3,13}[fF][fF]$/',
				},
			],
			callback: async (event) => {
				self.log('info', 'Custom Command: ' + self.viscaToString(event.options.cmd))
				self.log(
					'info',
					'Please consider requesting this command to be added to the module at https://github.com/bitfocus/companion-module-sony-visca/issues/35'
				)
				const hexData = event.options.cmd.replace(/\s+/g, '')
				const tempBuffer = Buffer.from(hexData, 'hex')
				self.VISCA.send(tempBuffer)
			},
		},
	}
}

function formatActionsMarkdown(title, actions) {
	let markdown = `\n### ${title} Actions\n\n`
	for (const action in actions) {
		// if (actions[action].name.slice(-10) != 'deprecated')
		markdown += `* ${actions[action].name}\n`
	}
	return markdown
}

export function getActionsMarkdown() {
	let markdown = '## Actions Implemented\n'

	// dummy values to provide getActionDefinitions(self) when generating HELP.md
	const self = {
		config: { id: '128' },
		ptSpeed: '0C',
		speed: {
			pan: '0C',
			tilt: '0C',
			zoom: '0C',
			focus: '0C',
			preset: '0C',
		},
	}

	markdown += formatActionsMarkdown('Pan/Tilt', getPanTiltActionDefinitions(self))
	markdown += formatActionsMarkdown('Lens', getLensActionDefinitions(self))
	markdown += formatActionsMarkdown('Exposure', getExposureActionDefinitions(self))
	markdown += formatActionsMarkdown('Color', getColorActionDefinitions(self))
	markdown += formatActionsMarkdown('Camera Preset', getPresetActionDefinitions(self))
	markdown += formatActionsMarkdown('Miscellaneous', getMiscActionDefinitions(self))
	markdown = markdown.replace(
		'Custom Command',
		'Custom Command - *If you use a custom command that may be a useful action for others please let us know at [Issues - Custom Commands #35](https://github.com/bitfocus/companion-module-sony-visca/issues/35)*'
	)
	return markdown
}
