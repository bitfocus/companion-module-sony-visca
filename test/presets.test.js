import { getPresetDefinitions } from '../src/presets'

const presetDefinitions = getPresetDefinitions()
const actions = []
const feedbacks = []

const walk = (obj) => {
	for (const key in obj) {
		if (key === 'actionId') {
			actions.push(obj)
		} else if (key === 'feedbackId') {
			feedbacks.push(obj)
		}
		if (typeof obj[key] === 'object') {
			walk(obj[key])
		}
	}
}
walk(presetDefinitions)

describe('ensureActionsHaveOptions', () => {
	it.each(actions)(`is an object with an actionId and options`, (action) => {
		try {
			expect(action.options).toBeDefined()
		} catch (error) {
			throw new Error(`action.options is ${error.msg} for actionId: ${action.actionId}`)
		}
	})
})

describe('ensureFeedbacksHaveOptions', () => {
	it.each(feedbacks)(`is an object with an feedbackId and options`, (feedback) => {
		try {
			expect(feedback.options).toBeDefined()
		} catch (error) {
			throw new Error(`feedback.options is ${error.msg} for feedbackId: ${feedback.feedbackId}`)
		}
	})
})
