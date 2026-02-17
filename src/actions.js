// import { CHOICES } from './choices.js'
// import { Regex } from '@companion-module/base'

export function getActionDefinitions(self) {
	const camId = String.fromCharCode(parseInt(self.state.viscaId))
	let speed = getSpeedCodes(self)
	return {
		...getPanTiltActionDefinitions(self, camId, speed),
		...getLensActionDefinitions(self, camId, speed),
		...getExposureActionDefinitions(self, camId),
		...getColorActionDefinitions(self, camId),
		...getPresetActionDefinitions(self, camId),
		...getMiscActionDefinitions(self, camId),
	}
}
function getPanTiltActionDefinitions(self, camId, speed) {
	const CHOICES = self.choices
	return {
		left: {
			name: 'Pan Left',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + speed.pan + speed.tilt + '\x01\x03\xFF')
			},
		},
		right: {
			name: 'Pan Right',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + speed.pan + speed.tilt + '\x02\x03\xFF')
			},
		},
		up: {
			name: 'Tilt Up',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + speed.pan + speed.tilt + '\x03\x01\xFF')
			},
		},
		down: {
			name: 'Tilt Down',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + speed.pan + speed.tilt + '\x03\x02\xFF')
			},
		},
		upLeft: {
			name: 'Up Left',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + speed.pan + speed.tilt + '\x01\x01\xFF')
			},
		},
		upRight: {
			name: 'Up Right',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + speed.pan + speed.tilt + '\x02\x01\xFF')
			},
		},
		downLeft: {
			name: 'Down Left',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + speed.pan + speed.tilt + '\x01\x02\xFF')
			},
		},
		downRight: {
			name: 'Down Right',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + speed.pan + speed.tilt + '\x02\x02\xFF')
			},
		},
		stop: {
			name: 'Pan/Tilt Stop',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x01' + speed.pan + speed.tilt + '\x03\x03\xFF')
			},
		},
		home: {
			name: 'Pan/Tilt Home',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x04\xFF')
			},
		},
		ptSlow: {
			name: 'Pan/Tilt Slow Mode',
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
					self.state.ptSlowMode = 'normal'
				} else {
					self.VISCA.send(camId + '\x01\x06\x44\x02\xFF')
					self.state.ptSlowMode = 'slow'
				}
				self.updateVariables()
				self.checkFeedbacks()
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
						if (self.speed.pan < 0x18) self.speed.pan++
						break
					case '2':
						if (self.speed.pan > 1) self.speed.pan--
						break
					case '3':
						self.speed.pan = 0x0c
						break
				}
				speed = getSpeedCodes(self)
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
						if (self.speed.tilt < 0x17) self.speed.tilt++
						break
					case '2':
						if (self.speed.tilt > 1) self.speed.tilt--
						break
					case '3':
						self.speed.tilt = 0x0c
						break
				}
				speed = getSpeedCodes(self)
			},
		},
		panTiltSpeedAdjust: {
			name: 'Pan/Tilt Speed (up/down/default)',
			options: [
				{
					type: 'dropdown',
					label: 'Pan/Tilt Speed Adjust',
					id: 'val',
					default: '3',
					choices: [
						{ id: '1', label: 'Pan/Tilt Speed +' },
						{ id: '2', label: 'Pan/Tilt Speed -' },
						{ id: '3', label: 'Default' },
					],
				},
			],
			callback: async (action) => {
				switch (action.options.val) {
					case '1':
						if (self.speed.pan < 0x18) self.speed.pan++
						if (self.speed.tilt < 0x17) self.speed.tilt++
						break
					case '2':
						if (self.speed.pan > 1) self.speed.pan--
						if (self.speed.tilt > 1) self.speed.tilt--
						break
					case '3':
						self.speed.pan = 0x0c
						self.speed.tilt = 0x0c
						break
				}
				speed = getSpeedCodes(self)
			},
		},
		speedSet: {
			name: 'Set Pan and/or Tilt Speed',
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
				const s = parseInt(action.options.speed, 16)
				if (action.options.pSet) {
					self.speed.pan = s
				}
				if (action.options.tSet) {
					self.speed.tilt = parseInt(s, 16)
				}
				speed = getSpeedCodes(self)
			},
		},
		ptSpeedS: {
			// Legacy action for old presets
			name: 'Set Pan and Tilt Speed',
			options: [
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: CHOICES.SPEED,
					default: getIdOfDefault(CHOICES.SPEED),
				},
			],
			callback: async (event) => {
				self.speed.pan = parseInt(event.options.speed, 16)
				self.speed.tilt = parseInt(event.options.speed, 16)
				speed = getSpeedCodes(self)
			},
		},
	}
}

function getLensActionDefinitions(self, camId) {
	// const CHOICES = self.choices
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
		zoomInVS: {
			name: 'Zoom In - variable speed',
			options: [
				{
					type: 'dropdown',
					label: 'Zoom Speed for this button',
					id: 'val',
					default: 'v',
					choices: [
						{ id: 'v', label: 'Zoom Speed - Variable' },
						{ id: '7', label: 'Zoom Speed 7 (fast)' },
						{ id: '6', label: 'Zoom Speed 6' },
						{ id: '5', label: 'Zoom Speed 5' },
						{ id: '4', label: 'Zoom Speed 4' },
						{ id: '3', label: 'Zoom Speed 3' },
						{ id: '2', label: 'Zoom Speed 2' },
						{ id: '1', label: 'Zoom Speed 1' },
						{ id: '0', label: 'Zoom Speed 0 (slow)' },
					],
				},
			],
			callback: async (event) => {
				const s = parseInt(event.options.val) || self.speed.zoom
				const b = String.fromCharCode(0x20 + s)
				self.VISCA.send(camId + '\x01\x04\x07' + b + '\xFF')
			},
		},
		zoomOutVS: {
			name: 'Zoom Out - variable speed',
			options: [
				{
					type: 'dropdown',
					label: 'Zoom Speed for this button',
					id: 'val',
					default: 'v',
					choices: [
						{ id: 'v', label: 'Zoom Speed - Variable' },
						{ id: '7', label: 'Zoom Speed 7 (fast)' },
						{ id: '6', label: 'Zoom Speed 6' },
						{ id: '5', label: 'Zoom Speed 5' },
						{ id: '4', label: 'Zoom Speed 4' },
						{ id: '3', label: 'Zoom Speed 3' },
						{ id: '2', label: 'Zoom Speed 2' },
						{ id: '1', label: 'Zoom Speed 1' },
						{ id: '0', label: 'Zoom Speed 0 (slow)' },
					],
				},
			],
			callback: async (event) => {
				const s = parseInt(event.options.val) || self.speed.zoom
				const b = String.fromCharCode(0x30 + s)
				self.VISCA.send(camId + '\x01\x04\x07' + b + '\xFF')
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
				switch (event.options.mode) {
					case '2':
						self.state.zoomMode = 'digital'
						break
					case '3':
						self.state.zoomMode = 'optical'
						break
					case '4':
						self.state.zoomMode = 'clr img'
						break
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		zoomSpeedAdjust: {
			name: 'Zoom Speed (up/down/default)',
			options: [
				{
					type: 'dropdown',
					label: 'Zoom Speed Adjust',
					id: 'val',
					default: '1',
					choices: [
						{ id: 'u', label: 'Zoom Speed +' },
						{ id: 'd', label: 'Zoom Speed -' },
						{ id: '7', label: 'Zoom Speed 7 (fast)' },
						{ id: '6', label: 'Zoom Speed 6' },
						{ id: '5', label: 'Zoom Speed 5' },
						{ id: '4', label: 'Zoom Speed 4' },
						{ id: '3', label: 'Zoom Speed 3' },
						{ id: '2', label: 'Zoom Speed 2' },
						{ id: '1', label: 'Zoom Speed 1 (standard)' },
						{ id: '0', label: 'Zoom Speed 0 (slow)' },
					],
				},
			],
			callback: async (action) => {
				switch (action.options.val) {
					case 'u':
						if (self.speed.zoom < 7) self.speed.zoom++
						break
					case 'd':
						if (self.speed.zoom > 0) self.speed.zoom--
						break
					default: {
						const s = parseInt(action.options.val)
						if (s >= 0 && s <= 7) {
							self.speed.zoom = s
						}
					}
				}
				self.updateVariables()
			},
		},
		focusSpeedAdjust: {
			name: 'Focus Speed (up/down/default)',
			options: [
				{
					type: 'dropdown',
					label: 'Focus Speed Adjust',
					id: 'val',
					default: '1',
					choices: [
						{ id: 'u', label: 'Focus Speed +' },
						{ id: 'd', label: 'Focus Speed -' },
						{ id: '7', label: 'Focus Speed 7 (fast)' },
						{ id: '6', label: 'Focus Speed 6' },
						{ id: '5', label: 'Focus Speed 5' },
						{ id: '4', label: 'Focus Speed 4' },
						{ id: '3', label: 'Focus Speed 3' },
						{ id: '2', label: 'Focus Speed 2' },
						{ id: '1', label: 'Focus Speed 1 (standard)' },
						{ id: '0', label: 'Focus Speed 0 (slow)' },
					],
				},
			],
			callback: async (action) => {
				switch (action.options.val) {
					case 'u':
						if (self.speed.focus < 7) self.speed.focus++
						break
					case 'd':
						if (self.speed.focus > 0) self.speed.focus--
						break
					default: {
						const s = parseInt(action.options.val)
						if (s >= 0 && s <= 7) {
							self.speed.focus = s
						}
					}
				}
				self.updateVariables()
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
					self.state.focusMode = 'manual'
				} else {
					self.VISCA.send(camId + '\x01\x04\x38\x02\xFF')
					self.state.focusMode = 'auto'
				}
				self.updateVariables()
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
		focusNearVS: {
			name: 'Focus Near - variable speed',
			options: [
				{
					type: 'dropdown',
					label: 'Focus Speed for this button',
					id: 'val',
					default: 'v',
					choices: [
						{ id: 'v', label: 'Focus Speed - Variable' },
						{ id: '7', label: 'Focus Speed 7 (fast)' },
						{ id: '6', label: 'Focus Speed 6' },
						{ id: '5', label: 'Focus Speed 5' },
						{ id: '4', label: 'Focus Speed 4' },
						{ id: '3', label: 'Focus Speed 3' },
						{ id: '2', label: 'Focus Speed 2' },
						{ id: '1', label: 'Focus Speed 1' },
						{ id: '0', label: 'Focus Speed 0 (slow)' },
					],
				},
			],
			callback: async (event) => {
				const s = parseInt(event.options.val) || self.speed.focus
				const b = String.fromCharCode(0x30 + s)
				self.VISCA.send(camId + '\x01\x04\x08' + b + '\xFF')
			},
		},
		focusFarVS: {
			name: 'Focus Far - variable speed',
			options: [
				{
					type: 'dropdown',
					label: 'Focus Speed for this button',
					id: 'val',
					default: 'v',
					choices: [
						{ id: 'v', label: 'Focus Speed - Variable' },
						{ id: '7', label: 'Focus Speed 7 (fast)' },
						{ id: '6', label: 'Focus Speed 6' },
						{ id: '5', label: 'Focus Speed 5' },
						{ id: '4', label: 'Focus Speed 4' },
						{ id: '3', label: 'Focus Speed 3' },
						{ id: '2', label: 'Focus Speed 2' },
						{ id: '1', label: 'Focus Speed 1' },
						{ id: '0', label: 'Focus Speed 0 (slow)' },
					],
				},
			],
			callback: async (event) => {
				const s = parseInt(event.options.val) || self.speed.focus
				const b = String.fromCharCode(0x20 + s)
				self.VISCA.send(camId + '\x01\x04\x08' + b + '\xFF')
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
	const CHOICES = self.choices
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
						self.state.exposureMode = 'auto'
						break
					case 1:
						self.VISCA.send(camId + '\x01\x04\x39\x03\xFF')
						self.state.exposureMode = 'manual'
						break
					case 2:
						self.VISCA.send(camId + '\x01\x04\x39\x0A\xFF')
						self.state.exposureMode = 'shutter pri'
						break
					case 3:
						self.VISCA.send(camId + '\x01\x04\x39\x0B\xFF')
						self.state.exposureMode = 'iris pri'
						break
					case 4:
						self.VISCA.send(camId + '\x01\x04\x39\x0E\xFF')
						self.state.exposureMode = 'gain pri'
						break
				}
				self.updateVariables()
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
		irisS: {
			name: 'Set Iris',
			options: [
				{
					type: 'dropdown',
					label: 'Iris adjust',
					id: 'val',
					choices: CHOICES.IRIS,
					default: getIdOfDefault(CHOICES.IRIS),
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
		gainS: {
			name: 'Set Gain',
			options: [
				{
					type: 'dropdown',
					label: 'Gain setting',
					id: 'val',
					choices: CHOICES.GAIN,
					default: getIdOfDefault(CHOICES.GAIN),
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
		shutS: {
			name: 'Set Shutter',
			options: [
				{
					type: 'dropdown',
					label: 'Shutter setting',
					id: 'val',
					choices: CHOICES.SHUTTER,
					default: getIdOfDefault(CHOICES.SHUTTER),
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x04\x4A\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		brightnessAdjust: {
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
				switch (event.options.val) {
					case '1':
						self.VISCA.send(camId + '\x01\x04\x0D\x02\xFF')
						break
					case '2':
						self.VISCA.send(camId + '\x01\x04\x0D\x03\xFF')
						break
				}
			},
		},
		brightnessSet: {
			name: 'Set Brightness',
			options: [
				{
					type: 'dropdown',
					label: 'Brightness setting',
					id: 'val',
					choices: CHOICES.BRIGHTNESS,
					default: '11',
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x04\x4D\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 6)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		exposureCompOnOff: {
			name: 'Exposure Compensation (on/off)',
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
					self.state.expCompOnOff = 'on'
				} else {
					self.VISCA.send(camId + '\x01\x04\x3E\x03\xFF')
					self.state.expCompOnOff = 'off'
				}
				self.updateVariables()
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
					self.state.backlightComp = 'on'
				} else {
					self.VISCA.send(camId + '\x01\x04\x33\x03\xFF')
					self.state.backlightComp = 'off'
				}
				self.updateVariables()
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
					self.state.spotlightComp = 'on'
				} else {
					self.VISCA.send(camId + '\x01\x04\x3A\x03\xFF')
					self.state.spotlightComp = 'off'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
	}
}

function getColorActionDefinitions(self, camId) {
	// const CHOICES = self.choices
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
					if (event.options.val == '1') {
						self.VISCA.send(camId + '\x01\x04\x04\x02\xFF')
					} else {
						self.VISCA.send(camId + '\x01\x04\x04\x03\xFF')
					}
				}
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
						const r = parseInt(event.options.rVal)
							.toString(16)
							.padStart(2, '0')
							.split('')
							.map((x) => String.fromCharCode(parseInt(x, 16)))
						self.VISCA.send(camId + '\x01\x04\x43\x00\x00' + r[0] + r[1] + '\xFF')
					}
					setTimeout(() => {
						if (event.options.bSet) {
							// Set Blue Gain
							const b = parseInt(event.options.bVal)
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
		wbOffsetAdjust: {
			name: 'White Balance - Offset Adjust (up/down/reset)',
			options: [
				{
					type: 'dropdown',
					label: 'Adjust',
					id: 'val',
					default: '3',
					choices: [
						{ id: '1', label: 'Up (more red)' },
						{ id: '2', label: 'Down (more blue)' },
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
	}
}

function getPresetActionDefinitions(self, camId) {
	const CHOICES = self.choices
	return {
		savePset: {
			name: 'Save Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Number.',
					id: 'val',
					choices: CHOICES.PRESET,
				},
			],
			callback: async (event) => {
				const presetNumber =
					event.options.val === 'ps' ? self.state.presetSelector - 1 : parseInt(event.options.val, 16)
				self.VISCA.send(camId + '\x01\x04\x3F\x01' + String.fromCharCode(presetNumber & 0xff) + '\xFF')
			},
		},
		recallPset: {
			name: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Number',
					id: 'val',
					choices: CHOICES.PRESET,
				},
			],
			callback: async (event) => {
				const presetNumber =
					event.options.val === 'ps' ? self.state.presetSelector - 1 : parseInt(event.options.val, 16)
				self.VISCA.send(camId + '\x01\x04\x3F\x02' + String.fromCharCode(presetNumber & 0xff) + '\xFF')
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
				const presetNumber =
					event.options.val === 'ps' ? self.state.presetSelector - 1 : parseInt(event.options.val, 16)
				self.VISCA.send(
					camId +
						'\x01\x7E\x01\x0B' +
						String.fromCharCode(presetNumber & 0xff) +
						String.fromCharCode(parseInt(event.options.speed, 16) & 0xff) +
						'\xFF',
				)
			},
		},
		setPresetSelector: {
			name: 'Set Preset Selector',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Number',
					id: 'val',
					choices: CHOICES.PRESET,
				},
			],
			callback: async (event) => {
				self.state.presetSelector = parseInt(event.options.val)
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		modifyPresetSelector: {
			name: 'Modify Preset Selector',
			options: [
				{
					type: 'dropdown',
					label: 'Modify by (numbers -63 to 63 are valid)',
					id: 'val',
					choices: [
						{ id: '10', label: 'Increase by 10' },
						{ id: '1', label: 'Increase by 1' },
						{ id: '-1', label: 'Decrease by 1' },
						{ id: '-10', label: 'Decrease by 10' },
					],
					default: '1',
					allowCustom: true,
					regex: '/^(-?6[0-3]|-?[0-5]?[0-9])$/',
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val)
				if (val % 10) {
					self.state.presetSelector = ((self.state.presetSelector - 1 + (val % 64) + 64) % 64) + 1
				} else {
					// user has selected 10 based numbers, expectation is to wrap in increments of 10, not mod 64
					let r = self.state.presetSelector + val
					if (r < -5) {
						r += 70
					} else if (r < 1) {
						r += 60
					} else if (r > 70) {
						r -= 70
					} else if (r > 64) {
						r -= 60
					}
					self.state.presetSelector = r
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
	}
}

function getMiscActionDefinitions(self, camId) {
	// const CHOICES = self.choices
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
				{
					type: 'dropdown',
					label: 'Color',
					id: 'color',
					choices: [
						{ id: '0', label: 'Red' },
						{ id: '1', label: 'Green' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				const color = event.options.color == '1' ? '\x04\x1A' : '\x01\x0A'
				const onOff = event.options.bol == '1' ? '\x02' : '\x03'
				self.VISCA.send(camId + '\x01\x7E' + color + '\x00' + onOff + '\xFF')
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
				self.state.heldThresholdReached = parseInt(event.options.bol)
				self.checkFeedbacks()
			},
		},
		internalRecording: {
			name: 'Recording Button (press/release)',
			options: [
				{
					type: 'dropdown',
					label: 'Press/Release',
					id: 'bol',
					choices: [
						{ id: 1, label: 'Press' },
						{ id: 0, label: 'Release' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				if (event.options.bol == 1) {
					self.VISCA.send(camId + '\x01\x7E\x04\x1D\x01\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x7E\x04\x1D\x00\xFF')
				}
			},
		},
		overrideViscaId: {
			name: 'Override VISCA ID (serial only)',
			description: 'Override the VISCA ID for this instance',
			options: [
				{
					type: 'dropdown',
					label: 'VISCA ID',
					id: 'id',
					choices: [
						{ id: 'c', label: 'Use Id from Config' },
						{ id: '81', label: 'ViscaId 1' },
						{ id: '82', label: 'ViscaId 2' },
						{ id: '83', label: 'ViscaId 3' },
						{ id: '84', label: 'ViscaId 4' },
						{ id: '85', label: 'ViscaId 5' },
						{ id: '86', label: 'ViscaId 6' },
						{ id: '87', label: 'ViscaId 7' },
					],
					default: 'c',
				},
			],
			callback: async (event) => {
				if (event.options.id == 'c') {
					self.log('info', 'VISCA ID Override: Restored to config.id')
					self.state.viscaId = self.config.id
				} else {
					self.log('info', 'VISCA ID Override: ' + event.options.id)
					self.state.viscaId = parseInt(event.options.id, 16)
				}
				self.setVariableValues({ viscaId: self.state.viscaId })
				self.setActionDefinitions(getActionDefinitions(self))
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
					regex: '/^8[0-7] ?([0-9a-fA-F]{2} ?){3,13}[fF][fF]$/',
				},
			],
			callback: async (event) => {
				const hexData = event.options.cmd.replace(/\s+/g, '')
				const tempBuffer = Buffer.from(hexData, 'hex')
				self.log('info', 'Custom Command: ' + self.VISCA.msgToString(tempBuffer, false))
				self.log(
					'info',
					'Please consider requesting this command to be added to the module at https://github.com/bitfocus/companion-module-sony-visca/issues/35',
				)
				self.VISCA.send(tempBuffer)
			},
		},
	}
}

function getSpeedCodes(self) {
	// const CHOICES = self.choices
	const speed = self.speed
	self.updateVariables()
	return {
		pan: String.fromCharCode(speed.pan),
		tilt: String.fromCharCode(speed.tilt),
		zoom: String.fromCharCode(speed.zoom),
		focus: String.fromCharCode(speed.focus),
	}
}

function formatActionsMarkdown(title, actions) {
	let markdown = `\n### ${title} Actions\n\n`
	for (const action in actions) {
		// if (actions[action].name.slice(-10) != 'deprecated')
		markdown += `- ${actions[action].name}\n`
	}
	return markdown
}

export function getActionsMarkdown() {
	let markdown = '## Actions Implemented\n'

	// dummy values for getActionDefinitions(self) when generating HELP.md
	const self = {
		config: { id: '128' },
		speed: { pan: 0x0c, tilt: 0x0c, zoom: 4, focus: 3 },
		state: { viscaId: 128 },
		choices: {
			SPEED: [{ id: 0, label: 0 }],
			IRIS: [{ id: '00', label: 'Auto' }],
			GAIN: [{ id: '00', label: 'Auto' }],
			SHUTTER: [{ id: '00', label: 'Auto' }],
		},
		updateVariables: () => {},
	}

	markdown += formatActionsMarkdown('Pan/Tilt', getPanTiltActionDefinitions(self))
	markdown += formatActionsMarkdown('Lens', getLensActionDefinitions(self))
	markdown += formatActionsMarkdown('Exposure', getExposureActionDefinitions(self))
	markdown += formatActionsMarkdown('Color', getColorActionDefinitions(self))
	markdown += formatActionsMarkdown('Camera Preset', getPresetActionDefinitions(self))
	markdown += formatActionsMarkdown('Miscellaneous', getMiscActionDefinitions(self))
	markdown = markdown.replace(
		'Custom Command',
		'Custom Command - *If you use a custom command that may be a useful action for others please let us know at [Issues - Custom Commands #35](https://github.com/bitfocus/companion-module-sony-visca/issues/35)*',
	)
	return markdown
}

function getIdOfDefault(props) {
	const d = props.find((el) => Object.prototype.hasOwnProperty.call(el, 'default') && el.default)
	if (d === undefined) {
		return props[0].id
	}
	return d.id
}
