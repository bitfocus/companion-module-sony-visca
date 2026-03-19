// Pan/tilt position ranges (signed 16-bit)
const PAN_MIN = -0x2200 // 0xDE00 signed = left limit
const PAN_MAX = 0x2200 // right limit
// Tilt range depends on image flip setting
const TILT_MIN_FLIP_OFF = -0x0400 // 0xFC00 = -1024 (bottom, flip off: -20°)
const TILT_MAX_FLIP_OFF = 0x1200 // +4608 (top, flip off: +90°)
const TILT_MIN_FLIP_ON = -0x1200 // 0xEE00 = -4608 (bottom, flip on: -90°)
const TILT_MAX_FLIP_ON = 0x0400 // +1024 (top, flip on: +20°)

function progressBar(pct, width = 10, start = '', end = '') {
	if (pct != null && pct >= 0 && pct <= 100) {
		const filled = Math.floor((pct * width) / 100)
		return start + '.'.repeat(filled) + '|' + '.'.repeat(width - filled) + end
	}
	return '---'
}

function normalizePct(val, low, high) {
	if (val == null || low === high) return null
	const pct = ((val - low) / (high - low)) * 100
	if (pct < 0 || pct > 100) return null
	return Math.round(pct)
}

const variables = [
	// Existing variables
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
	{ variableId: 'recordingStatus', name: 'Recording status (unknown/standby/recording)' },
	{ variableId: 'presetSelector', name: 'Preset Selection Variable' },
	{ variableId: 'viscaId', name: 'Specific ViscaID to interact with (serial only)' },
	{ variableId: 'lastCmdSent', name: 'Last Command Sent (hex values)' },
	// Position bars
	{ variableId: 'panPosition', name: 'Pan Position' },
	{ variableId: 'tiltPosition', name: 'Tilt Position' },
	{ variableId: 'panPositionBar', name: 'Pan Position Bar' },
	{ variableId: 'tiltPositionBar', name: 'Tilt Position Bar' },
	{ variableId: 'zoomPositionBar', name: 'Zoom Position Bar' },
	{ variableId: 'focusPositionBar', name: 'Focus Position Bar' },
	{ variableId: 'irisPositionBar', name: 'Iris Position Bar' },
	// Block 097e7e00 — Lens Control
	{ variableId: 'zoomPosition', name: 'Zoom Position' },
	{ variableId: 'focusPosition', name: 'Focus Position' },
	{ variableId: 'focusNearLimit', name: 'Focus Near Limit' },
	{ variableId: 'afMode', name: 'Auto Focus Mode' },
	{ variableId: 'afSensitivity', name: 'Auto Focus Sensitivity' },
	{ variableId: 'presetRecallExecuting', name: 'Preset Recall Executing' },
	{ variableId: 'focusCmdExecuting', name: 'Focus Command Executing' },
	{ variableId: 'zoomCmdExecuting', name: 'Zoom Command Executing' },
	// Block 097e7e01 — Camera Control
	{ variableId: 'wbMode', name: 'White Balance Mode' },
	{ variableId: 'wbSpeed', name: 'White Balance Speed' },
	{ variableId: 'detailLevel', name: 'Detail Level' },
	{ variableId: 'colorMatrix', name: 'Color Matrix' },
	{ variableId: 'irisLevel', name: 'Iris Level' },
	{ variableId: 'gainLevel', name: 'Gain Level' },
	{ variableId: 'shutterSpeed', name: 'Shutter Speed' },
	{ variableId: 'redGain', name: 'Red Gain' },
	{ variableId: 'blueGain', name: 'Blue Gain' },
	{ variableId: 'slowShutter', name: 'Slow Shutter (auto/manual)' },
	{ variableId: 'highResolution', name: 'High Resolution (on/off)' },
	{ variableId: 've', name: 'Visibility Enhancer (on/off)' },
	{ variableId: 'expCompLevel', name: 'Exposure Compensation Level' },
	// Block 097e7e02 — Other
	{ variableId: 'power', name: 'Power (on/off)' },
	{ variableId: 'flickerCancel', name: 'Flicker Cancel (on/off)' },
	{ variableId: 'IRCutFilterAuto', name: 'IR Cut Filter Auto (auto/manual)' },
	{ variableId: 'imageStabilizer', name: 'Image Stabilization (on/off)' },
	{ variableId: 'IRCutFilter', name: 'IR Cut Filter (on/off)' },
	{ variableId: 'pictureEffectOn', name: 'Picture Effect' },
	{ variableId: 'wbOffset', name: 'White Balance Offset' },
	{ variableId: 'cameraIdReported', name: 'Camera ID (reported)' },
	{ variableId: 'kneeMode', name: 'Knee Mode (Manual/Auto)' },
	{ variableId: 'kneeSlope', name: 'Knee Slope' },
	{ variableId: 'kneeSetting', name: 'Knee Setting (on/off)' },
	{ variableId: 'kneePoint', name: 'Knee Point' },
	// Block 097e7e03 — Enlargement 1
	{ variableId: 'afOpTime', name: 'AF Operating Time' },
	{ variableId: 'afStayTime', name: 'AF Stay Time' },
	{ variableId: 'nr2dLevel', name: '2D Noise Reduction Level' },
	{ variableId: 'nr3dLevel', name: '3D Noise Reduction Level' },
	{ variableId: 'nrLevel', name: 'Noise Reduction Level' },
	{ variableId: 'gamma', name: 'Gamma' },
	{ variableId: 'imageFlip', name: 'Image Flip (on/off)' },
	{ variableId: 'colorGain', name: 'Color Gain' },
	{ variableId: 'aeSpeed', name: 'AE Speed' },
	{ variableId: 'highSensitivity', name: 'High Sensitivity (on/off)' },
	{ variableId: 'chromaSuppress', name: 'Chroma Suppress Level' },
	{ variableId: 'gainLimit', name: 'Max Gain Limit' },
	// Block 097e7e04 — Enlargement 2
	{ variableId: 'blackLevel', name: 'Black Level' },
	{ variableId: 'veLevel', name: 'Visibility Enhancer Level' },
	{ variableId: 'blackGammaLevel', name: 'Black Gamma Level' },
	{ variableId: 'veBrightnessComp', name: 'VE Brightness Compensation' },
	{ variableId: 'gammaLevel', name: 'Gamma Level' },
	{ variableId: 'veCompLevel', name: 'VE Compensation Level' },
	{ variableId: 'blackGammaRange', name: 'Black Gamma Range' },
	{ variableId: 'gammaOffset', name: 'Gamma Offset' },
	{ variableId: 'minShutterSpeed', name: 'Min Shutter Speed' },
	{ variableId: 'maxShutterSpeed', name: 'Max Shutter Speed' },
	{ variableId: 'detailHVBalance', name: 'Detail H/V Balance' },
	{ variableId: 'detailCrispening', name: 'Detail Crispening' },
	{ variableId: 'detailLimit', name: 'Detail Limit' },
	{ variableId: 'detailBWBalance', name: 'Detail B/W Balance' },
	{ variableId: 'detailHighlightDetail', name: 'Detail Highlight Detail' },
	{ variableId: 'detailSuperLow', name: 'Detail Super Low' },
	{ variableId: 'detailMode', name: 'Detail Mode (Manual/Auto)' },
	{ variableId: 'detailBandwidth', name: 'Detail Bandwidth' },
	// Block 097e7e05 — Enlargement 3
	{ variableId: 'colorHue', name: 'Color Hue' },
	{ variableId: 'colorRG', name: 'Color Matrix R-G' },
	{ variableId: 'colorRB', name: 'Color Matrix R-B' },
	{ variableId: 'colorGR', name: 'Color Matrix G-R' },
	{ variableId: 'colorGB', name: 'Color Matrix G-B' },
	{ variableId: 'colorBR', name: 'Color Matrix B-R' },
	{ variableId: 'colorBG', name: 'Color Matrix B-G' },
]

export function initVariables() {
	// return variables
	this.setVariableDefinitions(variables)
}

export async function updateVariables() {
	// Calculate position percentages
	const panPct = normalizePct(this.state.panPosition, PAN_MIN, PAN_MAX)
	const tiltMin = this.state.imageFlip === 'on' ? TILT_MIN_FLIP_ON : TILT_MIN_FLIP_OFF
	const tiltMax = this.state.imageFlip === 'on' ? TILT_MAX_FLIP_ON : TILT_MAX_FLIP_OFF
	const tiltPct = normalizePct(this.state.tiltPosition, tiltMin, tiltMax)
	const zoomPct = normalizePct(this.state.zoomPosition, 0, 0xffff)
	const focusPct = normalizePct(this.state.focusPosition, 0, 0xffff)
	// Iris range: find min/max byte values from the model's IRIS choices
	const irisChoices = this.choices?.IRIS
	let irisPct = null
	if (irisChoices && this.state.irisRaw != null) {
		const irisIds = irisChoices.map((c) => parseInt(c.id, 16)).filter((v) => !isNaN(v))
		const irisMin = Math.min(...irisIds)
		const irisMax = Math.max(...irisIds)
		irisPct = normalizePct(this.state.irisRaw, irisMin, irisMax)
	}

	this.setVariableValues({
		// Position bars
		panPosition: this.state.panPosition,
		tiltPosition: this.state.tiltPosition,
		panPositionBar: progressBar(panPct, 10, 'L', 'R'),
		tiltPositionBar: progressBar(tiltPct, 10, 'D', 'U'),
		zoomPositionBar: progressBar(zoomPct, 10, 'W', 'T'),
		focusPositionBar: progressBar(focusPct, 10, 'N', 'F'),
		irisPositionBar: progressBar(irisPct, 10, 'C', 'O'),
		// Existing
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
		recordingStatus: this.state.recordingStatus,
		presetSelector: this.state.presetSelector,
		viscaId: this.state.viscaId - 0x80,
		// Block 097e7e00 — Lens Control
		zoomPosition: this.state.zoomPosition,
		focusPosition: this.state.focusPosition,
		focusNearLimit: this.state.focusNearLimit,
		afMode: this.state.afMode,
		afSensitivity: this.state.afSensitivity,
		presetRecallExecuting: this.state.presetRecallExecuting,
		focusCmdExecuting: this.state.focusCmdExecuting,
		zoomCmdExecuting: this.state.zoomCmdExecuting,
		// Block 097e7e01 — Camera Control
		wbMode: this.state.wbMode,
		wbSpeed: this.state.wbSpeed,
		detailLevel: this.state.detailLevel,
		colorMatrix: this.state.colorMatrix,
		irisLevel: this.state.irisLevel,
		gainLevel: this.state.gainLevel,
		shutterSpeed: this.state.shutterSpeed,
		redGain: this.state.redGain,
		blueGain: this.state.blueGain,
		slowShutter: this.state.slowShutter,
		highResolution: this.state.highResolution,
		ve: this.state.ve,
		expCompLevel: this.state.expCompLevel,
		// Block 097e7e02 — Other
		power: this.state.power,
		flickerCancel: this.state.flickerCancel,
		IRCutFilterAuto: this.state.IRCutFilterAuto,
		imageStabilizer: this.state.imageStabilizer,
		IRCutFilter: this.state.IRCutFilter,
		pictureEffectOn: this.state.pictureEffectOn,
		wbOffset: this.state.wbOffset,
		cameraIdReported: this.state.cameraIdReported,
		kneeMode: this.state.kneeMode,
		kneeSlope: this.state.kneeSlope,
		kneeSetting: this.state.kneeSetting,
		kneePoint: this.state.kneePoint,
		// Block 097e7e03 — Enlargement 1
		afOpTime: this.state.afOpTime,
		afStayTime: this.state.afStayTime,
		nr2dLevel: this.state.nr2dLevel,
		nr3dLevel: this.state.nr3dLevel,
		nrLevel: this.state.nrLevel,
		gamma: this.state.gamma,
		imageFlip: this.state.imageFlip,
		colorGain: this.state.colorGain,
		aeSpeed: this.state.aeSpeed,
		highSensitivity: this.state.highSensitivity,
		chromaSuppress: this.state.chromaSuppress,
		gainLimit: this.state.gainLimit,
		// Block 097e7e04 — Enlargement 2
		blackLevel: this.state.blackLevel,
		veLevel: this.state.veLevel,
		blackGammaLevel: this.state.blackGammaLevel,
		veBrightnessComp: this.state.veBrightnessComp,
		gammaLevel: this.state.gammaLevel,
		veCompLevel: this.state.veCompLevel,
		blackGammaRange: this.state.blackGammaRange,
		gammaOffset: this.state.gammaOffset,
		minShutterSpeed: this.state.minShutterSpeed,
		maxShutterSpeed: this.state.maxShutterSpeed,
		detailHVBalance: this.state.detailHVBalance,
		detailCrispening: this.state.detailCrispening,
		detailLimit: this.state.detailLimit,
		detailBWBalance: this.state.detailBWBalance,
		detailHighlightDetail: this.state.detailHighlightDetail,
		detailSuperLow: this.state.detailSuperLow,
		detailMode: this.state.detailMode,
		detailBandwidth: this.state.detailBandwidth,
		// Block 097e7e05 — Enlargement 3
		colorHue: this.state.colorHue,
		colorRG: this.state.colorRG,
		colorRB: this.state.colorRB,
		colorGR: this.state.colorGR,
		colorGB: this.state.colorGB,
		colorBR: this.state.colorBR,
		colorBG: this.state.colorBG,
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
