import { COLORS } from './colors.js'
import { CAP_ADVANCED, CAP_AUTO_FRAMING, CAP_FR7_AM7, CAP_TALLY, filterByModel } from './model-caps.js'
import { rawToDegrees } from './variables.js'

export function getFeedbackDefinitions(self) {
	const feedbacks = {
		heldFeedback: {
			type: 'boolean',
			name: 'Button Hold Time Reached',
			description: 'Indicate if button is held long enough for secondary action',
			defaultStyle: {
				color: COLORS.BLACK,
				bgcolor: COLORS.YELLOW,
			},
			options: [],
			callback: function () {
				return self.state.heldThresholdReached ? true : false
			},
		},
		lastPresetUsed: {
			type: 'boolean',
			name: 'Last Preset Used',
			description: 'Highlight the last preset recalled',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'number',
					label: 'Preset Number (1-64)',
					id: 'preset',
					default: 1,
					min: 1,
					max: 64,
				},
			],
			callback: function (feedback) {
				return feedback.options.preset === self.state.lastPresetUsed
			},
		},
		selectedPreset: {
			type: 'boolean',
			name: 'Selected Preset',
			description: 'Highlight the selected preset',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: 0x777788,
			},
			options: [
				{
					type: 'number',
					label: 'Preset Number (1-64)',
					id: 'preset',
					default: 1,
					min: 1,
					max: 64,
				},
			],
			callback: function (feedback) {
				return feedback.options.preset === self.state.presetSelector
			},
		},
		manualFocus: {
			type: 'boolean',
			name: 'Lens - Auto Focus State',
			description: 'Background Black if Focus is Manual',
			defaultStyle: {
				bgcolor: COLORS.BLACK,
			},
			options: [],
			callback: function () {
				return self.state.focusMode === 'Manual'
			},
		},
		zoomMode: {
			type: 'boolean',
			name: 'Zoom Mode',
			description: 'Highlights when zoom mode matches the selected mode',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: 'Optical', label: 'Optical' },
						{ id: 'Digital', label: 'Digital' },
						{ id: 'Clr Img', label: 'Clear Image Zoom' },
					],
					default: 'Clr Img',
				},
			],
			callback: function (feedback) {
				return self.state.zoomMode === feedback.options.mode
			},
		},
		exposureMode: {
			type: 'boolean',
			name: 'Exposure Mode',
			description: 'Highlights when exposure mode matches the selected mode',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: 'Auto', label: 'Full Auto' },
						{ id: 'Manual', label: 'Manual' },
						{ id: 'Shutter Pri', label: 'Shutter Priority' },
						{ id: 'Iris Pri', label: 'Iris Priority' },
						{ id: 'Gain Pri', label: 'Gain Priority' },
						{ id: 'Bright', label: 'Bright' },
					],
					default: 'Auto',
				},
			],
			callback: function (feedback) {
				return self.state.exposureMode === feedback.options.mode
			},
		},
		exposureCompOn: {
			type: 'boolean',
			name: 'Exposure Compensation On',
			description: 'Highlights if Exposure Compensation is ON',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [],
			callback: function () {
				return self.state.expCompOnOff === 'On'
			},
		},
		backlightCompOn: {
			type: 'boolean',
			name: 'Backlight Compensation On',
			description: 'Highlights if Backlight Compensation is ON',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [],
			callback: function () {
				return self.state.backlightComp === 'On'
			},
		},
		spotlightCompOn: {
			type: 'boolean',
			name: 'Spotlight Compensation On',
			description: 'Highlights if Spotlight Compensation is ON',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [],
			callback: function () {
				return self.state.spotlightComp === 'On'
			},
		},
		recordingActive: {
			models: CAP_FR7_AM7,
			type: 'boolean',
			name: 'Recording Active',
			description: 'Highlights when camera recording status is active',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_RED,
			},
			options: [],
			callback: function () {
				return self.state.recordingStatus === 'Recording'
			},
		},
		recordingPulse: {
			models: CAP_FR7_AM7,
			type: 'boolean',
			name: 'Recording Active Pulse',
			description: 'Pulse overlay for active recording state',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.RED,
			},
			options: [],
			callback: function () {
				return self.state.recordingStatus === 'Recording' && self.state.recordingPulsePhase
			},
		},
		ptSlowModeOn: {
			type: 'boolean',
			name: 'Pan/Tilt Slow Mode On',
			description: 'Highlights if Pan/Tilt Slow Mode is On',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [],
			callback: function () {
				return self.state.ptSlowMode === 'Slow'
			},
		},
		lowLightBasisBrightnessOn: {
			models: CAP_ADVANCED,
			type: 'boolean',
			name: 'Low Light Basis Brightness On',
			description: 'Highlights if Low Light Basis Brightness is On',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [],
			callback: function () {
				return self.state.lowLightBasisBrightness === 'On'
			},
		},
		autoFocusOn: {
			type: 'boolean',
			name: 'Auto Focus Active',
			description: 'Highlights when Auto Focus is active',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.RED,
			},
			options: [],
			callback: function () {
				return self.state.focusMode === 'Auto'
			},
		},
		whiteBalanceMode: {
			type: 'boolean',
			name: 'White Balance Mode',
			description: 'Highlights when white balance matches the selected mode',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'mode',
					choices: [
						{ id: 'Auto 1', label: 'Auto 1 - Auto' },
						{ id: 'Indoor', label: 'Indoor' },
						{ id: 'Outdoor', label: 'Outdoor' },
						{ id: 'One Push', label: 'One Push WB' },
						{ id: 'Auto 2', label: 'Auto 2 - ATW' },
						{ id: 'Manual', label: 'Manual' },
						{ id: 'ATW', label: 'ATW (FR7)' },
						{ id: 'Memory A', label: 'Memory A (FR7)' },
						{ id: 'Preset', label: 'Preset (FR7)' },
					],
					default: 'Auto 1',
				},
			],
			callback: function (feedback) {
				return self.state.wbMode === feedback.options.mode
			},
		},
		powerOn: {
			type: 'boolean',
			name: 'Camera Power On',
			description: 'Highlights when camera reports power is on',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [],
			callback: function () {
				return self.state.power === 'On'
			},
		},
		tallyRedOn: {
			models: CAP_TALLY,
			type: 'boolean',
			name: 'Tally Red Active',
			description: 'Highlights when red tally is on',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.RED,
			},
			options: [],
			callback: function () {
				return self.state.tallyRed === 'On'
			},
		},
		tallyGreenOn: {
			models: CAP_FR7_AM7,
			type: 'boolean',
			name: 'Tally Green Active (FR7)',
			description: 'Highlights when green tally is on',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: 0x00aa00,
			},
			options: [],
			callback: function () {
				return self.state.tallyGreen === 'On'
			},
		},
		tallyYellowOn: {
			models: new Set(['051F']),
			type: 'boolean',
			name: 'Tally Yellow Active (AM7)',
			description: 'Highlights when yellow tally is on',
			defaultStyle: {
				color: COLORS.BLACK,
				bgcolor: 0xccaa00,
			},
			options: [],
			callback: function () {
				return self.state.tallyYellow === 'On'
			},
		},
		ptzAutoFramingOn: {
			models: CAP_AUTO_FRAMING,
			type: 'boolean',
			name: 'PTZ Auto Framing Active',
			description: 'Highlights when PTZ Auto Framing is on',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [],
			callback: function () {
				return self.state.ptzAutoFraming === 'On'
			},
		},
		ptAtPosition: {
			type: 'boolean',
			name: 'PT At Position (degrees)',
			description: 'Highlights when camera is within tolerance of a target pan/tilt position',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.DARK_ORANGE,
			},
			options: [
				{
					type: 'number',
					label: 'Target Pan (degrees)',
					id: 'pan',
					default: 0,
					step: 0.1,
				},
				{
					type: 'number',
					label: 'Target Tilt (degrees)',
					id: 'tilt',
					default: 0,
					step: 0.1,
				},
				{
					type: 'number',
					label: 'Tolerance (degrees)',
					id: 'tolerance',
					default: 1,
					min: 0.1,
					max: 10,
					step: 0.1,
				},
			],
			callback: function (feedback) {
				const panDeg = rawToDegrees(self.config.model, self.state.panPosition, 'pan', self.state.imageFlip)
				const tiltDeg = rawToDegrees(self.config.model, self.state.tiltPosition, 'tilt', self.state.imageFlip)
				if (panDeg == null || tiltDeg == null) return false
				return (
					Math.abs(panDeg - feedback.options.pan) <= feedback.options.tolerance &&
					Math.abs(tiltDeg - feedback.options.tilt) <= feedback.options.tolerance
				)
			},
		},
	}

	return filterByModel(feedbacks, self.config.model)
}
