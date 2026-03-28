// import { CHOICES } from './choices.js'
// import { Regex } from '@companion-module/base'
import {
	CAP_ADVANCED,
	CAP_ADVANCED_LEGACY,
	CAP_ALL_CAMERAS,
	CAP_BRIGHTNESS,
	CAP_FR7,
	CAP_ICR,
	CAP_TELECONVERT,
	CAP_X1000,
	CAP_X1000_FR7,
	CAP_X400_CORE_X40UH,
	CAP_X400_ONLY,
	CAP_X400_X1000,
	CAP_X400_X1000_NO_H780,
	CAP_X400_X40UH,
	CAP_X400_X40UH_SE,
	filterByModel,
} from './model-caps.js'

export function getActionDefinitions(self) {
	const camId = String.fromCharCode(parseInt(self.state.viscaId))
	let speed = getSpeedCodes(self)
	const all = {
		...getPanTiltActionDefinitions(self, camId, speed),
		...getLensActionDefinitions(self, camId, speed),
		...getExposureActionDefinitions(self, camId),
		...getColorActionDefinitions(self, camId),
		...getPresetActionDefinitions(self, camId),
		...getMiscActionDefinitions(self, camId),
	}
	return filterByModel(all, self.config.model)
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
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.ptSlowMode === 'Slow' ? '0' : '1'
				if (val == '0') {
					self.VISCA.send(camId + '\x01\x06\x44\x03\xFF')
					self.state.ptSlowMode = 'Normal'
				} else {
					self.VISCA.send(camId + '\x01\x06\x44\x02\xFF')
					self.state.ptSlowMode = 'Slow'
				}
				self.updateVariables()
				self.checkFeedbacks()
				self.VISCA.sendLowPriorityInquiry('090644')
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
		ptReset: {
			name: 'Pan/Tilt Reset',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x06\x05\xFF')
			},
		},
		ptAbsolute: {
			name: 'Pan/Tilt Absolute Position',
			options: [
				{
					type: 'number',
					label: 'Pan Speed (1-24)',
					id: 'speed',
					min: 1,
					max: 24,
					default: 12,
				},
				{
					type: 'number',
					label: 'Pan Position (-8704 to 8704)',
					id: 'pan',
					min: -8704,
					max: 8704,
					default: 0,
				},
				{
					type: 'number',
					label: 'Tilt Position (-1024 to 4608)',
					id: 'tilt',
					min: -4608,
					max: 4608,
					default: 0,
				},
			],
			callback: async (event) => {
				const spd = Math.min(Math.max(parseInt(event.options.speed), 1), 24)
				const pan = parseInt(event.options.pan) & 0xffff
				const tilt = parseInt(event.options.tilt) & 0xffff
				let cmd = Buffer.alloc(15)
				cmd.writeUInt8(parseInt(self.state.viscaId), 0)
				cmd.writeUInt8(0x01, 1)
				cmd.writeUInt8(0x06, 2)
				cmd.writeUInt8(0x02, 3)
				cmd.writeUInt8(spd, 4)
				cmd.writeUInt8(0x00, 5)
				cmd.writeUInt8((pan >> 12) & 0x0f, 6)
				cmd.writeUInt8((pan >> 8) & 0x0f, 7)
				cmd.writeUInt8((pan >> 4) & 0x0f, 8)
				cmd.writeUInt8(pan & 0x0f, 9)
				cmd.writeUInt8((tilt >> 12) & 0x0f, 10)
				cmd.writeUInt8((tilt >> 8) & 0x0f, 11)
				cmd.writeUInt8((tilt >> 4) & 0x0f, 12)
				cmd.writeUInt8(tilt & 0x0f, 13)
				cmd.writeUInt8(0xff, 14)
				self.VISCA.send(cmd)
			},
		},
		ptSpeedType: {
			models: CAP_X1000_FR7,
			name: 'Pan/Tilt Speed Type',
			options: [
				{
					type: 'dropdown',
					label: 'Speed Type',
					id: 'val',
					choices: [
						{ id: '08', label: 'Normal' },
						{ id: '04', label: 'Extended Range' },
						{ id: '18', label: 'Extended Step' },
					],
					default: '08',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x06\x45' + String.fromCharCode(parseInt(event.options.val, 16) & 0xff) + '\xFF')
			},
		},
		panReverse: {
			models: CAP_X1000,
			name: 'Pan Reverse (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Pan Reverse',
					id: 'val',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x7E\x01\x06\x00' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF',
				)
			},
		},
		tiltReverse: {
			models: CAP_X1000,
			name: 'Tilt Reverse (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Tilt Reverse',
					id: 'val',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x7E\x01\x09\x00' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF',
				)
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
						self.state.zoomMode = 'Digital'
						break
					case '3':
						self.state.zoomMode = 'Optical'
						break
					case '4':
						self.state.zoomMode = 'clr img'
						break
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		zoomModeToggle: {
			name: 'Zoom Mode Toggle (up to three modes)',
			options: [
				{
					type: 'dropdown',
					label: 'Mode A',
					id: 'modeA',
					choices: [
						{ id: '4', label: 'Clear Image Zoom' },
						{ id: '3', label: 'Optical only' },
						{ id: '2', label: 'Digital' },
					],
					default: '4',
				},
				{
					type: 'dropdown',
					label: 'Mode B (optional)',
					id: 'modeB',
					choices: [
						{ id: 'none', label: 'None' },
						{ id: '4', label: 'Clear Image Zoom' },
						{ id: '3', label: 'Optical only' },
						{ id: '2', label: 'Digital' },
					],
					default: '3',
				},
				{
					type: 'dropdown',
					label: 'Mode C (optional)',
					id: 'modeC',
					choices: [
						{ id: 'none', label: 'None' },
						{ id: '4', label: 'Clear Image Zoom' },
						{ id: '3', label: 'Optical only' },
						{ id: '2', label: 'Digital' },
					],
					default: 'none',
				},
			],
			callback: async (event) => {
				const viscaCmds = { 2: '\x02', 3: '\x03', 4: '\x04' }
				const stateNames = { 2: 'Digital', 3: 'Optical', 4: 'Clr Img' }
				const modes = [event.options.modeA]
				if (event.options.modeB !== 'none') modes.push(event.options.modeB)
				if (event.options.modeC !== 'none') modes.push(event.options.modeC)
				const currentIdx = modes.findIndex((m) => stateNames[m] === self.state.zoomMode)
				const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % modes.length : 0
				const target = modes[nextIdx]
				self.VISCA.send(camId + '\x01\x04\x06' + viscaCmds[target] + '\xFF')
				self.state.zoomMode = stateNames[target]
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
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.focusMode === 'Manual' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x38\x03\xFF')
					self.state.focusMode = 'Manual'
				} else {
					self.VISCA.send(camId + '\x01\x04\x38\x02\xFF')
					self.state.focusMode = 'Auto'
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
		focusInfinity: {
			name: 'Focus Infinity',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x18\x02\xFF')
			},
		},
		focusDirect: {
			name: 'Focus Direct Position',
			options: [
				{
					type: 'number',
					label: 'Focus Position (0-65535)',
					id: 'val',
					min: 0,
					max: 65535,
					default: 32768,
				},
			],
			callback: async (event) => {
				const pos = parseInt(event.options.val) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x04\x48\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((pos >> 12) & 0x0f, 4)
				cmd.writeUInt8((pos >> 8) & 0x0f, 5)
				cmd.writeUInt8((pos >> 4) & 0x0f, 6)
				cmd.writeUInt8(pos & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		zoomDirect: {
			name: 'Zoom Direct Position',
			options: [
				{
					type: 'number',
					label: 'Zoom Position (0-65535)',
					id: 'val',
					min: 0,
					max: 65535,
					default: 0,
				},
			],
			callback: async (event) => {
				const pos = parseInt(event.options.val) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x04\x47\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((pos >> 12) & 0x0f, 4)
				cmd.writeUInt8((pos >> 8) & 0x0f, 5)
				cmd.writeUInt8((pos >> 4) & 0x0f, 6)
				cmd.writeUInt8(pos & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		teleConvert: {
			models: CAP_TELECONVERT,
			name: 'Tele Convert (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Tele Convert On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.teleConvert === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x7E\x04\x36\x02\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x7E\x04\x36\x03\xFF')
				}
			},
		},
		afMode: {
			models: CAP_ADVANCED,
			name: 'AF Mode (Normal/Interval/Zoom Trigger)',
			options: [
				{
					type: 'dropdown',
					label: 'AF Mode',
					id: 'val',
					choices: [
						{ id: '0', label: 'Normal' },
						{ id: '1', label: 'Interval' },
						{ id: '2', label: 'Zoom Trigger' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x57' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
				const modes = { 0: 'Normal', 1: 'Interval', 2: 'Zoom Trigger' }
				self.state.afMode = modes[parseInt(event.options.val)] ?? self.state.afMode
				self.updateVariables()
			},
		},
		afSensitivity: {
			models: CAP_ADVANCED,
			name: 'AF Sensitivity (Normal/Low)',
			options: [
				{
					type: 'dropdown',
					label: 'AF Sensitivity',
					id: 'val',
					choices: [
						{ id: '2', label: 'Normal' },
						{ id: '3', label: 'Low' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x58' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
				self.state.afSensitivity = event.options.val === '3' ? 'Low' : 'Normal'
				self.updateVariables()
			},
		},
		afIntervalTime: {
			models: CAP_ADVANCED,
			name: 'AF Interval Time',
			options: [
				{
					type: 'number',
					label: 'Operating Time (0-255)',
					id: 'opTime',
					min: 0,
					max: 255,
					default: 5,
				},
				{
					type: 'number',
					label: 'Staying Time (0-255)',
					id: 'stayTime',
					min: 0,
					max: 255,
					default: 5,
				},
			],
			callback: async (event) => {
				const op = parseInt(event.options.opTime) & 0xff
				const stay = parseInt(event.options.stayTime) & 0xff
				let cmd = Buffer.from(camId + '\x01\x04\x27\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((op >> 4) & 0x0f, 4)
				cmd.writeUInt8(op & 0x0f, 5)
				cmd.writeUInt8((stay >> 4) & 0x0f, 6)
				cmd.writeUInt8(stay & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		focusNearLimitDirect: {
			models: CAP_ADVANCED,
			name: 'Focus Near Limit Direct',
			options: [
				{
					type: 'number',
					label: 'Focus Near Limit Position (0-65535)',
					id: 'val',
					min: 0,
					max: 65535,
					default: 4096,
				},
			],
			callback: async (event) => {
				const pos = parseInt(event.options.val) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x04\x28\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((pos >> 12) & 0x0f, 4)
				cmd.writeUInt8((pos >> 8) & 0x0f, 5)
				cmd.writeUInt8((pos >> 4) & 0x0f, 6)
				cmd.writeUInt8(pos & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		zoomSpeedType: {
			models: CAP_X1000,
			name: 'Zoom Speed Type',
			options: [
				{
					type: 'dropdown',
					label: 'Speed Type',
					id: 'val',
					choices: [
						{ id: '08', label: 'Normal' },
						{ id: '04', label: 'Extended Range' },
					],
					default: '08',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x7E\x04\x57' + String.fromCharCode(parseInt(event.options.val, 16) & 0xff) + '\xFF',
				)
			},
		},
		lensInit: {
			models: CAP_FR7,
			name: 'Lens Init',
			options: [],
			callback: async () => {
				self.VISCA.send(camId + '\x01\x04\x19\x01\xFF')
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
						self.state.exposureMode = 'Auto'
						break
					case 1:
						self.VISCA.send(camId + '\x01\x04\x39\x03\xFF')
						self.state.exposureMode = 'Manual'
						break
					case 2:
						self.VISCA.send(camId + '\x01\x04\x39\x0A\xFF')
						self.state.exposureMode = 'Shutter Pri'
						break
					case 3:
						self.VISCA.send(camId + '\x01\x04\x39\x0B\xFF')
						self.state.exposureMode = 'Iris Pri'
						break
					case 4:
						self.VISCA.send(camId + '\x01\x04\x39\x0E\xFF')
						self.state.exposureMode = 'Gain Pri'
						break
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		expMToggle: {
			name: 'Exposure Mode Toggle (between two modes)',
			options: [
				{
					type: 'dropdown',
					label: 'Mode A',
					id: 'modeA',
					choices: [
						{ id: '0', label: 'Full Auto' },
						{ id: '1', label: 'Manual' },
						{ id: '2', label: 'Shutter Pri' },
						{ id: '3', label: 'Iris Pri' },
						{ id: '4', label: 'Gain Pri' },
					],
					default: '0',
				},
				{
					type: 'dropdown',
					label: 'Mode B',
					id: 'modeB',
					choices: [
						{ id: '0', label: 'Full Auto' },
						{ id: '1', label: 'Manual' },
						{ id: '2', label: 'Shutter Pri' },
						{ id: '3', label: 'Iris Pri' },
						{ id: '4', label: 'Gain Pri' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				const viscaCmds = { 0: '\x00', 1: '\x03', 2: '\x0A', 3: '\x0B', 4: '\x0E' }
				const stateNames = { 0: 'Auto', 1: 'Manual', 2: 'Shutter Pri', 3: 'Iris Pri', 4: 'Gain Pri' }
				const a = parseInt(event.options.modeA)
				const b = parseInt(event.options.modeB)
				const target = self.state.exposureMode === stateNames[a] ? b : a
				self.VISCA.send(camId + '\x01\x04\x39' + viscaCmds[target] + '\xFF')
				self.state.exposureMode = stateNames[target]
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
				...(isFr7Model(self)
					? [
							{
								type: 'dropdown',
								label: 'Step',
								id: 'step',
								choices: [
									{ id: '10', label: 'Fine' },
									{ id: '20', label: 'Medium' },
									{ id: '40', label: 'Coarse' },
								],
								default: '20',
								allowCustom: true,
								regex: '/^(?!00)[0-9a-fA-F]{2}$/',
							},
						]
					: []),
			],
			callback: async (event) => {
				if (isFr7Model(self)) {
					const direction = parseInt(event.options.val)
					if (direction !== 1 && direction !== 2) {
						return
					}
					const step = getHexStep(event.options.step)
					let cmd = Buffer.from(camId + '\x01\x7E\x04\x4B\x00\x00\x00\xFF', 'binary')
					cmd.writeUInt8(direction === 1 ? 0x02 : 0x03, 5)
					cmd.writeUInt8((step & 0xf0) >> 4, 6)
					cmd.writeUInt8(step & 0x0f, 7)
					self.VISCA.send(cmd)
					return
				}
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
				...(isFr7Model(self)
					? [
							{
								type: 'dropdown',
								label: 'Step',
								id: 'step',
								choices: [
									{ id: '01', label: 'Single' },
									{ id: '10', label: 'Fine' },
									{ id: '20', label: 'Medium' },
									{ id: '40', label: 'Coarse' },
								],
								default: '01',
								allowCustom: true,
								regex: '/^(?!00)[0-9a-fA-F]{2}$/',
							},
						]
					: []),
			],
			callback: async (event) => {
				if (isFr7Model(self)) {
					const direction = parseInt(event.options.val)
					if (direction !== 1 && direction !== 2) {
						return
					}
					const step = getHexStep(event.options.step)
					await sendFr7GainAdjust(self, camId, direction, step)
					return
				}
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
			models: CAP_BRIGHTNESS,
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
			models: CAP_BRIGHTNESS,
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
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.expCompOnOff === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x3E\x02\xFF')
					self.state.expCompOnOff = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x3E\x03\xFF')
					self.state.expCompOnOff = 'Off'
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
			models: CAP_ADVANCED_LEGACY,
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
			models: CAP_ADVANCED_LEGACY,
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
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.backlightComp === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x33\x02\xFF')
					self.state.backlightComp = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x33\x03\xFF')
					self.state.backlightComp = 'Off'
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
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.spotlightComp === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x3A\x02\xFF')
					self.state.spotlightComp = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x3A\x03\xFF')
					self.state.spotlightComp = 'Off'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		autoSlowShutter: {
			name: 'Auto Slow Shutter (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Auto Slow Shutter On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.slowShutter === 'Auto' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x5A\x02\xFF')
					self.state.slowShutter = 'Auto'
				} else {
					self.VISCA.send(camId + '\x01\x04\x5A\x03\xFF')
					self.state.slowShutter = 'Manual'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		highSensitivity: {
			models: CAP_ADVANCED_LEGACY,
			name: 'High Sensitivity (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'High Sensitivity On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.highSensitivity === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x5E\x02\xFF')
					self.state.highSensitivity = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x5E\x03\xFF')
					self.state.highSensitivity = 'Off'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		gainLimitSet: {
			models: CAP_ADVANCED_LEGACY,
			name: 'Set Gain Limit',
			options: [
				{
					type: 'dropdown',
					label: 'Gain Limit',
					id: 'val',
					choices: CHOICES.GAIN_LIMIT ?? [{ id: '09', label: '24 db' }],
					default: CHOICES.GAIN_LIMIT ? getIdOfDefault(CHOICES.GAIN_LIMIT) : '09',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x2C' + String.fromCharCode(parseInt(event.options.val, 16) & 0x0f) + '\xFF')
			},
		},
		maxShutterSet: {
			models: CAP_ADVANCED,
			name: 'Set Max Shutter',
			options: [
				{
					type: 'dropdown',
					label: 'Max Shutter',
					id: 'val',
					choices: CHOICES.MAX_SHUTTER ?? CHOICES.SHUTTER,
					default: CHOICES.MAX_SHUTTER ? getIdOfDefault(CHOICES.MAX_SHUTTER) : getIdOfDefault(CHOICES.SHUTTER),
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x05\x2A\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 5)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		minShutterSet: {
			models: CAP_ADVANCED,
			name: 'Set Min Shutter',
			options: [
				{
					type: 'dropdown',
					label: 'Min Shutter',
					id: 'val',
					choices: CHOICES.SHUTTER,
					default: getIdOfDefault(CHOICES.SHUTTER),
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x05\x2A\x01\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 5)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		visibilityEnhancer: {
			models: CAP_ADVANCED,
			name: 'Visibility Enhancer (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Visibility Enhancer On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.ve === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x3D\x06\xFF')
					self.state.ve = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x3D\x03\xFF')
					self.state.ve = 'Off'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		veSettings: {
			models: CAP_ADVANCED,
			name: 'Visibility Enhancer Settings',
			options: [
				{
					type: 'number',
					label: 'Effect Level (0-6)',
					id: 'level',
					min: 0,
					max: 6,
					default: 3,
				},
				{
					type: 'dropdown',
					label: 'Brightness Compensation',
					id: 'brightness',
					choices: [
						{ id: '0', label: 'Very Dark' },
						{ id: '1', label: 'Dark' },
						{ id: '2', label: 'Standard' },
						{ id: '3', label: 'Bright' },
					],
					default: '2',
				},
				{
					type: 'dropdown',
					label: 'Compensation Level',
					id: 'compLevel',
					choices: [
						{ id: '0', label: 'Low' },
						{ id: '1', label: 'Mid' },
						{ id: '2', label: 'High' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				const level = parseInt(event.options.level) & 0x0f
				const brightness = parseInt(event.options.brightness) & 0x0f
				const comp = parseInt(event.options.compLevel) & 0x0f
				self.VISCA.send(
					camId +
						'\x01\x04\x2D\x00' +
						String.fromCharCode(level) +
						String.fromCharCode(brightness) +
						String.fromCharCode(comp) +
						'\x00\x00\x00\x00\xFF',
				)
			},
		},
		aeSpeedDirect: {
			models: CAP_ADVANCED,
			name: 'AE Speed Direct',
			options: [
				{
					type: 'number',
					label: 'AE Speed (1-48)',
					id: 'val',
					min: 1,
					max: 48,
					default: 1,
				},
			],
			callback: async (event) => {
				const speed = Math.min(Math.max(parseInt(event.options.val), 1), 48)
				self.VISCA.send(camId + '\x01\x04\x5D' + String.fromCharCode(speed & 0xff) + '\xFF')
			},
		},
		gainPointOnOff: {
			models: CAP_ADVANCED,
			name: 'Gain Point (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Gain Point On/Off',
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
					self.VISCA.send(camId + '\x01\x05\x0C\x02\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x05\x0C\x03\xFF')
				}
			},
		},
		gainPointPosition: {
			models: CAP_ADVANCED,
			name: 'Gain Point Position',
			options: [
				{
					type: 'dropdown',
					label: 'Gain Point Position',
					id: 'val',
					choices: CHOICES.GAIN,
					default: getIdOfDefault(CHOICES.GAIN),
				},
			],
			callback: async (event) => {
				let cmd = Buffer.from(camId + '\x01\x05\x4C\x00\x00\xFF', 'binary')
				cmd.writeUInt8((parseInt(event.options.val, 16) & 0xf0) >> 4, 4)
				cmd.writeUInt8(parseInt(event.options.val, 16) & 0x0f, 5)
				self.VISCA.send(cmd)
			},
		},
		defog: {
			models: CAP_X400_ONLY,
			name: 'Defog (on/off with level)',
			options: [
				{
					type: 'dropdown',
					label: 'Defog On/Off',
					id: 'bol',
					choices: [
						{ id: '3', label: 'Off' },
						{ id: '2', label: 'On' },
					],
					default: '3',
				},
				{
					type: 'dropdown',
					label: 'Level',
					id: 'level',
					choices: [
						{ id: '1', label: 'Weak' },
						{ id: '2', label: 'Medium' },
						{ id: '3', label: 'Strong' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				const onOff = parseInt(event.options.bol) & 0x0f
				const level = event.options.bol === '3' ? 0 : parseInt(event.options.level) & 0x0f
				self.VISCA.send(camId + '\x01\x04\x37' + String.fromCharCode(onOff) + String.fromCharCode(level) + '\xFF')
			},
		},
		irCorrection: {
			models: CAP_ADVANCED_LEGACY,
			name: 'IR Correction (Standard/IR Light)',
			options: [
				{
					type: 'dropdown',
					label: 'IR Correction',
					id: 'val',
					choices: [
						{ id: '0', label: 'Standard' },
						{ id: '1', label: 'IR Light' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x11' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		noiseReduction2d3d: {
			models: CAP_ADVANCED,
			name: '2D/3D Noise Reduction (separate)',
			options: [
				{
					type: 'dropdown',
					label: '2D NR Level',
					id: 'nr2d',
					choices: [
						{ id: '0', label: '0 - Off' },
						{ id: '1', label: '1' },
						{ id: '2', label: '2' },
						{ id: '3', label: '3' },
						{ id: '4', label: '4' },
						{ id: '5', label: '5' },
					],
					default: '3',
				},
				{
					type: 'dropdown',
					label: '3D NR Level',
					id: 'nr3d',
					choices: [
						{ id: '0', label: '0 - Off' },
						{ id: '1', label: '1' },
						{ id: '2', label: '2' },
						{ id: '3', label: '3' },
						{ id: '4', label: '4' },
						{ id: '5', label: '5' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				const nr2d = parseInt(event.options.nr2d) & 0x0f
				const nr3d = parseInt(event.options.nr3d) & 0x0f
				self.VISCA.send(camId + '\x01\x05\x53' + String.fromCharCode(nr2d) + String.fromCharCode(nr3d) + '\xFF')
			},
		},
		// FR7 ND controls
		ndFilterMode: {
			models: CAP_FR7,
			name: 'ND Filter Mode (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'val',
					choices: [
						{ id: '0', label: 'Preset' },
						{ id: '1', label: 'Variable' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x52' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		ndVariableAdjust: {
			models: CAP_FR7,
			name: 'ND Variable Adjust (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Adjust',
					id: 'val',
					choices: [
						{ id: '2', label: 'Up' },
						{ id: '3', label: 'Down' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x12' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		ndVariableDirect: {
			models: CAP_FR7,
			name: 'ND Variable Direct (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'ND Value',
					id: 'val',
					choices: [
						{ id: '00', label: '1/4' },
						{ id: '01', label: '1/5' },
						{ id: '02', label: '1/6' },
						{ id: '03', label: '1/7' },
						{ id: '04', label: '1/8' },
						{ id: '05', label: '1/10' },
						{ id: '06', label: '1/11' },
						{ id: '07', label: '1/13' },
						{ id: '08', label: '1/16' },
						{ id: '09', label: '1/19' },
						{ id: '0A', label: '1/23' },
						{ id: '0B', label: '1/27' },
						{ id: '0C', label: '1/32' },
						{ id: '0D', label: '1/38' },
						{ id: '0E', label: '1/45' },
						{ id: '0F', label: '1/54' },
						{ id: '10', label: '1/64' },
						{ id: '11', label: '1/76' },
						{ id: '12', label: '1/91' },
						{ id: '13', label: '1/108' },
						{ id: '14', label: '1/128' },
					],
					default: '08',
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val, 16) & 0xff
				self.VISCA.send(
					camId +
						'\x01\x7E\x04\x42\x00\x00' +
						String.fromCharCode((val >> 4) & 0x0f) +
						String.fromCharCode(val & 0x0f) +
						'\xFF',
				)
			},
		},
		autoNdFilter: {
			models: CAP_FR7,
			name: 'Auto ND Filter (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Auto ND',
					id: 'val',
					choices: [
						{ id: '2', label: 'On' },
						{ id: '3', label: 'Off' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x53' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		ndClear: {
			models: CAP_FR7,
			name: 'ND Clear/Filtered (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'ND Clear',
					id: 'val',
					choices: [
						{ id: '3', label: 'Clear' },
						{ id: '2', label: 'Filtered' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x54' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		autoIris: {
			models: CAP_FR7,
			name: 'Auto Iris (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Auto Iris',
					id: 'val',
					choices: [
						{ id: '2', label: 'On' },
						{ id: '3', label: 'Off' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x05\x34' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		autoShutter: {
			models: CAP_FR7,
			name: 'Auto Shutter (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Auto Shutter',
					id: 'val',
					choices: [
						{ id: '2', label: 'On' },
						{ id: '3', label: 'Off' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x05\x35' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		agc: {
			models: CAP_FR7,
			name: 'AGC (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'AGC',
					id: 'val',
					choices: [
						{ id: '2', label: 'On' },
						{ id: '3', label: 'Off' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x01\x75' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
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
			name: 'White Balance Adjust (red/blue - up/down/reset)',
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
					label: 'Up/Down/Reset',
					id: 'val',
					choices: [
						{ id: '1', label: 'Up' },
						{ id: '2', label: 'Down' },
						{ id: '3', label: 'Reset' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				const cmd = event.options.rb == 'r' ? '\x01\x04\x03' : '\x01\x04\x04'
				const ops = { 1: '\x02', 2: '\x03', 3: '\x00' }
				self.VISCA.send(camId + cmd + (ops[event.options.val] ?? '\x00') + '\xFF')
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
			models: CAP_ADVANCED,
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
		wbSpeedDirect: {
			models: CAP_ADVANCED,
			name: 'White Balance Speed Direct',
			options: [
				{
					type: 'dropdown',
					label: 'WB Speed',
					id: 'val',
					choices: [
						{ id: '1', label: '1 (Slow)' },
						{ id: '2', label: '2' },
						{ id: '3', label: '3' },
						{ id: '4', label: '4' },
						{ id: '5', label: '5 (Fast)' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x56' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		chromaSuppress: {
			models: CAP_X400_X1000,
			name: 'Chroma Suppress',
			options: [
				{
					type: 'dropdown',
					label: 'Chroma Suppress Level',
					id: 'val',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: '1 (Weak)' },
						{ id: '2', label: '2' },
						{ id: '3', label: '3 (Strong)' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x5F' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		colorMatrixSelect: {
			models: CAP_X400_ONLY,
			name: 'Color Matrix Select',
			options: [
				{
					type: 'dropdown',
					label: 'Color Matrix',
					id: 'val',
					choices: [
						{ id: '2', label: 'STD' },
						{ id: '3', label: 'OFF' },
						{ id: '4', label: 'High SAT' },
						{ id: '5', label: 'FL Light' },
						{ id: '6', label: 'Movie' },
						{ id: '7', label: 'Still' },
						{ id: '8', label: 'Cinema' },
						{ id: '9', label: 'Pro' },
						{ id: 'A', label: 'ITU709' },
						{ id: 'B', label: 'B&W' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x7E\x01\x3D' + String.fromCharCode(parseInt(event.options.val, 16) & 0x0f) + '\xFF',
				)
			},
		},
		colorLevelAdjust: {
			models: CAP_X400_X1000,
			name: 'Color Level Adjust (up/down/reset)',
			options: [
				{
					type: 'dropdown',
					label: 'Adjust',
					id: 'val',
					choices: [
						{ id: '2', label: 'Up' },
						{ id: '3', label: 'Down' },
						{ id: '0', label: 'Reset' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x09' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		colorLevelDirect: {
			models: CAP_X400_X1000,
			name: 'Color Level Direct',
			options: [
				{
					type: 'number',
					label: 'Color Level (0-14)',
					id: 'val',
					min: 0,
					max: 14,
					default: 7,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0x0f
				self.VISCA.send(camId + '\x01\x04\x49\x00\x00\x00' + String.fromCharCode(val) + '\xFF')
			},
		},
		colorPhaseAdjust: {
			models: CAP_X400_X1000,
			name: 'Color Phase Adjust (up/down/reset)',
			options: [
				{
					type: 'dropdown',
					label: 'Adjust',
					id: 'val',
					choices: [
						{ id: '2', label: 'Up' },
						{ id: '3', label: 'Down' },
						{ id: '0', label: 'Reset' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x0F' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		colorPhaseDirect: {
			models: CAP_X400_X1000,
			name: 'Color Phase Direct',
			options: [
				{
					type: 'dropdown',
					label: 'Color Phase (-7 to +7)',
					id: 'val',
					choices: [
						{ id: '0E', label: '+7' },
						{ id: '0D', label: '+6' },
						{ id: '0C', label: '+5' },
						{ id: '0B', label: '+4' },
						{ id: '0A', label: '+3' },
						{ id: '09', label: '+2' },
						{ id: '08', label: '+1' },
						{ id: '07', label: '0' },
						{ id: '06', label: '-1' },
						{ id: '05', label: '-2' },
						{ id: '04', label: '-3' },
						{ id: '03', label: '-4' },
						{ id: '02', label: '-5' },
						{ id: '01', label: '-6' },
						{ id: '00', label: '-7' },
					],
					default: '07',
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val, 16) & 0x0f
				self.VISCA.send(camId + '\x01\x04\x4F\x00\x00\x00' + String.fromCharCode(val) + '\xFF')
			},
		},
		gammaSelect: {
			models: CAP_X400_X1000,
			name: 'Gamma Select',
			options: [
				{
					type: 'dropdown',
					label: 'Gamma',
					id: 'val',
					choices: [
						{ id: '0', label: 'STD' },
						{ id: '1', label: 'Straight' },
						{ id: '2', label: 'Pattern' },
						{ id: '8', label: 'Movie' },
						{ id: '9', label: 'Still' },
						{ id: 'A', label: 'CINE1' },
						{ id: 'B', label: 'CINE2' },
						{ id: 'C', label: 'CINE3' },
						{ id: 'D', label: 'CINE4' },
						{ id: 'E', label: 'ITU709' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x04\x5B' + String.fromCharCode(parseInt(event.options.val, 16) & 0x0f) + '\xFF')
			},
		},
		gammaLevelDirect: {
			models: CAP_X400_X1000,
			name: 'Gamma Level Direct',
			options: [
				{
					type: 'number',
					label: 'Gamma Level (0-14)',
					id: 'val',
					min: 0,
					max: 14,
					default: 7,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xff
				let cmd = Buffer.from(camId + '\x01\x7E\x01\x71\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 4) & 0x0f, 5)
				cmd.writeUInt8(val & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		kneeSetting: {
			models: CAP_X400_X1000,
			name: 'Knee Setting (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Knee Setting On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.kneeSetting === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x7E\x01\x6D\x02\xFF')
					self.state.kneeSetting = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x7E\x01\x6D\x03\xFF')
					self.state.kneeSetting = 'Off'
				}
				self.updateVariables()
			},
		},
		kneeMode: {
			models: CAP_X400_X1000,
			name: 'Knee Mode (Auto/Manual)',
			options: [
				{
					type: 'dropdown',
					label: 'Knee Mode',
					id: 'val',
					choices: [
						{ id: '0', label: 'Auto' },
						{ id: '4', label: 'Manual' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x01\x54' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
				self.state.kneeMode = event.options.val === '4' ? 'Manual' : 'Auto'
				self.updateVariables()
			},
		},
		detailLevelDirect: {
			models: CAP_ADVANCED,
			name: 'Detail Level Direct',
			options: [
				{
					type: 'number',
					label: 'Detail Level (0-15)',
					id: 'val',
					min: 0,
					max: 15,
					default: 4,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xff
				let cmd = Buffer.from(camId + '\x01\x04\x42\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 4) & 0x0f, 6)
				cmd.writeUInt8(val & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		detailSettings: {
			models: CAP_ADVANCED,
			name: 'Detail Sub-settings',
			options: [
				{
					type: 'dropdown',
					label: 'Setting',
					id: 'setting',
					choices: [
						{ id: '01', label: 'Detail Mode' },
						{ id: '02', label: 'Detail Bandwidth' },
						{ id: '03', label: 'Crispening' },
						{ id: '04', label: 'HV Balance' },
						{ id: '05', label: 'BW Balance' },
						{ id: '06', label: 'Limit' },
						{ id: '07', label: 'Highlight Detail' },
						{ id: '08', label: 'Super Low' },
					],
					default: '01',
				},
				{
					type: 'number',
					label: 'Value',
					id: 'val',
					tooltip:
						'Mode: 0=Auto,1=Manual | Bandwidth: 0-4 | Crispening: 0-7 | HV Balance: 5-9 | BW Balance: 0-4 | Limit: 0-7 | Highlight Detail: 0-4 | Super Low: 0-7',
					min: 0,
					max: 9,
					default: 0,
				},
			],
			callback: async (event) => {
				const setting = parseInt(event.options.setting, 16) & 0x0f
				const val = parseInt(event.options.val) & 0x0f
				self.VISCA.send(camId + '\x01\x05\x42' + String.fromCharCode(setting) + String.fromCharCode(val) + '\xFF')
			},
		},
		blackLevelAdjust: {
			models: CAP_X400_X1000,
			name: 'Black Level Adjust (up/down/reset)',
			options: [
				{
					type: 'dropdown',
					label: 'Adjust',
					id: 'val',
					choices: [
						{ id: '2', label: 'Up' },
						{ id: '3', label: 'Down' },
						{ id: '0', label: 'Reset' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x15' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		blackLevelDirect: {
			models: CAP_X400_X1000,
			name: 'Black Level Direct',
			options: [
				{
					type: 'number',
					label: 'Black Level (0-96)',
					id: 'val',
					min: 0,
					max: 96,
					default: 48,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xff
				let cmd = Buffer.from(camId + '\x01\x7E\x04\x45\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 4) & 0x0f, 5)
				cmd.writeUInt8(val & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		pictureProfile: {
			models: CAP_X400_X1000,
			name: 'Picture Profile Select',
			options: [
				{
					type: 'dropdown',
					label: 'Picture Profile',
					id: 'val',
					choices: [
						{ id: '0', label: 'PP1' },
						{ id: '1', label: 'PP2' },
						{ id: '2', label: 'PP3' },
						{ id: '3', label: 'PP4' },
						{ id: '4', label: 'PP5' },
						{ id: '5', label: 'PP6' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x5F' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		colorMatrixCorrection: {
			models: CAP_X400_ONLY,
			name: 'Color Matrix Correction',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					choices: [
						{ id: '7A', label: 'R-G' },
						{ id: '7B', label: 'R-B' },
						{ id: '7C', label: 'G-R' },
						{ id: '7D', label: 'G-B' },
						{ id: '7E', label: 'B-R' },
						{ id: '7F', label: 'B-G' },
					],
					default: '7A',
				},
				{
					type: 'number',
					label: 'Value (-99 to +99)',
					id: 'val',
					min: -99,
					max: 99,
					default: 0,
				},
			],
			callback: async (event) => {
				const raw = (parseInt(event.options.val) + 99) & 0xff
				const channelByte = parseInt(event.options.channel, 16) & 0xff
				let cmd = Buffer.from(camId + '\x01\x7E\x01\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8(channelByte, 4)
				cmd.writeUInt8((raw >> 4) & 0x0f, 5)
				cmd.writeUInt8(raw & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		gammaPatternDirect: {
			models: CAP_X400_X1000,
			name: 'Gamma Pattern Direct',
			options: [
				{
					type: 'number',
					label: 'Pattern (1-512)',
					id: 'val',
					min: 1,
					max: 512,
					default: 1,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xfff
				self.VISCA.send(
					camId +
						'\x01\x05\x5B' +
						String.fromCharCode((val >> 8) & 0x0f) +
						String.fromCharCode((val >> 4) & 0x0f) +
						String.fromCharCode(val & 0x0f) +
						'\xFF',
				)
			},
		},
		gammaOffsetDirect: {
			models: CAP_X400_X1000,
			name: 'Gamma Offset Direct',
			options: [
				{
					type: 'dropdown',
					label: 'Polarity',
					id: 'polarity',
					choices: [
						{ id: '0', label: '+' },
						{ id: '1', label: '−' },
					],
					default: '0',
				},
				{
					type: 'number',
					label: 'Width (0-64)',
					id: 'width',
					min: 0,
					max: 64,
					default: 0,
				},
			],
			callback: async (event) => {
				const pol = parseInt(event.options.polarity) & 0x0f
				const width = parseInt(event.options.width) & 0xff
				self.VISCA.send(
					camId +
						'\x01\x04\x1E\x00\x00\x00' +
						String.fromCharCode(pol) +
						String.fromCharCode((width >> 4) & 0x0f) +
						String.fromCharCode(width & 0x0f) +
						'\xFF',
				)
			},
		},
		kneeSlopeDirect: {
			models: CAP_X400_X1000,
			name: 'Knee Slope Direct',
			options: [
				{
					type: 'number',
					label: 'Knee Slope (0-14)',
					id: 'val',
					min: 0,
					max: 14,
					default: 7,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xff
				let cmd = Buffer.from(camId + '\x01\x7E\x01\x6F\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 4) & 0x0f, 5)
				cmd.writeUInt8(val & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		kneePointDirect: {
			models: CAP_X400_X1000,
			name: 'Knee Point Direct',
			options: [
				{
					type: 'number',
					label: 'Knee Point (0-12)',
					id: 'val',
					min: 0,
					max: 12,
					default: 6,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xff
				let cmd = Buffer.from(camId + '\x01\x7E\x01\x6E\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 4) & 0x0f, 5)
				cmd.writeUInt8(val & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		blackGammaLevel: {
			models: CAP_X400_X1000,
			name: 'Black Gamma Level Direct',
			options: [
				{
					type: 'number',
					label: 'Black Gamma Level (0-14)',
					id: 'val',
					min: 0,
					max: 14,
					default: 7,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xff
				let cmd = Buffer.from(camId + '\x01\x7E\x01\x72\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 4) & 0x0f, 5)
				cmd.writeUInt8(val & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		blackGammaRange: {
			models: CAP_X400_X1000,
			name: 'Black Gamma Range',
			options: [
				{
					type: 'dropdown',
					label: 'Range',
					id: 'val',
					choices: [
						{ id: '0', label: 'Low' },
						{ id: '1', label: 'Mid' },
						{ id: '2', label: 'High' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x05\x5C' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		// FR7 White Balance extended
		presetWhiteDirect: {
			models: CAP_FR7,
			name: 'Preset White Direct (FR7)',
			options: [
				{
					type: 'number',
					label: 'Color Temperature (2000-15000 K)',
					id: 'val',
					min: 2000,
					max: 15000,
					default: 5600,
				},
			],
			callback: async (event) => {
				const val = Math.min(Math.max(parseInt(event.options.val), 2000), 15000)
				let cmd = Buffer.from(camId + '\x01\x05\x43\x01\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 12) & 0x0f, 5)
				cmd.writeUInt8((val >> 8) & 0x0f, 6)
				cmd.writeUInt8((val >> 4) & 0x0f, 7)
				cmd.writeUInt8(val & 0x0f, 8)
				self.VISCA.send(cmd)
			},
		},
		tintDirect: {
			models: CAP_FR7,
			name: 'Tint Direct (FR7)',
			options: [
				{
					type: 'number',
					label: 'Tint (-99 to +99)',
					id: 'val',
					min: -99,
					max: 99,
					default: 0,
				},
			],
			callback: async (event) => {
				const raw = (parseInt(event.options.val) + 99) & 0xff
				self.VISCA.send(
					camId +
						'\x01\x05\x44\x02\x00\x00' +
						String.fromCharCode((raw >> 4) & 0x0f) +
						String.fromCharCode(raw & 0x0f) +
						'\xFF',
				)
			},
		},
		offsetColorTempDirect: {
			models: CAP_FR7,
			name: 'Offset Color Temp Direct (FR7)',
			options: [
				{
					type: 'number',
					label: 'Offset Color Temp (-99 to +99)',
					id: 'val',
					min: -99,
					max: 99,
					default: 0,
				},
			],
			callback: async (event) => {
				const raw = (parseInt(event.options.val) + 99) & 0xff
				self.VISCA.send(
					camId +
						'\x01\x05\x45\x00\x00\x00' +
						String.fromCharCode((raw >> 4) & 0x0f) +
						String.fromCharCode(raw & 0x0f) +
						'\xFF',
				)
			},
		},
		offsetTintDirect: {
			models: CAP_FR7,
			name: 'Offset Tint Direct (FR7)',
			options: [
				{
					type: 'number',
					label: 'Offset Tint (-99 to +99)',
					id: 'val',
					min: -99,
					max: 99,
					default: 0,
				},
			],
			callback: async (event) => {
				const raw = (parseInt(event.options.val) + 99) & 0xff
				self.VISCA.send(
					camId +
						'\x01\x05\x46\x00\x00\x00' +
						String.fromCharCode((raw >> 4) & 0x0f) +
						String.fromCharCode(raw & 0x0f) +
						'\xFF',
				)
			},
		},
		// FR7 Master/R/B Black and Gain
		masterBlackDirect: {
			models: CAP_FR7,
			name: 'Master Black Direct (FR7)',
			options: [
				{
					type: 'number',
					label: 'Master Black (-99 to +99)',
					id: 'val',
					min: -99,
					max: 99,
					default: 0,
					step: 0.1,
				},
			],
			callback: async (event) => {
				// 0x0000 = -99.0, 0x03DE = 0.0, 0x07BC = +99.0
				const raw = Math.round((parseFloat(event.options.val) + 99) * 10) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x05\x48\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((raw >> 12) & 0x0f, 4)
				cmd.writeUInt8((raw >> 8) & 0x0f, 5)
				cmd.writeUInt8((raw >> 4) & 0x0f, 6)
				cmd.writeUInt8(raw & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		rGainDirect: {
			models: CAP_FR7,
			name: 'R Gain Direct (FR7)',
			options: [
				{
					type: 'number',
					label: 'R Gain (-99 to +99)',
					id: 'val',
					min: -99,
					max: 99,
					default: 0,
					step: 0.1,
				},
			],
			callback: async (event) => {
				const raw = Math.round((parseFloat(event.options.val) + 99) * 10) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x7E\x04\x46\x02\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((raw >> 12) & 0x0f, 5)
				cmd.writeUInt8((raw >> 8) & 0x0f, 6)
				cmd.writeUInt8((raw >> 4) & 0x0f, 7)
				cmd.writeUInt8(raw & 0x0f, 8)
				self.VISCA.send(cmd)
			},
		},
		bGainDirect: {
			models: CAP_FR7,
			name: 'B Gain Direct (FR7)',
			options: [
				{
					type: 'number',
					label: 'B Gain (-99 to +99)',
					id: 'val',
					min: -99,
					max: 99,
					default: 0,
					step: 0.1,
				},
			],
			callback: async (event) => {
				const raw = Math.round((parseFloat(event.options.val) + 99) * 10) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x7E\x04\x56\x02\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((raw >> 12) & 0x0f, 5)
				cmd.writeUInt8((raw >> 8) & 0x0f, 6)
				cmd.writeUInt8((raw >> 4) & 0x0f, 7)
				cmd.writeUInt8(raw & 0x0f, 8)
				self.VISCA.send(cmd)
			},
		},
		rBlackDirect: {
			models: CAP_FR7,
			name: 'R Black Direct (FR7)',
			options: [
				{
					type: 'number',
					label: 'R Black (-99 to +99)',
					id: 'val',
					min: -99,
					max: 99,
					default: 0,
					step: 0.1,
				},
			],
			callback: async (event) => {
				const raw = Math.round((parseFloat(event.options.val) + 99) * 10) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x7E\x04\x43\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((raw >> 12) & 0x0f, 4)
				cmd.writeUInt8((raw >> 8) & 0x0f, 5)
				cmd.writeUInt8((raw >> 4) & 0x0f, 6)
				cmd.writeUInt8(raw & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		bBlackDirect: {
			models: CAP_FR7,
			name: 'B Black Direct (FR7)',
			options: [
				{
					type: 'number',
					label: 'B Black (-99 to +99)',
					id: 'val',
					min: -99,
					max: 99,
					default: 0,
					step: 0.1,
				},
			],
			callback: async (event) => {
				const raw = Math.round((parseFloat(event.options.val) + 99) * 10) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x7E\x04\x44\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((raw >> 12) & 0x0f, 4)
				cmd.writeUInt8((raw >> 8) & 0x0f, 5)
				cmd.writeUInt8((raw >> 4) & 0x0f, 6)
				cmd.writeUInt8(raw & 0x0f, 7)
				self.VISCA.send(cmd)
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
				self.state.lastPresetUsed = presetNumber + 1
				self.updateVariables()
				self.checkFeedbacks()
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
		presetSpeedSelect: {
			models: CAP_X400_X40UH,
			name: 'Preset Speed Select (Compatible/Separate/Common)',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Speed Mode',
					id: 'val',
					choices: [
						{ id: '0', label: 'Compatible' },
						{ id: '1', label: 'Separate' },
						{ id: '2', label: 'Common' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x1B' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		presetSpeedCommon: {
			models: CAP_X400_CORE_X40UH,
			name: 'Preset Drive Speed (common)',
			options: [
				{
					type: 'dropdown',
					label: 'Speed',
					id: 'speed',
					choices: CHOICES.SPEED,
					default: getIdOfDefault(CHOICES.SPEED),
				},
			],
			callback: async (event) => {
				const speed = parseInt(event.options.speed, 16) & 0xff
				let cmd = Buffer.from(camId + '\x01\x7E\x04\x1C\x00\x00\xFF', 'binary')
				cmd.writeUInt8((speed >> 4) & 0x0f, 5)
				cmd.writeUInt8(speed & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		presetMode: {
			models: CAP_X400_X1000_NO_H780,
			name: 'Preset Mode (Mode1/Mode2/Trace)',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Mode',
					id: 'val',
					choices: [
						{ id: '00', label: 'Mode 1' },
						{ id: '01', label: 'Mode 2' },
						{ id: '10', label: 'Trace' },
					],
					default: '00',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x7E\x04\x3D' + String.fromCharCode(parseInt(event.options.val, 16) & 0xff) + '\xFF',
				)
			},
		},
	}
}

function getMiscActionDefinitions(self, camId) {
	const CHOICES = self.choices
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
						{ id: 'toggle', label: 'Toggle' },
					],
				},
			],
			callback: async (event) => {
				let val = event.options.val
				if (val == 'toggle') val = self.state.power === 'On' ? '03' : '02'
				self.VISCA.send(camId + '\x01\x04\x00' + String.fromCharCode(parseInt(val, 16) & 0xff) + '\xFF')
			},
		},
		tally: {
			models: CAP_X400_X1000,
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
			models: CAP_ALL_CAMERAS,
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
			models: CAP_ALL_CAMERAS,
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
					if (isFr7Model(self)) {
						self.VISCA.send(camId + '\x09\x7E\x04\x1E\xFF', self.VISCA.inquiry)
					}
				}
			},
		},
		overrideViscaId: {
			models: CAP_ALL_CAMERAS,
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
		flickerCancel: {
			models: CAP_X400_X40UH,
			name: 'Flicker Cancel (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Flicker Cancel On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.flickerCancel === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x32\x02\xFF')
					self.state.flickerCancel = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x32\x03\xFF')
					self.state.flickerCancel = 'Off'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		imageStabilizer: {
			models: CAP_X400_X40UH_SE,
			name: 'Image Stabilizer (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Image Stabilizer On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.imageStabilizer === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x34\x02\xFF')
					self.state.imageStabilizer = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x34\x03\xFF')
					self.state.imageStabilizer = 'Off'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		highResolution: {
			models: CAP_X400_X40UH,
			name: 'High Resolution (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'High Resolution On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.highResolution === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x52\x02\xFF')
					self.state.highResolution = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x52\x03\xFF')
					self.state.highResolution = 'Off'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		ICR: {
			models: CAP_ICR,
			name: 'ICR / Night Mode (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'ICR On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off (Day)' },
						{ id: '1', label: 'On (Night)' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.IRCutFilter === 'On' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x01\x02\xFF')
					self.state.IRCutFilter = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x01\x03\xFF')
					self.state.IRCutFilter = 'Off'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		autoICR: {
			models: CAP_X400_X40UH_SE,
			name: 'Auto ICR (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Auto ICR On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				let val = event.options.bol
				if (val == '2') val = self.state.IRCutFilterAuto === 'Auto' ? '0' : '1'
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x51\x02\xFF')
					self.state.IRCutFilterAuto = 'Auto'
				} else {
					self.VISCA.send(camId + '\x01\x04\x51\x03\xFF')
					self.state.IRCutFilterAuto = 'Manual'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		imgFlip: {
			models: CAP_X400_CORE_X40UH,
			name: 'Image Flip (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Image Flip On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				const val = event.options.bol
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x66\x02\xFF')
					self.state.imageFlip = 'On'
				} else {
					self.VISCA.send(camId + '\x01\x04\x66\x03\xFF')
					self.state.imageFlip = 'Off'
				}
				self.updateVariables()
				self.checkFeedbacks()
			},
		},
		colorBar: {
			models: CAP_X400_X1000,
			name: 'Color Bar (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Color Bar On/Off',
					id: 'bol',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: 'On' },
						{ id: '2', label: 'Toggle' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				const val = event.options.bol
				if (val == '1') {
					self.VISCA.send(camId + '\x01\x04\x7D\x02\xFF')
				} else {
					self.VISCA.send(camId + '\x01\x04\x7D\x03\xFF')
				}
			},
		},
		ptzTrace: {
			models: CAP_X400_X1000_NO_H780,
			name: 'PTZ Trace',
			options: [
				{
					type: 'dropdown',
					label: 'Operation',
					id: 'op',
					choices: [
						{ id: 'recStart', label: 'Record Start' },
						{ id: 'recStop', label: 'Record Stop' },
						{ id: 'playPrepare', label: 'Play Prepare' },
						{ id: 'playStart', label: 'Play Start' },
						{ id: 'delete', label: 'Delete' },
					],
					default: 'playPrepare',
				},
				{
					type: 'number',
					label: 'Trace Number (0-15)',
					id: 'num',
					min: 0,
					max: 15,
					default: 0,
				},
			],
			callback: async (event) => {
				const num = parseInt(event.options.num) & 0x0f
				switch (event.options.op) {
					case 'recStart':
						self.VISCA.send(camId + '\x01\x7E\x04\x20\x00' + String.fromCharCode(num) + '\x02\xFF')
						break
					case 'recStop':
						self.VISCA.send(camId + '\x01\x7E\x04\x20\x00\x00\x03\xFF')
						break
					case 'playPrepare':
						self.VISCA.send(camId + '\x01\x7E\x04\x20\x01' + String.fromCharCode(num) + '\x01\xFF')
						break
					case 'playStart':
						self.VISCA.send(camId + '\x01\x7E\x04\x20\x01\x00\x02\xFF')
						break
					case 'delete':
						self.VISCA.send(camId + '\x01\x7E\x04\x20\x02' + String.fromCharCode(num) + '\x00\xFF')
						break
				}
			},
		},
		ptLimit: {
			models: CAP_ADVANCED,
			name: 'Pan/Tilt Limit (set/clear)',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'action',
					choices: [
						{ id: 'set', label: 'Set' },
						{ id: 'clear', label: 'Clear' },
					],
					default: 'set',
				},
				{
					type: 'dropdown',
					label: 'Corner',
					id: 'corner',
					choices: [
						{ id: '1', label: 'Up-Right' },
						{ id: '0', label: 'Down-Left' },
					],
					default: '1',
				},
				{
					type: 'number',
					label: 'Pan Position (-8704 to 8704)',
					id: 'pan',
					min: -8704,
					max: 8704,
					default: 0,
				},
				{
					type: 'number',
					label: 'Tilt Position (-1024 to 4608)',
					id: 'tilt',
					min: -1024,
					max: 4608,
					default: 0,
				},
			],
			callback: async (event) => {
				const corner = parseInt(event.options.corner) & 0x0f
				if (event.options.action === 'clear') {
					self.VISCA.send(
						camId + '\x01\x06\x07\x01' + String.fromCharCode(corner) + '\x07\x0F\x0F\x0F\x07\x0F\x0F\x0F\xFF',
					)
					return
				}
				const pan = parseInt(event.options.pan) & 0xffff
				const tilt = parseInt(event.options.tilt) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x06\x07\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8(corner, 4)
				cmd.writeUInt8((pan >> 12) & 0x0f, 5)
				cmd.writeUInt8((pan >> 8) & 0x0f, 6)
				cmd.writeUInt8((pan >> 4) & 0x0f, 7)
				cmd.writeUInt8(pan & 0x0f, 8)
				cmd.writeUInt8((tilt >> 12) & 0x0f, 9)
				cmd.writeUInt8((tilt >> 8) & 0x0f, 10)
				cmd.writeUInt8((tilt >> 4) & 0x0f, 11)
				cmd.writeUInt8(tilt & 0x0f, 12)
				self.VISCA.send(cmd)
			},
		},
		hPhaseAdjust: {
			models: CAP_X400_X1000,
			name: 'H Phase (up/down)',
			options: [
				{
					type: 'dropdown',
					label: 'Adjust',
					id: 'val',
					choices: [
						{ id: '2', label: 'Up' },
						{ id: '3', label: 'Down' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x7E\x01\x5B\x00' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF',
				)
			},
		},
		hPhaseDirect: {
			models: CAP_X400_X1000,
			name: 'H Phase Direct',
			options: [
				{
					type: 'number',
					label: 'H Phase (0-959)',
					id: 'val',
					min: 0,
					max: 959,
					default: 0,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xfff
				self.VISCA.send(
					camId +
						'\x01\x7E\x01\x5B\x00' +
						String.fromCharCode((val >> 8) & 0x0f) +
						String.fromCharCode((val >> 4) & 0x0f) +
						String.fromCharCode(val & 0x0f) +
						'\xFF',
				)
			},
		},
		osdDirect: {
			models: CAP_X400_X40UH,
			name: 'OSD On/Off',
			options: [
				{
					type: 'dropdown',
					label: 'Output',
					id: 'output',
					choices: [
						{ id: '0', label: 'SDI' },
						{ id: '1', label: 'HDMI' },
					],
					default: '0',
				},
				{
					type: 'dropdown',
					label: 'On/Off',
					id: 'bol',
					choices: [
						{ id: '2', label: 'On' },
						{ id: '3', label: 'Off' },
					],
					default: '2',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId +
						'\x01\x7E\x04\x76' +
						String.fromCharCode(parseInt(event.options.output) & 0x0f) +
						String.fromCharCode(parseInt(event.options.bol) & 0x0f) +
						'\xFF',
				)
			},
		},
		cameraIdDirect: {
			models: CAP_ADVANCED,
			name: 'Camera ID Direct',
			options: [
				{
					type: 'number',
					label: 'Camera ID (0-65535)',
					id: 'val',
					min: 0,
					max: 65535,
					default: 0,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xffff
				let cmd = Buffer.from(camId + '\x01\x04\x22\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 12) & 0x0f, 4)
				cmd.writeUInt8((val >> 8) & 0x0f, 5)
				cmd.writeUInt8((val >> 4) & 0x0f, 6)
				cmd.writeUInt8(val & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		hdmiColorSpace: {
			models: CAP_ADVANCED,
			name: 'HDMI Color Space',
			options: [
				{
					type: 'dropdown',
					label: 'Color Space',
					id: 'val',
					choices: [
						{ id: '0', label: 'YCbCr' },
						{ id: '1', label: 'RGB' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x7E\x01\x03\x00' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF',
				)
			},
		},
		irReceive: {
			name: 'IR Receive (on/off/toggle)',
			options: [
				{
					type: 'dropdown',
					label: 'IR Receive',
					id: 'val',
					choices: [
						{ id: '02', label: 'On' },
						{ id: '03', label: 'Off' },
						{ id: '10', label: 'Toggle' },
					],
					default: '02',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x06\x08' + String.fromCharCode(parseInt(event.options.val, 16) & 0xff) + '\xFF')
			},
		},
		callMode: {
			models: CAP_X400_ONLY,
			name: 'Preset Call Mode (Freeze/Normal)',
			options: [
				{
					type: 'dropdown',
					label: 'Call Mode',
					id: 'val',
					choices: [
						{ id: '3', label: 'Normal' },
						{ id: '2', label: 'Freeze' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x3B' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		colorBarOverlayName: {
			models: CAP_X400_ONLY,
			name: 'Color Bar Overlay Name (on/off)',
			options: [
				{
					type: 'dropdown',
					label: 'Overlay Name On/Off',
					id: 'bol',
					choices: [
						{ id: '2', label: 'On' },
						{ id: '3', label: 'Off' },
					],
					default: '3',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x77' + String.fromCharCode(parseInt(event.options.bol) & 0x0f) + '\xFF')
			},
		},
		autoIcrThreshold: {
			models: CAP_X400_X40UH,
			name: 'Auto ICR Threshold Direct',
			options: [
				{
					type: 'number',
					label: 'Threshold (0-255)',
					id: 'val',
					min: 0,
					max: 255,
					default: 128,
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val) & 0xff
				let cmd = Buffer.from(camId + '\x01\x04\x21\x00\x00\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 4) & 0x0f, 6)
				cmd.writeUInt8(val & 0x0f, 7)
				self.VISCA.send(cmd)
			},
		},
		tallyLevel: {
			models: CAP_X400_X1000,
			name: 'Tally Level Direct',
			options: [
				{
					type: 'dropdown',
					label: 'Tally Level',
					id: 'val',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '4', label: 'On (Low)' },
						{ id: '5', label: 'On (High)' },
					],
					default: '5',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId + '\x01\x7E\x01\x0A\x01' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF',
				)
			},
		},
		ndFilter: {
			models: CAP_X1000,
			name: 'ND Filter',
			options: [
				{
					type: 'dropdown',
					label: 'ND Filter',
					id: 'val',
					choices: [
						{ id: '0', label: 'Off' },
						{ id: '1', label: '1/4' },
						{ id: '2', label: '1/16' },
						{ id: '3', label: '1/64' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x01\x53' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		hdmiVideoFormat: {
			models: CAP_X1000,
			name: 'HDMI Video Format',
			options: [
				{
					type: 'dropdown',
					label: 'Format',
					id: 'val',
					choices: [
						{ id: '00', label: '1080/59.94p' },
						{ id: '02', label: '1080/29.97p' },
						{ id: '03', label: '1080/59.94i' },
						{ id: '04', label: '720/59.94p' },
						{ id: '08', label: '1080/50p' },
						{ id: '0A', label: '1080/25p' },
						{ id: '0B', label: '1080/50i' },
						{ id: '0C', label: '720/50p' },
						{ id: '18', label: '480/59.94p' },
						{ id: '22', label: '4K/29.97p' },
						{ id: '26', label: '4K/25p' },
						{ id: '28', label: '1080/23.98p' },
						{ id: '2A', label: '4K/23.98p' },
					],
					default: '00',
				},
			],
			callback: async (event) => {
				const val = parseInt(event.options.val, 16) & 0xff
				let cmd = Buffer.from(camId + '\x01\x7E\x01\x1E\x00\x00\xFF', 'binary')
				cmd.writeUInt8((val >> 4) & 0x0f, 5)
				cmd.writeUInt8(val & 0x0f, 6)
				self.VISCA.send(cmd)
			},
		},
		// FR7 specific misc actions
		pushAfMf: {
			models: CAP_FR7,
			name: 'Push AF / Push MF (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [
						{ id: '1', label: 'Press' },
						{ id: '0', label: 'Release' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x58' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		ptzAutoFraming: {
			models: CAP_FR7,
			name: 'PTZ Auto Framing (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Auto Framing',
					id: 'val',
					choices: [
						{ id: '1', label: 'On (Start)' },
						{ id: '0', label: 'Off (Stop)' },
					],
					default: '0',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x3A' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		audioLevelControl: {
			models: CAP_FR7,
			name: 'Audio Level Control (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					choices: [
						{ id: '1', label: 'CH1' },
						{ id: '2', label: 'CH2' },
					],
					default: '1',
				},
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: '0', label: 'Manual' },
						{ id: '1', label: 'Auto' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId +
						'\x01\x7E\x04\x60' +
						String.fromCharCode(parseInt(event.options.channel) & 0x0f) +
						String.fromCharCode(parseInt(event.options.mode) & 0x0f) +
						'\xFF',
				)
			},
		},
		audioInputLevel: {
			models: CAP_FR7,
			name: 'Audio Input Level Direct (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					choices: [
						{ id: '0', label: 'Master' },
						{ id: '1', label: 'CH1' },
						{ id: '2', label: 'CH2' },
					],
					default: '0',
				},
				{
					type: 'number',
					label: 'Level (0-99)',
					id: 'level',
					min: 0,
					max: 99,
					default: 50,
				},
			],
			callback: async (event) => {
				const ch = parseInt(event.options.channel) & 0x0f
				const level = parseInt(event.options.level) & 0xff
				self.VISCA.send(
					camId +
						'\x01\x7E\x04\x61' +
						String.fromCharCode(ch) +
						'\x00\x00' +
						String.fromCharCode((level >> 4) & 0x0f) +
						String.fromCharCode(level & 0x0f) +
						'\xFF',
				)
			},
		},
		audioInputLevelAdjust: {
			models: CAP_FR7,
			name: 'Audio Input Level Adjust (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: 'dir',
					choices: [
						{ id: '2', label: 'Up' },
						{ id: '3', label: 'Down' },
					],
					default: '2',
				},
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					choices: [
						{ id: '0', label: 'Master' },
						{ id: '1', label: 'CH1' },
						{ id: '2', label: 'CH2' },
					],
					default: '0',
				},
				{
					type: 'number',
					label: 'Step (1-10)',
					id: 'step',
					min: 1,
					max: 10,
					default: 1,
				},
			],
			callback: async (event) => {
				const dir = parseInt(event.options.dir) & 0x0f
				const ch = parseInt(event.options.channel) & 0x0f
				const step = parseInt(event.options.step) & 0xff
				self.VISCA.send(
					camId +
						'\x01\x7E\x04\x62' +
						String.fromCharCode(dir) +
						String.fromCharCode(ch) +
						String.fromCharCode((step >> 4) & 0x0f) +
						String.fromCharCode(step & 0x0f) +
						'\xFF',
				)
			},
		},
		displayButton: {
			models: CAP_FR7,
			name: 'Display Button (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'val',
					choices: [
						{ id: '1', label: 'Press' },
						{ id: '0', label: 'Release' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				self.VISCA.send(camId + '\x01\x7E\x04\x75' + String.fromCharCode(parseInt(event.options.val) & 0x0f) + '\xFF')
			},
		},
		assignableButton: {
			models: CAP_FR7,
			name: 'Assignable Button (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Button',
					id: 'button',
					choices: [
						{ id: '01', label: 'Assignable 1' },
						{ id: '02', label: 'Assignable 2' },
						{ id: '03', label: 'Assignable 3' },
						{ id: '04', label: 'Assignable 4' },
						{ id: '05', label: 'Assignable 5' },
						{ id: '06', label: 'Assignable 6' },
						{ id: '07', label: 'Assignable 7' },
						{ id: '08', label: 'Assignable 8' },
						{ id: '09', label: 'Assignable 9' },
						{ id: '7F', label: 'Focus Hold' },
					],
					default: '01',
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'action',
					choices: [
						{ id: '1', label: 'Press' },
						{ id: '0', label: 'Release' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId +
						'\x01\x7E\x04\x73' +
						String.fromCharCode(parseInt(event.options.button, 16) & 0xff) +
						String.fromCharCode(parseInt(event.options.action) & 0x0f) +
						'\xFF',
				)
			},
		},
		directMenu: {
			models: CAP_FR7,
			name: 'Direct Menu (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Menu Item',
					id: 'item',
					choices: [
						{ id: '00', label: 'ND Filter' },
						{ id: '01', label: 'Iris' },
						{ id: '02', label: 'ISO/Gain' },
						{ id: '03', label: 'Shutter' },
						{ id: '04', label: 'AE Level/Mode' },
						{ id: '7F', label: 'Exit' },
					],
					default: '00',
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'action',
					choices: [
						{ id: '1', label: 'Press' },
						{ id: '0', label: 'Release' },
					],
					default: '1',
				},
			],
			callback: async (event) => {
				self.VISCA.send(
					camId +
						'\x01\x7E\x04\x72' +
						String.fromCharCode(parseInt(event.options.item, 16) & 0xff) +
						String.fromCharCode(parseInt(event.options.action) & 0x0f) +
						'\xFF',
				)
			},
		},
		presetSeparateDuration: {
			models: CAP_FR7,
			name: 'Preset Separate Duration (FR7)',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Number',
					id: 'preset',
					choices: CHOICES.PRESET,
					default: '00',
				},
				{
					type: 'number',
					label: 'Duration in seconds (1-99)',
					id: 'duration',
					min: 1,
					max: 99,
					default: 5,
				},
			],
			callback: async (event) => {
				const preset =
					event.options.preset === 'ps' ? self.state.presetSelector - 1 : parseInt(event.options.preset, 16)
				// Duration: 0x00A = 1 sec, 0x3DE = 99 sec, in 0.1 sec increments
				const dur = Math.round(parseFloat(event.options.duration) * 10) & 0xfff
				self.VISCA.send(
					camId +
						'\x01\x7E\x04\x67' +
						String.fromCharCode(preset & 0xff) +
						String.fromCharCode((dur >> 8) & 0x0f) +
						String.fromCharCode((dur >> 4) & 0x0f) +
						String.fromCharCode(dur & 0x0f) +
						'\xFF',
				)
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
					regex:
						'/^(\\$\\([a-zA-Z0-9_]+:[a-zA-Z0-9_]+\\)|((8[0-7]|\\$\\([a-zA-Z0-9_]+:[a-zA-Z0-9_]+\\)) ?((([0-9a-fA-F]{2})|\\$\\([a-zA-Z0-9_]+:[a-zA-Z0-9_]+\\)) ?){1,13}))$/',
					useVariables: true,
				},
			],
			callback: async (event, context) => {
				event.options.cmd = await context.parseVariablesInString(event.options.cmd)
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
			PRESET: [{ id: '00', label: 'Preset 1' }],
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

function isFr7Model(self) {
	const model = self?.config?.model
	return model === '051E' || model === '051Ek'
}

async function sendFr7GainAdjust(self, camId, direction, step) {
	const directMenuPress = Buffer.from(camId + '\x01\x7E\x04\x72\x02\x01\xFF', 'binary')
	const directMenuRelease = Buffer.from(camId + '\x01\x7E\x04\x72\x02\x00\xFF', 'binary')
	let cmd = Buffer.from(camId + '\x01\x7E\x04\x41\x00\x00\x00\xFF', 'binary')
	cmd.writeUInt8(direction === 1 ? 0x02 : 0x03, 5)
	cmd.writeUInt8((step & 0xf0) >> 4, 6)
	cmd.writeUInt8(step & 0x0f, 7)

	// Open ISO/Gain direct menu, move the dial, then toggle the same menu target off again.
	self.VISCA.send(directMenuPress)
	await delayMs(50)
	self.VISCA.send(directMenuRelease)
	await delayMs(50)
	self.VISCA.send(cmd)
	await delayMs(50)
	self.VISCA.send(directMenuPress)
	await delayMs(50)
	self.VISCA.send(directMenuRelease)
}

function delayMs(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

function getHexStep(stepInput, fallback = 1) {
	const step = parseInt(stepInput, 16)
	if (Number.isNaN(step) || step < 1) {
		return fallback
	}
	return Math.min(step, 0xff)
}
