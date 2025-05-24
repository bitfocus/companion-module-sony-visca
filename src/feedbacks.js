import { COLORS } from './colors.js'

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
			description: 'Highlight the last preset used',
			defaultStyle: {
				color: COLORS.BLACK,
				bgcolor: COLORS.WHITE,
			},
			options: [],
			callback: function () {
				// return self.state.heldThresholdReached
			},
		},
		selectedPreset: {
			type: 'boolean',
			name: 'Selected Preset',
			description: 'Highlight the selected preset',
			defaultStyle: {
				color: COLORS.BLACK,
				bgcolor: COLORS.WHITE,
			},
			options: [],
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
				return self.state.focusMode === 'manual'
			},
		},
		exposureManual: {
			type: 'boolean',
			name: 'Manual Exposure Mode',
			description: 'Background Black if Exposure Mode is set to Manual',
			defaultStyle: {
				color: COLORS.WHITE,
				bgcolor: COLORS.BLACK,
			},
			options: [],
			callback: function () {
				return self.state.exposureMode === 'manual'
			},
		},
		exposureCompOn: {
			type: 'boolean',
			name: 'Exposure Compensation On',
			description: 'Highlights if Exposure Compensation is ON',
			defaultStyle: {
				color: COLORS.BLACK,
				bgcolor: COLORS.PALE_YELLOW,
			},
			options: [],
			callback: function () {
				return self.state.expCompOnOff === 'on'
			},
		},
		backlightCompOn: {
			type: 'boolean',
			name: 'Backlight Compensation On',
			description: 'Highlights if Backlight Compensation is ON',
			defaultStyle: {
				color: COLORS.BLACK,
				bgcolor: COLORS.PALE_YELLOW,
			},
			options: [],
			callback: function () {
				return self.state.backlightComp === 'on'
			},
		},
		spotlightCompOn: {
			type: 'boolean',
			name: 'Spotlight Compensation On',
			description: 'Highlights if Spotlight Compensation is ON',
			defaultStyle: {
				color: COLORS.BLACK,
				bgcolor: COLORS.PALE_YELLOW,
			},
			options: [],
			callback: function () {
				return self.state.spotlightComp === 'on'
			},
		},
		ptSlowModeOn: {
			type: 'boolean',
			name: 'Pan/Tilt Slow Mode On',
			description: 'Highlights if Pan/Tilt Slow Mode is On',
			defaultStyle: {
				color: COLORS.BLACK,
				bgcolor: COLORS.ORANGE,
			},
			options: [],
			callback: function () {
				return self.state.ptSlowMode === 'slow'
			},
		},
	}

	return feedbacks
}
