const variables = [
	{ variableId: 'ptSlowMode', name: 'Pan/Tilt Slow mode (slow/normal)' },
	{ variableId: 'panSpeed', name: 'Pan Speed' },
	{ variableId: 'tiltSpeed', name: 'Tilt Speed' },
	{ variableId: 'zoomSpeed', name: 'Zoom Speed' },
	{ variableId: 'focusSpeed', name: 'Focus Speed' },
	{ variableId: 'zoomMode', name: 'Zoom Mode (optical/digital/clr img)' },
	{ variableId: 'focusMode', name: 'Focus Mode (auto/manual)' },
	{ variableId: 'expMode', name: 'Exposure Mode' },
	{ variableId: 'expCompOnOff', name: 'Exposure Compensation (on/off)' },
	{ variableId: 'backlightComp', name: 'Backlight Compensation (on/off)' },
	{ variableId: 'spotlightComp', name: 'Spotlight Compensation (on/off)' },
	{ variableId: 'presetSelector', name: 'Preset Selection Variable' },
	{ variableId: 'lastCmdSent', name: 'Last Command Sent (hex values)' },
]

export function initVariables() {
	// return variables
	this.setVariableDefinitions(variables)
}

export async function updateVariables() {
	this.setVariableValues({
		panSpeed: this.speed.pan,
		ptSlowMode: this.state.ptSlowMode,
		tiltSpeed: this.speed.tilt,
		zoomSpeed: this.speed.zoom,
		focusSpeed: this.speed.focus,
		zoomMode: this.state.zoomMode,
		focusMode: this.state.focusMode,
		expMode: this.state.exposureMode,
		expCompOnOff: this.state.expCompOnOff,
		backlightComp: this.state.backlightComp,
		spotlightComp: this.state.spotlightComp,
		presetSelector: this.state.presetSelector,
	})
}

function formatVariablesMarkdown(variables) {
	let markdown = '| Id | Name |\n|----|------|\n'
	for (const variable in variables) {
		markdown += `| ${variables[variable].variableId} | ${variables[variable].name} |\n`
	}
	return markdown
}

export function getVariablesMarkdown() {
	let markdown = '## Variables Implemented\n\n'
	markdown += formatVariablesMarkdown(variables)
	return markdown
}
