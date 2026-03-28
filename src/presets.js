import { COLORS } from './colors.js'
import {
	image_up,
	image_down,
	image_left,
	image_right,
	image_up_left,
	image_up_right,
	image_down_left,
	image_down_right,
	image_rotary_bg,
} from './images.js'

export function getPresetDefinitions(self, availableActionIds) {
	const all = {
		...panTiltPresets,
		...lensPresets,
		...exposurePresets,
		...colorPresets,
		...systemPresets,
		...getCameraPresets(self),
		...rotationEnabledPresets,
	}
	if (!availableActionIds) return all
	const filtered = {}
	for (const [key, preset] of Object.entries(all)) {
		if (presetActionsAvailable(preset, availableActionIds)) {
			filtered[key] = preset
		}
	}
	return filtered
}

function presetActionsAvailable(preset, availableActionIds) {
	if (!preset.steps) return true
	for (const step of preset.steps) {
		for (const [key, value] of Object.entries(step)) {
			if (key === 'down' || key === 'up') {
				if (Array.isArray(value)) {
					for (const action of value) {
						if (action.actionId && !availableActionIds.has(action.actionId)) return false
					}
				}
			} else if (typeof key === 'string' && /^\d+$/.test(key)) {
				// Duration group — can be array or { options, actions }
				const actions = Array.isArray(value) ? value : value?.actions
				if (Array.isArray(actions)) {
					for (const action of actions) {
						if (action.actionId && !availableActionIds.has(action.actionId)) return false
					}
				}
			}
		}
	}
	return true
}

const panTiltPresets = {
	'panTilt-up': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Up',
		style: {
			text: '',
			png64: image_up,
			pngalignment: 'center:center',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLUE,
		},
		steps: [
			{
				down: [
					{
						actionId: 'up',
						options: {},
					},
				],
				up: [
					{
						actionId: 'stop',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-down': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Down',
		style: {
			text: '',
			png64: image_down,
			pngalignment: 'center:center',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLUE,
		},
		steps: [
			{
				down: [
					{
						actionId: 'down',
						options: {},
					},
				],
				up: [
					{
						actionId: 'stop',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-left': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Left',
		style: {
			text: '',
			png64: image_left,
			pngalignment: 'center:center',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLUE,
		},
		steps: [
			{
				down: [
					{
						actionId: 'left',
						options: {},
					},
				],
				up: [
					{
						actionId: 'stop',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-right': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Right',
		style: {
			text: '',
			png64: image_right,
			pngalignment: 'center:center',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLUE,
		},
		steps: [
			{
				down: [
					{
						actionId: 'right',
						options: {},
					},
				],
				up: [
					{
						actionId: 'stop',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-upLeft': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Up Left',
		style: {
			text: '',
			png64: image_up_left,
			pngalignment: 'center:center',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLUE,
		},
		steps: [
			{
				down: [
					{
						actionId: 'upLeft',
						options: {},
					},
				],
				up: [
					{
						actionId: 'stop',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-upRight': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Up Right',
		style: {
			text: '',
			png64: image_up_right,
			pngalignment: 'center:center',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLUE,
		},
		steps: [
			{
				down: [
					{
						actionId: 'upRight',
						options: {},
					},
				],
				up: [
					{
						actionId: 'stop',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-downLeft': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Down Left',
		style: {
			text: '',
			png64: image_down_left,
			pngalignment: 'center:center',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLUE,
		},
		steps: [
			{
				down: [
					{
						actionId: 'downLeft',
						options: {},
					},
				],
				up: [
					{
						actionId: 'stop',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-downright': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Down Right',
		style: {
			text: '',
			png64: image_down_right,
			pngalignment: 'center:center',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLUE,
		},
		steps: [
			{
				down: [
					{
						actionId: 'downRight',
						options: {},
					},
				],
				up: [
					{
						actionId: 'stop',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-home': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Home',
		style: {
			text: 'HOME',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'home',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-speedUp': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Pan/Tilt Speed Up',
		style: {
			text: 'Pan/Tilt\\nFaster\\n$(sony-visca:panSpeed)/$(sony-visca:tiltSpeed)',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'panTiltSpeedAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-speedDown': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Pan/Tilt Speed Down',
		style: {
			text: 'Pan/Tilt\\nSlower\\n$(sony-visca:panSpeed)/$(sony-visca:tiltSpeed)',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'panTiltSpeedAdjust',
						options: { val: '2' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-speedDefault': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Pan/Tilt Speed Default',
		style: {
			text: 'Pan/Tilt\\nSpeed\\nDefault',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'panTiltSpeedAdjust',
						options: { val: '3' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-slowMode': {
		type: 'button',
		category: 'Pan/Tilt',
		name: 'Pan/Tilt Slow Mode (normal/slow)',
		style: {
			text: 'ptSlow\\nMode\\n$(sony-visca:ptSlowMode)',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'ptSlow',
						options: { bol: '2' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'ptSlowModeOn',
				options: {},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_ORANGE,
				},
			},
		],
	},
}

const lensPresets = {
	'lens-zoomIn': {
		type: 'button',
		category: 'Lens',
		name: 'Zoom In (variable speed)',
		style: {
			text: 'ZOOM\\n$(sony-visca:zoomRatio)\\nIN\\n$(sony-visca:zoomPositionBar)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomInVS',
						options: {
							val: 'v',
						},
					},
				],
				up: [
					{
						actionId: 'zoomS',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-zoomOut': {
		type: 'button',
		category: 'Lens',
		name: 'Zoom Out (variable speed)',
		style: {
			text: 'ZOOM\\n$(sony-visca:zoomRatio)\\nOUT\\n$(sony-visca:zoomPositionBar)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomOutVS',
						options: {
							val: 'v',
						},
					},
				],
				up: [
					{
						actionId: 'zoomS',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-zoomModeToggle': {
		type: 'button',
		category: 'Lens',
		name: 'Zoom Mode Toggle',
		style: {
			text: 'Zoom\\nMode\\n$(sony-visca:zoomMode)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomModeToggle',
						options: { modeA: '4', modeB: '3', modeC: 'none' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'zoomMode',
				options: { mode: 'Clr Img' },
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_ORANGE,
				},
			},
		],
	},
	'lens-focusFar': {
		type: 'button',
		category: 'Lens',
		name: 'Focus Far (variable speed)',
		style: {
			text: 'FOCUS\\nFAR\\n$(sony-visca:focusPositionBar)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusFarVS',
						options: {
							val: 'v',
						},
					},
				],
				up: [
					{
						actionId: 'focusS',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-focusNear': {
		type: 'button',
		category: 'Lens',
		name: 'Focus Near (variable speed)',
		style: {
			text: 'FOCUS\\nNEAR\\n$(sony-visca:focusPositionBar)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusNearVS',
						options: {
							val: 'v',
						},
					},
				],
				up: [
					{
						actionId: 'focusS',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-focusAuto': {
		type: 'button',
		category: 'Lens',
		name: 'Focus Mode - Auto/Manual',
		style: {
			text: '$(sony-visca:focusMode)\\nFocus',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_RED,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusM',
						options: { bol: '2' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'manualFocus',
				options: {},
				style: {
					bgcolor: COLORS.BLACK,
				},
			},
		],
	},
	'lens-opaf': {
		type: 'button',
		category: 'Lens',
		name: 'One Push Auto Focus',
		style: {
			text: 'O.P.\\nAF',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusOpaf',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-zoomSpeedUp': {
		type: 'button',
		category: 'Lens',
		name: 'Zoom Speed Faster',
		style: {
			text: 'Zoom\\n$(sony-visca:zoomSpeed)\\nFaster',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomSpeedAdjust',
						options: { val: 'u' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-zoomSpeedDown': {
		type: 'button',
		category: 'Lens',
		name: 'Zoom Speed Slower',
		style: {
			text: 'Zoom\\n$(sony-visca:zoomSpeed)\\nSlower',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomSpeedAdjust',
						options: { val: 'd' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-zoomSpeedDefault': {
		type: 'button',
		category: 'Lens',
		name: 'Zoom Speed Default (1)',
		style: {
			text: 'Zoom\\nSpeed\\nDefault',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomSpeedAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-focusSpeedUp': {
		type: 'button',
		category: 'Lens',
		name: 'Focus Speed Faster',
		style: {
			text: 'Focus\\n$(sony-visca:focusSpeed)\\nFaster',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusSpeedAdjust',
						options: { val: 'u' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-focusSpeedDown': {
		type: 'button',
		category: 'Lens',
		name: 'Focus Speed Slower',
		style: {
			text: 'Focus\\n$(sony-visca:focusSpeed)\\nSlower',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusSpeedAdjust',
						options: { val: 'd' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-focusSpeedDefault': {
		type: 'button',
		category: 'Lens',
		name: 'Focus Speed Default (1)',
		style: {
			text: 'Focus\\nSpeed\\nDefault',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusSpeedAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
}

const exposurePresets = {
	'exposure-autoManual': {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Mode Toggle',
		style: {
			text: '$(sony-visca:expMode)\\nExpose',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'expMToggle',
						options: {
							modeA: '0',
							modeB: '1',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureMode',
				options: { mode: 'Auto' },
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_ORANGE,
				},
			},
		],
	},
	'exposure-irisUp': {
		type: 'button',
		category: 'Exposure',
		name: 'Iris Up',
		style: {
			text: 'IRIS\\n$(sony-visca:irisLevel)\\nUp',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'irisAdjust',
						options: { val: '1', step: '20' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-irisDown': {
		type: 'button',
		category: 'Exposure',
		name: 'Iris Down',
		style: {
			text: 'IRIS\\n$(sony-visca:irisLevel)\\nDown',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'irisAdjust',
						options: { val: '2', step: '20' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-gainUp': {
		type: 'button',
		category: 'Exposure',
		name: 'Gain Up',
		style: {
			text: 'Gain\\n$(sony-visca:gainLevel)\\nUp',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'gainAdjust',
						options: { val: '1', step: '01' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-gainDown': {
		type: 'button',
		category: 'Exposure',
		name: 'Gain Down',
		style: {
			text: 'Gain\\n$(sony-visca:gainLevel)\\nDown',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'gainAdjust',
						options: { val: '2', step: '01' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-shutterUp': {
		type: 'button',
		category: 'Exposure',
		name: 'Shutter Up',
		style: {
			text: 'Shutter\\n$(sony-visca:shutterSpeed)\\nUp',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'shutterAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-shutterDown': {
		type: 'button',
		category: 'Exposure',
		name: 'Shutter Down',
		style: {
			text: 'Shutter\\n$(sony-visca:shutterSpeed)\\nDown',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'shutterAdjust',
						options: { val: '2' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-brightnessUp': {
		type: 'button',
		category: 'Exposure',
		name: 'Brightness Up',
		style: {
			text: 'Bright\\n$(sony-visca:brightPosition)\\nUp',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'brightnessAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-brightnessDown': {
		type: 'button',
		category: 'Exposure',
		name: 'Brightness Down',
		style: {
			text: 'Bright\\n$(sony-visca:brightPosition)\\nDown',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'brightnessAdjust',
						options: { val: '2' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-ExposureCompOnOff': {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Compensation On/Off',
		style: {
			text: 'Exp\\nComp\\n$(sony-visca:expCompOnOff)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'exposureCompOnOff',
						options: { bol: '2' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureCompOn',
				options: {},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_ORANGE,
				},
			},
		],
	},
	'exposure-CompensationUp': {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Compensation Up',
		style: {
			text: 'Exp\\nComp\\n$(sony-visca:expCompLevel)\\nUp',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'exposureComp',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-CompensationDown': {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Compensation Down',
		style: {
			text: 'Exp\\nComp\\n$(sony-visca:expCompLevel)\\nDown',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'exposureComp',
						options: { val: '2' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-CompensationReset': {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Compensation Reset',
		style: {
			text: 'Exp\\nComp\\nReset',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'exposureComp',
						options: { val: '3' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-BacklightCompOnOff': {
		type: 'button',
		category: 'Exposure',
		name: 'Backlight Compensation On/Off',
		style: {
			text: 'BckLite\\nComp\\n$(sony-visca:backlightComp)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'backlightComp',
						options: { bol: '2' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'backlightCompOn',
				options: {},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_ORANGE,
				},
			},
		],
	},
	'exposure-SpotlightCompOnOff': {
		type: 'button',
		category: 'Exposure',
		name: 'Spotlight Compensation On/Off',
		style: {
			text: 'SptLite\\nComp\\n$(sony-visca:spotlightComp)',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'spotlightComp',
						options: { bol: '2' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'spotlightCompOn',
				options: {},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_ORANGE,
				},
			},
		],
	},
}

const colorPresets = {
	'color-wbModeAuto': {
		type: 'button',
		category: 'Color',
		name: 'White Balance Mode - Auto1',
		style: {
			text: 'WB\\nAuto1',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'whiteBal',
						options: {
							val: '0',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'whiteBalanceMode',
				options: { mode: 'Auto 1' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'color-wbModeAuto2': {
		type: 'button',
		category: 'Color',
		name: 'White Balance Mode - Auto2 (ATW)',
		style: {
			text: 'WB\\nAuto2',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'whiteBal',
						options: {
							val: '4',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'whiteBalanceMode',
				options: { mode: 'Auto 2' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'color-wbModeIndoor': {
		type: 'button',
		category: 'Color',
		name: 'White Balance Mode - Indoor',
		style: {
			text: 'WB\\nIndoor',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'whiteBal',
						options: {
							val: '1',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'whiteBalanceMode',
				options: { mode: 'Indoor' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'color-wbModeOutdoor': {
		type: 'button',
		category: 'Color',
		name: 'White Balance Mode - Outdoor',
		style: {
			text: 'WB\\nOutdoor',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'whiteBal',
						options: {
							val: '2',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'whiteBalanceMode',
				options: { mode: 'Outdoor' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'color-wbModeManual': {
		type: 'button',
		category: 'Color',
		name: 'White Balance Mode - Manual',
		style: {
			text: 'WB\\nManual',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'whiteBal',
						options: {
							val: '5',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'whiteBalanceMode',
				options: { mode: 'Manual' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'color-wbModeCustom': {
		type: 'button',
		category: 'Color',
		name: 'White Balance Mode - Custom',
		style: {
			text: 'WB\\nCustom',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbCustom',
						options: {
							rSet: true,
							bSet: true,
							rVal: '192',
							bVal: '192',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbModeOPWB': {
		type: 'button',
		category: 'Color',
		name: 'White Balance Mode - One push WB',
		style: {
			text: 'WB\\n1 Push',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'whiteBal',
						options: {
							val: '3',
						},
					},
				],
				up: [],
				1000: {
					options: {
						runWhileHeld: true,
					},
					actions: [
						{
							actionId: 'wbTrigger',
							options: {},
						},
					],
				},
			},
		],
		feedbacks: [
			{
				feedbackId: 'whiteBalanceMode',
				options: { mode: 'One Push' },
				style: { color: COLORS.WHITE, bgcolor: COLORS.DARK_ORANGE },
			},
		],
	},
	'color-wbRedGainUp': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Red Gain Up (must be in WB Manual)',
		style: {
			text: 'R Gain\\n$(sony-visca:redGain)\\nUp',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: '#660000',
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbAdjust',
						options: {
							rb: 'r',
							val: '1',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbRedGainDown': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Red Gain Down (must be in WB Manual)',
		style: {
			text: 'R Gain\\n$(sony-visca:redGain)\\nDown',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: '#660000',
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbAdjust',
						options: {
							rb: 'r',
							val: '2',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbBlueGainUp': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Blue Gain Up (must be in WB Manual)',
		style: {
			text: 'B Gain\\n$(sony-visca:blueGain)\\nUp',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: '#000066',
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbAdjust',
						options: {
							rb: 'b',
							val: '1',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbBlueGainDown': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Blue Gain Down (must be in WB Manual)',
		style: {
			text: 'B Gain\\n$(sony-visca:blueGain)\\nDown',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: '#000066',
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbAdjust',
						options: {
							rb: 'b',
							val: '2',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbOffsetUp': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Offset Up (more red)',
		style: {
			text: 'WB\\nOffset\\n$(sony-visca:wbOffset)\\nUp',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbOffsetAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbOffsetDown': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Offset Down (more blue)',
		style: {
			text: 'WB\\nOffset\\n$(sony-visca:wbOffset)\\nDown',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbOffsetAdjust',
						options: { val: '2' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbOffsetReset': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Offset Reset',
		style: {
			text: 'WB\\nOffset\\nReset',
			size: '14',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbOffsetAdjust',
						options: { val: '3' },
					},
				],
			},
		],
		feedbacks: [],
	},
}

const systemPresets = {
	'system-powerOn': {
		type: 'button',
		category: 'System',
		name: 'Camera Power On',
		style: {
			text: 'Cam\nOn',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'cameraPower',
						options: { val: '02' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'system-powerOff': {
		type: 'button',
		category: 'System',
		name: 'Camera Power Off',
		style: {
			text: 'Cam\nOff',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'cameraPower',
						options: { val: '03' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'system-menuBack': {
		type: 'button',
		category: 'System',
		name: 'Menu/Back Button',
		style: {
			text: 'Menu\n/Back',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'menu',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'system-menuEnter': {
		type: 'button',
		category: 'System',
		name: 'Menu Enter Button',
		style: {
			text: 'Menu\nEnter',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'menu',
						options: { val: '2' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'system-startStopRecording': {
		type: 'button',
		category: 'System',
		name: 'Recording Button (press/release)',
		style: {
			text: 'Start\nStop\nRec',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'internalRecording',
						options: { bol: 1 },
					},
				],
				up: [
					{
						actionId: 'internalRecording',
						options: { bol: 0 },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'recordingActive',
				options: {},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_RED,
				},
			},
			{
				feedbackId: 'recordingPulse',
				options: {},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.RED,
				},
			},
		],
	},
}

function getCameraPresets(self) {
	const textColor = self?.config?.presetColorText ?? COLORS.WHITE
	const bgColor = self?.config?.presetColorBG ?? COLORS.CHARCOAL
	const presets = {}
	for (let i = 0; i < 64; i++) {
		presets['presets-Preset' + i] = {
			type: 'button',
			category: 'Presets',
			name: 'Preset ' + (i + 1),
			style: {
				text: 'Preset\\n' + (i + 1),
				size: '18',
				color: textColor,
				bgcolor: bgColor,
			},
			steps: [
				{
					down: [],
					up: [
						{
							actionId: 'recallPset',
							options: {
								val: ('0' + i.toString(16)).slice(-2).toUpperCase(),
							},
							delay: 0,
						},
					],
					2000: {
						options: {
							runWhileHeld: true,
						},
						actions: [
							{
								actionId: 'savePset',
								options: {
									val: ('0' + i.toString(16)).slice(-2).toUpperCase(),
								},
								delay: 0,
							},
							{
								actionId: 'buttonFeedback',
								options: { bol: '1' },
								delay: 0,
							},
						],
					},
					2001: [
						{
							actionId: 'buttonFeedback',
							options: { bol: '0' },
						},
					],
				},
			],
			feedbacks: [
				{
					feedbackId: 'heldFeedback',
					options: {},
					style: {
						color: COLORS.BLACK,
						bgcolor: COLORS.YELLOW,
					},
				},
			],
		}
	}
	for (let i = 1; i < 65; i++) {
		presets['presets-PresetSelector' + i] = {
			type: 'button',
			category: 'Presets',
			name: 'Set presetSelector variable',
			style: {
				text: 'Select\\nPreset\\n' + i,
				size: '18',
				color: textColor,
				bgcolor: bgColor,
				show_topbar: false,
			},
			steps: [
				{
					down: [
						{
							actionId: 'setPresetSelector',
							options: { val: i },
						},
					],
				},
			],
			feedbacks: [
				{
					feedbackId: 'selectedPreset',
					options: { preset: i },
					style: {
						color: COLORS.BLACK,
						bgcolor: COLORS.WHITE,
					},
				},
			],
		}
	}
	presets['presets-PresetPS'] = {
		type: 'button',
		category: 'Presets',
		name: 'Preset using variable presetSelector',
		style: {
			text: 'Preset\\n$(sony-visca:presetSelector)\\nSelect',
			size: '18',
			color: textColor,
			bgcolor: bgColor,
			show_topbar: false,
		},
		steps: [
			{
				down: [],
				up: [
					{
						actionId: 'recallPset',
						options: {
							val: 'ps',
						},
						delay: 0,
					},
				],
				2000: {
					options: {
						runWhileHeld: true,
					},
					actions: [
						{
							actionId: 'savePset',
							options: {
								val: 'ps',
							},
							delay: 0,
						},
						{
							actionId: 'buttonFeedback',
							options: { bol: '1' },
							delay: 0,
						},
					],
				},
				2001: [
					{
						actionId: 'buttonFeedback',
						options: { bol: '0' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'heldFeedback',
				options: {},
				style: {
					color: COLORS.BLACK,
					bgcolor: COLORS.YELLOW,
				},
			},
		],
	}
	presets['presets-PresetInc'] = {
		type: 'button',
		category: 'Presets',
		name: 'Increment presetSelector variable',
		style: {
			text: 'Preset\\nSelect\\n+1',
			size: '18',
			color: textColor,
			bgcolor: bgColor,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'modifyPresetSelector',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	}
	presets['presets-PresetDec'] = {
		type: 'button',
		category: 'Presets',
		name: 'Decrement presetSelector variable',
		style: {
			text: 'Preset\\nSelect\\n-1',
			size: '18',
			color: textColor,
			bgcolor: bgColor,
			show_topbar: false,
		},
		steps: [
			{
				down: [
					{
						actionId: 'modifyPresetSelector',
						options: { val: '-1' },
					},
				],
			},
		],
		feedbacks: [],
	}
	return presets
}

const rotationEnabledPresets = {
	'exposure-iris': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Iris - tap to open iris',
		style: {
			text: 'Iris\\n$(sony-visca:irisLevel)\\n$(sony-visca:irisPositionBar)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'irisS',
						options: {
							val: '15',
						},
					},
				],
				rotate_left: [
					{
						actionId: 'irisAdjust',
						options: { val: '2' },
					},
				],
				rotate_right: [
					{
						actionId: 'irisAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-gain': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Gain - tap to set to 0dB',
		style: {
			text: 'Gain\\n$(sony-visca:gainLevel)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'gainS',
						options: {
							val: '01',
						},
					},
				],
				rotate_left: [
					{
						actionId: 'gainAdjust',
						options: { val: '2', step: '01' },
					},
				],
				rotate_right: [
					{
						actionId: 'gainAdjust',
						options: { val: '1', step: '01' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-shutter': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Shutter - tap for default (1/60 or 1/50)',
		style: {
			text: 'Shutter\\n$(sony-visca:shutterSpeed)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'shutS',
						options: {
							val: '12',
						},
					},
				],
				rotate_left: [
					{
						actionId: 'shutterAdjust',
						options: { val: '2' },
					},
				],
				rotate_right: [
					{
						actionId: 'shutterAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-brightness': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Brightness - tap for default (1/60 or 1/50)',
		style: {
			text: 'Bright',
			size: '18',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'brightnessSet',
						options: {
							val: '11',
						},
					},
				],
				rotate_left: [
					{
						actionId: 'brightnessAdjust',
						options: { val: '2' },
					},
				],
				rotate_right: [
					{
						actionId: 'brightnessAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-Compensation': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Exposure Compensation - tap to reset, hold to toggle',
		style: {
			text: 'Expose\\nComp\\n$(sony-visca:expCompLevel)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				up: [
					{
						actionId: 'exposureComp',
						options: { val: '3' },
					},
				],
				1000: {
					options: {
						runWhileHeld: true,
					},
					actions: [
						{
							actionId: 'exposureCompOnOff',
							options: { bol: '2' },
						},
					],
				},
				rotate_left: [
					{
						actionId: 'exposureComp',
						options: { val: '2' },
					},
				],
				rotate_right: [
					{
						actionId: 'exposureComp',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureCompOn',
				options: {},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.DARK_ORANGE,
				},
			},
		],
	},
	'color-wbRedGain': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Red Gain - tap for default (192)',
		style: {
			text: 'R Gain\\n$(sony-visca:redGain)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: '#660000',
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbCustom',
						options: {
							rSet: true,
							bSet: false,
							rVal: 192,
							bVal: 192,
						},
					},
				],
				rotate_left: [
					{
						actionId: 'wbAdjust',
						options: {
							rb: 'r',
							val: '2',
						},
					},
				],
				rotate_right: [
					{
						actionId: 'wbAdjust',
						options: {
							rb: 'r',
							val: '1',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbBlueGain': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Blue Gain - tap for default (192)',
		style: {
			text: 'B Gain\\n$(sony-visca:blueGain)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: '#000066',
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbCustom',
						options: {
							rSet: false,
							bSet: true,
							rVal: 192,
							bVal: 192,
						},
					},
				],
				rotate_left: [
					{
						actionId: 'wbAdjust',
						options: {
							rb: 'b',
							val: '2',
						},
					},
				],
				rotate_right: [
					{
						actionId: 'wbAdjust',
						options: {
							rb: 'b',
							val: '1',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbOffset': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'White Balance Offset - tap to reset',
		style: {
			text: 'WB\\nOffset\\n$(sony-visca:wbOffset)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbOffsetAdjust',
						options: { val: '3' },
					},
				],
				rotate_left: [
					{
						actionId: 'wbOffsetAdjust',
						options: { val: '2' },
					},
				],
				rotate_right: [
					{
						actionId: 'wbOffsetAdjust',
						options: { val: '1' },
					},
				],
			},
		],
		feedbacks: [],
	},
	'panTilt-speed': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Pan/Tilt Speed - tap for default',
		style: {
			text: 'Pan/Tilt\\nSpeed\\n$(sony-visca:panSpeed)/$(sony-visca:tiltSpeed)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'panSpeedAdjust',
						options: {
							val: '3',
						},
					},
					{
						actionId: 'tiltSpeedAdjust',
						options: {
							val: '3',
						},
					},
				],
				rotate_left: [
					{
						actionId: 'panSpeedAdjust',
						options: {
							val: '2',
						},
					},
					{
						actionId: 'tiltSpeedAdjust',
						options: {
							val: '2',
						},
					},
				],
				rotate_right: [
					{
						actionId: 'panSpeedAdjust',
						options: {
							val: '1',
						},
					},
					{
						actionId: 'tiltSpeedAdjust',
						options: {
							val: '1',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-zoomSpeed': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Zoom Speed - tap for standard (1)',
		style: {
			text: 'Zoom\\nSpeed\\n$(sony-visca:zoomSpeed)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomSpeedAdjust',
						options: {
							val: '1',
						},
					},
				],
				rotate_left: [
					{
						actionId: 'zoomSpeedAdjust',
						options: {
							val: 'd',
						},
					},
				],
				rotate_right: [
					{
						actionId: 'zoomSpeedAdjust',
						options: {
							val: 'u',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'lens-focusSpeed': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Focus Speed - tap for standard (1)',
		style: {
			text: 'Focus\\nSpeed\\n$(sony-visca:focusSpeed)',
			size: '14',
			png64: image_rotary_bg,
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
			show_topbar: false,
		},
		options: {
			rotaryActions: true,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusSpeedAdjust',
						options: {
							val: '1',
						},
					},
				],
				rotate_left: [
					{
						actionId: 'focusSpeedAdjust',
						options: {
							val: 'd',
						},
					},
				],
				rotate_right: [
					{
						actionId: 'focusSpeedAdjust',
						options: {
							val: 'u',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
}

function formatPresetsMarkdown(title, presets) {
	let markdown = `\n### ${title} Presets\n\n`
	for (const preset in presets) {
		markdown += `- ${presets[preset].name}\n`
	}
	return markdown
}

export function getPresetsMarkdown() {
	let markdown = '## Presets Implemented\n'
	markdown += formatPresetsMarkdown('Pan/Tilt', panTiltPresets)
	markdown += formatPresetsMarkdown('Lens', lensPresets)
	markdown += formatPresetsMarkdown('Exposure', exposurePresets)
	markdown += formatPresetsMarkdown('Color', colorPresets)
	markdown += formatPresetsMarkdown('System', systemPresets)
	markdown +=
		'\n### Camera Presets\n\n' +
		'- Presets 1-64 are available\n' +
		'- Tap to recall or hold for 2 seconds to save. When a camera preset button is held for 2 seconds, all camera preset buttons will highlight yellow indicating the preset is saved and you can let go.*\n' +
		'- Presets using presetSelector variable\n' +
		'- Preset Selector Set, Increment and Decrement\n'
	markdown += formatPresetsMarkdown('Rotation Enabled', rotationEnabledPresets)
	markdown +=
		'\n*Rotation enabled presets are intended for devices like the Stream Deck+ and the Loupe Deck Live that have knobs. Rotate Left decreases the value, Rotate Right increases, and Tapping the knob defaults the setting.*\n'

	return markdown
}
