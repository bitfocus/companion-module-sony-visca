export const UpgradeScripts = [
	/*
	 * Place your upgrade scripts here
	 * Remember that once it has been added it cannot be removed!
	 */

	function pre230(_context, _props) {
		return { updatedActions: [], updatedConfig: null, updatedFeedbacks: [] }
	},
	function v23x(_context, props) {
		const result = {
			updatedActions: [],
			updatedConfig: null,
			updatedFeedbacks: [],
		}

		for (const action of props.actions) {
			switch (action.actionId) {
				// ### Pan/Tilt ###
				case 'ptSpeedU':
					action.actionId = 'panTiltSpeedAdjust'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'ptSpeedD':
					action.actionId = 'panTiltSpeedAdjust'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break

				// ### Lens ###
				case 'ciZoom':
					action.actionId = 'zoomMode'
					action.options = { mode: action.options.bol == '1' ? '4' : '3' }
					result.updatedActions.push(action)
					break

				// ### Exposure ###
				case 'gainU':
					action.actionId = 'gainAdjust'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'gainD':
					action.actionId = 'gainAdjust'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break
				case 'irisU':
					action.actionId = 'irisAdjust'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'irisD':
					action.actionId = 'irisAdjust'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break
				case 'shutU':
					action.actionId = 'shutterAdjust'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'shutD':
					action.actionId = 'shutterAdjust'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break
				case 'brightnessU':
					action.actionId = 'brightnessAdjust'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'brightnessD':
					action.actionId = 'brightnessAdjust'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break
				case 'aperture':
					if (action.options.val == '0') {
						action.options.val = '3'
					}
					result.updatedActions.push(action)
					break
				case 'apertureU':
					action.actionId = 'aperture'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'apertureD':
					action.actionId = 'aperture'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break
				case 'exposureCompU':
					action.actionId = 'exposureComp'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'exposureCompD':
					action.actionId = 'exposureComp'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break
				case 'exposureCompReset':
					action.actionId = 'exposureComp'
					action.options = { val: '3' }
					result.updatedActions.push(action)
					break

				// ### Color ###
				case 'wbIndoor':
					action.actionId = 'whiteBal'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'wbOutdoor':
					action.actionId = 'whiteBal'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break
				case 'wbRedUp':
					action.actionId = 'wbAdjust'
					action.options = { rb: 'r', val: '1' }
					result.updatedActions.push(action)
					break
				case 'wbRedDown':
					action.actionId = 'wbAdjust'
					action.options = { rb: 'r', val: '2' }
					result.updatedActions.push(action)
					break
				case 'wbBlueUp':
					action.actionId = 'wbAdjust'
					action.options = { rb: 'b', val: '1' }
					result.updatedActions.push(action)
					break
				case 'wbBlueDown':
					action.actionId = 'wbAdjust'
					action.options = { rb: 'b', val: '2' }
					result.updatedActions.push(action)
					break
				case 'wbRedS':
					action.actionId = 'wbCustom'
					action.options = { rSet: true, val: action.options.rVal, bSet: false }
					result.updatedActions.push(action)
					break
				case 'wbBlueS':
					action.actionId = 'wbCustom'
					action.options = { bSet: true, val: action.options.bVal, rSet: false }
					result.updatedActions.push(action)
					break
				case 'wbCustom':
					if (
						!Object.prototype.hasOwnProperty.call(action.options, 'rSet') &&
						!Object.prototype.hasOwnProperty.call(action.options, 'bSet')
					) {
						action.options.rSet = true
						action.options.bSet = true
						result.updatedActions.push(action)
					}
					break
				case 'wbOffsetUp':
					action.actionId = 'wbOffsetAdjust'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'wbOffsetDown':
					action.actionId = 'wbOffsetAdjust'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break
				case 'wbOffsetReset':
					action.actionId = 'wbOffsetAdjust'
					action.options = { val: '3' }
					result.updatedActions.push(action)
					break

				// ### Presets ###

				// case 'savePsetLongPress':

				// ### Misc ###
				case 'camOn':
					action.actionId = 'cameraPower'
					action.options = { val: '02' }
					result.updatedActions.push(action)
					break
				case 'camOff':
					action.actionId = 'cameraPower'
					action.options = { val: '03' }
					result.updatedActions.push(action)
					break
				case 'menuToggle':
					action.actionId = 'menu'
					action.options = { val: '1' }
					result.updatedActions.push(action)
					break
				case 'menuEnter':
					action.actionId = 'menu'
					action.options = { val: '2' }
					result.updatedActions.push(action)
					break
				case 'setHeldFeedback':
					action.actionId = 'buttonFeedback'
					action.options = { bol: '1' }
					result.updatedActions.push(action)
					break
				case 'clearHeldFeedback':
					action.actionId = 'buttonFeedback'
					action.options = { bol: '0' }
					result.updatedActions.push(action)
					break
			}
		}
		for (const feedback of props.feedbacks) {
			switch (feedback.feedbackId) {
				case 'zoomMode':
				case 'exposureAuto':
				case 'exposureIrisPriority':
				case 'exposureShutterPriority':
				case 'exposureGainPriority':
				case 'exposureCompOnOff':
				case 'backlightCompOnOff':
				case 'spotlightCompOnOff':
					feedback.feedbackId = ''
					feedback.options = {}
					result.updatedFeedbacks.push(feedback)
					break
				case 'autoFocus':
					feedback.feedbackId = 'manualFocus'
					feedback.options = {}
					result.updatedFeedbacks.push(feedback)
					break
			}
		}
		return result
	},
]
