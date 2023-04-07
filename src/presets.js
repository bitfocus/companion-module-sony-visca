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
} from './images.js'

export function getPresetDefinitions() {
	return {
		...panTiltPresets,
		...lensPresets,
		...exposurePresets,
		...colorPresets,
		...systemPresets,
		...cameraPresets,
		...rotationEnabledPresets,
	}
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
		name: 'Speed Up',
		style: {
			text: 'Speed\\nUp',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
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
		name: 'Speed Down',
		style: {
			text: 'Speed\\nDown',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
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
		name: 'Speed Default',
		style: {
			text: 'Speed\\nDefault',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
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
}

const lensPresets = {
	'lens-zoomIn': {
		type: 'button',
		category: 'Lens',
		name: 'Zoom In',
		style: {
			text: 'ZOOM\\nIN',
			size: '12',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomI',
						options: {},
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
		name: 'Zoom Out',
		style: {
			text: 'ZOOM\\nOUT',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomO',
						options: {},
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
	'lens-zoomMode': {
		type: 'button',
		category: 'Lens',
		name: 'Zoom Mode',
		style: {
			text: 'Zoom\\nMode',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'zoomMode',
						options: {
							mode: '3',
						},
					},
				],
			},
			{
				down: [
					{
						actionId: 'zoomMode',
						options: {
							mode: '4',
						},
					},
				],
			},
			{
				down: [
					{
						actionId: 'zoomMode',
						options: {
							mode: '2',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'zoomMode',
				options: {
					option: '3',
				},
				style: {
					text: 'Optical\\nZoom',
				},
			},
			{
				feedbackId: 'zoomMode',
				options: {
					option: '4',
				},
				style: {
					text: 'CI\\nZoom',
				},
			},
			{
				feedbackId: 'zoomMode',
				options: {
					option: '2',
				},
				style: {
					text: 'Digital\\nZoom',
				},
			},
		],
	},
	'lens-focusFar': {
		type: 'button',
		category: 'Lens',
		name: 'Focus Far',
		style: {
			text: 'FOCUS\\nFAR',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusF',
						options: {},
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
		name: 'Focus Near',
		style: {
			text: 'FOCUS\\nNEAR',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusN',
						options: {},
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
		name: 'Auto/Manual Focus Toggle',
		style: {
			text: 'Auto\\nFocus',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_RED,
		},
		steps: [
			{
				down: [
					{
						actionId: 'focusM',
						options: {
							bol: '1',
						},
					},
				],
			},
			{
				down: [
					{
						actionId: 'focusM',
						options: {
							bol: '0',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'autoFocus',
				options: {
					option: '0',
				},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
					text: 'Manual\\nFocus',
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
}

const exposurePresets = {
	'exposure-autoManual': {
		type: 'button',
		category: 'Exposure',
		name: 'Auto/Manual Exposure Toggle',
		style: {
			text: 'Auto\\nExpose',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_YELLOW,
		},
		steps: [
			{
				down: [
					{
						actionId: 'expM',
						options: {
							val: '1',
						},
					},
				],
			},
			{
				down: [
					{
						actionId: 'expM',
						options: {
							val: '0',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureManual',
				options: {
					option: '1',
				},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
					text: 'Manual\\nExpose',
				},
			},
			{
				feedbackId: 'exposureIrisPriority',
				options: {
					option: '1',
				},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
					text: 'Iris\\nPriority\\nExpose',
				},
			},
			{
				feedbackId: 'exposureShutterPriority',
				options: {
					option: '1',
				},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
					text: 'Shutter\\nPriority\\nExpose',
				},
			},
			{
				feedbackId: 'exposureGainPriority',
				options: {
					option: '1',
				},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
					text: 'Gain\\nPriority\\nExpose',
				},
			},
		],
	},
	'exposure-mode': {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Mode',
		style: {
			text: 'EXP\\nMODE',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'expM',
						options: {
							val: '0',
						},
					},
				],
			},
		],
		feedbacks: [],
	},
	'exposure-irisUp': {
		type: 'button',
		category: 'Exposure',
		name: 'Iris Up',
		style: {
			text: 'IRIS\\nUp',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'irisAdjust',
						options: { val: '1' },
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
			text: 'IRIS\\nDown',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'irisAdjust',
						options: { val: '2' },
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
			text: 'Gain\\nUp',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'gainAdjust',
						options: { val: '1' },
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
			text: 'Gain\\nDown',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'gainAdjust',
						options: { val: '2' },
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
			text: 'Shut\\nUp',
			size: '18',
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
			text: 'Shut\\nDown',
			size: '18',
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
			text: 'Bright\\nUp',
			size: '18',
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
			text: 'Bright\\nDown',
			size: '18',
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
			text: 'ExpCmp\\nOn',
			size: '18',
			color: COLORS.BLACK,
			bgcolor: COLORS.PALE_YELLOW,
		},
		steps: [
			{
				down: [
					{
						actionId: 'exposureCompOnOff',
						options: {
							bol: '0',
						},
					},
				],
			},
			{
				down: [
					{
						actionId: 'exposureCompOnOff',
						options: {
							bol: '1',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'exposureCompOnOff',
				options: {
					option: '0',
				},
				style: {
					color: COLORS.WHITE,
					bgcolor: COLORS.BLACK,
					text: 'ExpCmp\\nOff',
				},
			},
		],
	},
	'exposure-CompensationUp': {
		type: 'button',
		category: 'Exposure',
		name: 'Exposure Compensation Up',
		style: {
			text: 'ExpCmp\\nUp',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
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
			text: 'ExpCmp\\nDown',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
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
			text: 'ExpCmp\\nReset',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
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
			text: 'BckLite\\nOff',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'backlightComp',
						options: {
							bol: '1',
						},
					},
				],
			},
			{
				down: [
					{
						actionId: 'backlightComp',
						options: {
							bol: '0',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'backlightCompOnOff',
				options: {
					option: '1',
				},
				style: {
					color: COLORS.BLACK,
					bgcolor: COLORS.PALE_YELLOW,
					text: 'BckLite\\nOn',
				},
			},
		],
	},
	'exposure-SpotlightCompOnOff': {
		type: 'button',
		category: 'Exposure',
		name: 'Spotlight Compensation On/Off',
		style: {
			text: 'SptLite\\nOff',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'spotlightComp',
						options: {
							bol: '1',
						},
					},
				],
			},
			{
				down: [
					{
						actionId: 'spotlightComp',
						options: {
							bol: '0',
						},
					},
				],
			},
		],
		feedbacks: [
			{
				feedbackId: 'spotlightCompOnOff',
				options: {
					option: '1',
				},
				style: {
					color: COLORS.BLACK,
					bgcolor: COLORS.PALE_YELLOW,
					text: 'SptLite\\nOn',
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
		feedbacks: [],
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
		feedbacks: [],
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
		feedbacks: [],
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
		feedbacks: [],
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
		feedbacks: [],
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
			},
		],
		feedbacks: [],
	},
	'color-wbOPWBTrigger': {
		type: 'button',
		category: 'Color',
		name: 'One push WB trigger (must be in One push WB mode)',
		style: {
			text: '1 Push\\nTrigger',
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.BLACK,
		},
		steps: [
			{
				down: [
					{
						actionId: 'wbTrigger',
						options: {},
					},
				],
			},
		],
		feedbacks: [],
	},
	'color-wbRedGainUp': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Red Gain Up (must be in WB Manual)',
		style: {
			text: 'Red\\nGain\\nUp',
			size: '18',
			color: COLORS.PALE_RED,
			bgcolor: COLORS.BLACK,
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
			text: 'Red\\nGain\\nDown',
			size: '18',
			color: COLORS.PALE_RED,
			bgcolor: COLORS.BLACK,
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
			text: 'Blue\\nGain\\nUp',
			size: '18',
			color: COLORS.PALE_BLUE,
			bgcolor: COLORS.BLACK,
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
			text: 'Blue\\nGain\\nDown',
			size: '18',
			color: COLORS.PALE_BLUE,
			bgcolor: COLORS.BLACK,
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
	'color-wbOffsetReset': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Offset Reset',
		style: {
			text: 'WB\\nOffset\\nReset',
			size: '18',
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
	'color-wbOffsetUp': {
		type: 'button',
		category: 'Color',
		name: 'White Balance - Offset Up (more red)',
		style: {
			text: 'WB\\nOffset\\nUp',
			size: '18',
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
			text: 'WB\\nOffset\\nDown',
			size: '18',
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
}

const cameraPresets = {}
for (let i = 0; i < 64; i++) {
	const preset = {
		type: 'button',
		category: 'Presets',
		name: 'Preset ' + (i + 1),
		style: {
			text: 'Preset\\n' + (i + 1),
			size: '18',
			color: COLORS.WHITE,
			bgcolor: COLORS.DARK_GRAY,
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
	cameraPresets['presets-Preset' + i] = preset
}

const rotationEnabledPresets = {
	'exposure-iris': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Iris - tap to open iris',
		style: {
			text: 'Iris',
			size: '18',
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
			text: 'Gain',
			size: '18',
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
						actionId: 'gainS',
						options: {
							val: '01',
						},
					},
				],
				rotate_left: [
					{
						actionId: 'gainAdjust',
						options: { val: '2' },
					},
				],
				rotate_right: [
					{
						actionId: 'gainAdjust',
						options: { val: '1' },
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
			text: 'Shutter',
			size: '18',
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
		name: 'Exposure Compensation - tap to reset',
		style: {
			text: 'Expose\\nComp',
			size: '18',
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
						actionId: 'exposureComp',
						options: { val: '3' },
					},
				],
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
		feedbacks: [],
	},
	'color-wbRedGain': {
		type: 'button',
		category: 'Rotation Enabled',
		name: 'Red Gain - tap for default (192)',
		style: {
			text: 'Red\\nGain',
			size: '18',
			color: COLORS.PALE_RED,
			bgcolor: COLORS.BLACK,
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
			text: 'Blue\\nGain',
			size: '18',
			color: COLORS.PALE_BLUE,
			bgcolor: COLORS.BLACK,
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
			text: 'WB\\nOffset',
			size: '18',
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
			text: 'P/T\\nSpeed',
			size: '18',
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
		'- Presets 1-64 are available  \n' +
		'- Tap to recall or hold for 2 seconds to save. When a camera preset button is held for 2 seconds, all camera preset buttons will highlight yellow indicating the preset is saved and you can let go.*\n'
	markdown += formatPresetsMarkdown('Rotation Enabled', rotationEnabledPresets)
	markdown +=
		'\n*Rotation enabled presets are intended for devices like the Stream Deck+ and the Loupe Deck Live that have knobs. Rotate Left decreases the value, Rotate Right increases, and Tapping the knob defaults the setting.*\n'

	return markdown
}
