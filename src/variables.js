import { CAP_FR7, CAP_X400_CORE_X40UH, CAP_X400_X1000, CAP_X400_ONLY } from './model-caps.js'

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
	{ variableId: 'recordingStatus', name: 'Recording status (unknown/standby/recording)', models: CAP_FR7 },
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
	{ variableId: 'zoomPosition', name: 'Zoom Position', block: '097e7e00' },
	{ variableId: 'focusPosition', name: 'Focus Position', block: '097e7e00' },
	{ variableId: 'focusNearLimit', name: 'Focus Near Limit', block: '097e7e00' },
	{ variableId: 'afMode', name: 'Auto Focus Mode', block: '097e7e00' },
	{ variableId: 'afSensitivity', name: 'Auto Focus Sensitivity', block: '097e7e00' },
	{ variableId: 'presetRecallExecuting', name: 'Preset Recall Executing', block: '097e7e00' },
	{ variableId: 'focusCmdExecuting', name: 'Focus Command Executing', block: '097e7e00' },
	{ variableId: 'zoomCmdExecuting', name: 'Zoom Command Executing', block: '097e7e00' },
	// Block 097e7e01 — Camera Control
	{ variableId: 'wbMode', name: 'White Balance Mode', block: '097e7e01' },
	{ variableId: 'wbSpeed', name: 'White Balance Speed', block: '097e7e01' },
	{ variableId: 'detailLevel', name: 'Detail Level', block: '097e7e01' },
	{ variableId: 'colorMatrix', name: 'Color Matrix', block: '097e7e01', models: CAP_X400_ONLY },
	{ variableId: 'irisLevel', name: 'Iris Level', block: '097e7e01' },
	{ variableId: 'gainLevel', name: 'Gain Level', block: '097e7e01' },
	{ variableId: 'shutterSpeed', name: 'Shutter Speed', block: '097e7e01' },
	{ variableId: 'redGain', name: 'Red Gain', block: '097e7e01' },
	{ variableId: 'blueGain', name: 'Blue Gain', block: '097e7e01' },
	{ variableId: 'slowShutter', name: 'Slow Shutter (auto/manual)', block: '097e7e01' },
	{ variableId: 'highResolution', name: 'High Resolution (on/off)', block: '097e7e01' },
	{ variableId: 've', name: 'Visibility Enhancer (on/off)', block: '097e7e01' },
	{ variableId: 'expCompLevel', name: 'Exposure Compensation Level', block: '097e7e01' },
	// Block 097e7e02 — Other
	{ variableId: 'power', name: 'Power (on/off)', block: '097e7e02' },
	{ variableId: 'flickerCancel', name: 'Flicker Cancel (on/off)', block: '097e7e02' },
	{ variableId: 'IRCutFilterAuto', name: 'IR Cut Filter Auto (auto/manual)', block: '097e7e02' },
	{ variableId: 'imageStabilizer', name: 'Image Stabilization (on/off)', block: '097e7e02' },
	{ variableId: 'IRCutFilter', name: 'IR Cut Filter (on/off)', block: '097e7e02' },
	{ variableId: 'pictureEffectOn', name: 'Picture Effect', block: '097e7e02' },
	{ variableId: 'wbOffset', name: 'White Balance Offset', block: '097e7e02' },
	{ variableId: 'cameraIdReported', name: 'Camera ID (reported)', block: '097e7e02' },
	{ variableId: 'kneeMode', name: 'Knee Mode (Manual/Auto)', block: '097e7e02', models: CAP_X400_X1000 },
	{ variableId: 'kneeSlope', name: 'Knee Slope', block: '097e7e02', models: CAP_X400_X1000 },
	{ variableId: 'kneeSetting', name: 'Knee Setting (on/off)', block: '097e7e02', models: CAP_X400_X1000 },
	{ variableId: 'kneePoint', name: 'Knee Point', block: '097e7e02', models: CAP_X400_X1000 },
	// Block 097e7e03 — Enlargement 1
	{ variableId: 'afOpTime', name: 'AF Operating Time', block: '097e7e03' },
	{ variableId: 'afStayTime', name: 'AF Stay Time', block: '097e7e03' },
	{ variableId: 'nr2dLevel', name: '2D Noise Reduction Level', block: '097e7e03' },
	{ variableId: 'nr3dLevel', name: '3D Noise Reduction Level', block: '097e7e03' },
	{ variableId: 'nrLevel', name: 'Noise Reduction Level', block: '097e7e03' },
	{ variableId: 'gamma', name: 'Gamma', block: '097e7e03' },
	{ variableId: 'imageFlip', name: 'Image Flip (on/off)', block: '097e7e03', models: CAP_X400_CORE_X40UH },
	{ variableId: 'colorGain', name: 'Color Gain', block: '097e7e03' },
	{ variableId: 'aeSpeed', name: 'AE Speed', block: '097e7e03' },
	{ variableId: 'highSensitivity', name: 'High Sensitivity (on/off)', block: '097e7e03' },
	{ variableId: 'chromaSuppress', name: 'Chroma Suppress Level', block: '097e7e03', models: CAP_X400_X1000 },
	{ variableId: 'gainLimit', name: 'Max Gain Limit', block: '097e7e03' },
	// Block 097e7e04 — Enlargement 2
	{ variableId: 'blackLevel', name: 'Black Level', block: '097e7e04', models: CAP_X400_X1000 },
	{ variableId: 'veLevel', name: 'Visibility Enhancer Level', block: '097e7e04' },
	{ variableId: 'blackGammaLevel', name: 'Black Gamma Level', block: '097e7e04', models: CAP_X400_X1000 },
	{ variableId: 'veBrightnessComp', name: 'VE Brightness Compensation', block: '097e7e04' },
	{ variableId: 'gammaLevel', name: 'Gamma Level', block: '097e7e04', models: CAP_X400_X1000 },
	{ variableId: 'veCompLevel', name: 'VE Compensation Level', block: '097e7e04' },
	{ variableId: 'blackGammaRange', name: 'Black Gamma Range', block: '097e7e04', models: CAP_X400_X1000 },
	{ variableId: 'gammaOffset', name: 'Gamma Offset', block: '097e7e04', models: CAP_X400_X1000 },
	{ variableId: 'minShutterSpeed', name: 'Min Shutter Speed', block: '097e7e04' },
	{ variableId: 'maxShutterSpeed', name: 'Max Shutter Speed', block: '097e7e04' },
	{ variableId: 'detailHVBalance', name: 'Detail H/V Balance', block: '097e7e04' },
	{ variableId: 'detailCrispening', name: 'Detail Crispening', block: '097e7e04' },
	{ variableId: 'detailLimit', name: 'Detail Limit', block: '097e7e04' },
	{ variableId: 'detailBWBalance', name: 'Detail B/W Balance', block: '097e7e04' },
	{ variableId: 'detailHighlightDetail', name: 'Detail Highlight Detail', block: '097e7e04' },
	{ variableId: 'detailSuperLow', name: 'Detail Super Low', block: '097e7e04' },
	{ variableId: 'detailMode', name: 'Detail Mode (Manual/Auto)', block: '097e7e04' },
	{ variableId: 'detailBandwidth', name: 'Detail Bandwidth', block: '097e7e04' },
	// Block 097e7e05 — Enlargement 3
	{ variableId: 'colorHue', name: 'Color Hue', block: '097e7e05' },
	{ variableId: 'colorRG', name: 'Color Matrix R-G', block: '097e7e05', models: CAP_X400_ONLY },
	{ variableId: 'colorRB', name: 'Color Matrix R-B', block: '097e7e05', models: CAP_X400_ONLY },
	{ variableId: 'colorGR', name: 'Color Matrix G-R', block: '097e7e05', models: CAP_X400_ONLY },
	{ variableId: 'colorGB', name: 'Color Matrix G-B', block: '097e7e05', models: CAP_X400_ONLY },
	{ variableId: 'colorBR', name: 'Color Matrix B-R', block: '097e7e05', models: CAP_X400_ONLY },
	{ variableId: 'colorBG', name: 'Color Matrix B-G', block: '097e7e05', models: CAP_X400_ONLY },
]

export function initVariables(activeBlocks, modelId) {
	let filtered = activeBlocks ? variables.filter((v) => !v.block || activeBlocks.has(v.block)) : variables
	if (modelId && modelId !== 'other_all') {
		filtered = filtered.filter((v) => !v.models || (modelId !== 'other_min' && v.models.has(modelId)))
	}
	this.setVariableDefinitions(filtered)
	this.activeVariableIds = new Set(filtered.map((v) => v.variableId))
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

	const allValues = {
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
	}

	// Only set values for variables that were registered via initVariables
	if (this.activeVariableIds) {
		const filtered = {}
		for (const [key, value] of Object.entries(allValues)) {
			if (this.activeVariableIds.has(key)) {
				filtered[key] = value
			}
		}
		this.setVariableValues(filtered)
	} else {
		this.setVariableValues(allValues)
	}
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
