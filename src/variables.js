import {
	CAP_BRIGHTNESS,
	CAP_FR7,
	CAP_WIDE_DYNAMIC,
	CAP_X400_CORE_X40UH,
	CAP_X400_X1000,
	CAP_X400_ONLY,
} from './model-caps.js'

// Per-model pan/tilt position ranges (from protocol docs)
// Format: { pan: [min, max], tiltOff: [min, max], tiltOn: [min, max] }
// tiltOff = image flip off / desktop, tiltOn = image flip on / ceiling
const PT_RANGES = {
	'0511': { pan: [-0x1400, 0x1400], tiltOff: [-0x0500, 0x0500], tiltOn: [-0x0500, 0x0500] }, // SRG-120DH (±100°, ±25°)
	'0519': { pan: [-0x9ca7, 0x9ca7], tiltOff: [-0x1ba5, 0x52ef], tiltOn: [-0x52ef, 0x1ba5] }, // BRC-X1000 (20-bit pan, 16-bit tilt)
	'051A': { pan: [-0x9ca7, 0x9ca7], tiltOff: [-0x1ba5, 0x52ef], tiltOn: [-0x52ef, 0x1ba5] }, // BRC-H800
	'051B': { pan: [-0x9ca7, 0x9ca7], tiltOff: [-0x1ba5, 0x52ef], tiltOn: [-0x52ef, 0x1ba5] }, // BRC-H780
	'051E': { pan: [-0x9ca7, 0x9ca7], tiltOff: [-0x1ba5, 0xb3b0], tiltOn: [-0xc183, 0x0dd2] }, // ILME-FR7 (20-bit)
	'051Ek': { pan: [-0x9ca7, 0x9ca7], tiltOff: [-0x1ba5, 0xb3b0], tiltOn: [-0xc183, 0x0dd2] }, // ILME-FR7K (20-bit)
}
// Default: X400/X40UH/A40/300SE (±170° pan, -20°/+90° flip off, -90°/+20° flip on)
const PT_DEFAULT = { pan: [-0x2200, 0x2200], tiltOff: [-0x0400, 0x1200], tiltOn: [-0x1200, 0x0400] }

function getPanTiltRange(modelId) {
	return PT_RANGES[modelId] ?? PT_DEFAULT
}

// Zoom position → ratio lookup tables (from protocol docs)
// Each table is an array of [position, ratio] pairs sorted by position
// Includes optical, Clear Image Zoom, and digital ranges where documented
// prettier-ignore
const ZOOM_20X_X400 = [
	[0x0000, 1], [0x0DC1, 2], [0x186C, 3], [0x2015, 4], [0x2594, 5],
	[0x29B7, 6], [0x2CFB, 7], [0x2FB0, 8], [0x320C, 9], [0x342D, 10],
	[0x3608, 11], [0x37AA, 12], [0x391C, 13], [0x3A66, 14], [0x3B90, 15],
	[0x3C9C, 16], [0x3D91, 17], [0x3E72, 18], [0x3F40, 19], [0x4000, 20],
	[0x5556, 30], [0x6000, 40], [0x6AAB, 60], [0x7000, 80],
	[0x7334, 100], [0x7556, 120], [0x76DC, 140], [0x7800, 160],
	[0x78E4, 180], [0x799A, 200], [0x7A2F, 220], [0x7AC0, 240],
]
// prettier-ignore
const ZOOM_12X_X120 = [
	[0x0000, 1], [0x0FB4, 2], [0x1BF0, 3], [0x24C5, 4], [0x2B1E, 5],
	[0x2FE4, 6], [0x33A9, 7], [0x36C9, 8], [0x3983, 9], [0x3BF7, 10],
	[0x3E1C, 11], [0x4000, 12],
]
// prettier-ignore
const ZOOM_12X_X1000 = [
	[0x0000, 1], [0x1800, 2], [0x2340, 3], [0x2A40, 4], [0x2F00, 5],
	[0x3300, 6], [0x3600, 7], [0x3880, 8], [0x3AC0, 9], [0x3CC0, 10],
	[0x3E80, 11], [0x4000, 12], [0x5580, 18], [0x6000, 24],
]
// prettier-ignore
const ZOOM_12X_120DH = [
	[0x0000, 1], [0x1970, 2], [0x249C, 3], [0x2B5F, 4], [0x3020, 5],
	[0x33C4, 6], [0x36B7, 7], [0x392F, 8], [0x3B4D, 9], [0x3D1E, 10],
	[0x3EAD, 11], [0x4000, 12],
	[0x6000, 24], [0x6A80, 36], [0x7000, 48], [0x7300, 60],
	[0x7540, 72], [0x76C0, 84], [0x7800, 96], [0x78C0, 108],
	[0x7980, 120], [0x7A00, 132], [0x7AC0, 144],
]
// prettier-ignore
const ZOOM_30X_300SE = [
	[0x0000, 1], [0x16A1, 2], [0x2063, 3], [0x2628, 4], [0x2A1D, 5],
	[0x2D13, 6], [0x2F6D, 7], [0x3161, 8], [0x330D, 9], [0x3486, 10],
	[0x3A0A, 15], [0x3D60, 20], [0x3F1E, 25], [0x4000, 30],
	[0x6000, 60], [0x6A80, 90], [0x7000, 120], [0x7300, 150],
	[0x7540, 180], [0x76C0, 210], [0x7800, 240], [0x78C0, 270],
	[0x7980, 300], [0x7A00, 330], [0x7AC0, 360],
]
// prettier-ignore
const ZOOM_20X_201SE = [
	[0x0000, 1], [0x1780, 2], [0x21C0, 3], [0x27C0, 4], [0x2C00, 5],
	[0x2F00, 6], [0x3180, 7], [0x3380, 8], [0x3540, 9], [0x36C0, 10],
	[0x3C80, 15], [0x4000, 20],
	[0x6000, 40], [0x6A80, 60], [0x7000, 80], [0x7300, 100],
	[0x7540, 120], [0x76C0, 140], [0x7800, 160], [0x78C0, 180],
	[0x7980, 200], [0x7A00, 220], [0x7AC0, 240],
]

// Model ID → zoom ratio table
const ZOOM_RATIO_TABLES = {
	'051C': ZOOM_20X_X400, // BRC-X400
	'051D': ZOOM_20X_X400, // BRC-X401
	'061A': ZOOM_20X_X400, // SRG-201M2
	'061B': ZOOM_12X_X120, // SRG-HD1M2
	'0618': ZOOM_12X_X120, // SRG-X120
	'0617': ZOOM_20X_X400, // SRG-X400
	'061C': ZOOM_20X_X400, // SRG-X402
	'061F': ZOOM_20X_X400, // SRG-X40UH
	'0620': ZOOM_20X_X400, // SRG-H40UH
	'0519': ZOOM_12X_X1000, // BRC-X1000
	'051B': ZOOM_12X_X1000, // BRC-H780
	'051A': ZOOM_12X_X1000, // BRC-H800
	'0511': ZOOM_12X_120DH, // SRG-120DH
	'0516a': ZOOM_20X_201SE, // SRG-201SE
	'0516b': ZOOM_30X_300SE, // SRG-300SE
	'0516c': ZOOM_30X_300SE, // SRG-301SE
}

// Focus position ranges (from protocol docs): higher position = closer
// Most cameras: 0x1000 (far/infinity) to 0xF000 (near), 120DH: to 0xE000, FR7: 0x0000 to 0xFFFF
const FOCUS_RANGES = {
	'0511': [0x1000, 0xe000], // SRG-120DH
	'051E': [0x0000, 0xffff], // ILME-FR7
	'051Ek': [0x0000, 0xffff], // ILME-FR7K
}
const FOCUS_DEFAULT_RANGE = [0x1000, 0xf000]

function getFocusRange(modelId) {
	return FOCUS_RANGES[modelId] ?? FOCUS_DEFAULT_RANGE
}

const ZOOM_OPTICAL_MAX = 0x4000
const ZOOM_CIZ_MAX = 0x6000

function getZoomMax(modelId, zoomMode) {
	if (zoomMode === 'Optical') return ZOOM_OPTICAL_MAX
	if (zoomMode === 'Clr Img') return ZOOM_CIZ_MAX
	const table = ZOOM_RATIO_TABLES[modelId]
	return table ? table[table.length - 1][0] : ZOOM_OPTICAL_MAX
}

function interpolateZoomRatio(position, table) {
	if (position <= table[0][0]) return table[0][1]
	if (position >= table[table.length - 1][0]) return table[table.length - 1][1]
	for (let i = 1; i < table.length; i++) {
		if (position <= table[i][0]) {
			const [pos0, ratio0] = table[i - 1]
			const [pos1, ratio1] = table[i]
			const t = (position - pos0) / (pos1 - pos0)
			return ratio0 + t * (ratio1 - ratio0)
		}
	}
	return table[table.length - 1][1]
}

function formatZoomRatio(position, modelId) {
	if (position == null) return ''
	const table = ZOOM_RATIO_TABLES[modelId]
	if (!table) return position.toString()
	return interpolateZoomRatio(position, table).toFixed(1) + 'x'
}

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
	{ variableId: 'lastPresetUsed', name: 'Last Preset Recalled (1-64)' },
	{ variableId: 'viscaId', name: 'Specific ViscaID to interact with (serial only)' },
	{ variableId: 'lastCmdSent', name: 'Last Command Sent (hex values)' },
	// Position bars
	{ variableId: 'panPosition', name: 'Pan Position' },
	{ variableId: 'tiltPosition', name: 'Tilt Position' },
	{ variableId: 'panPositionBar', name: 'Pan Position Bar' },
	{ variableId: 'tiltPositionBar', name: 'Tilt Position Bar' },
	{ variableId: 'zoomRatio', name: 'Zoom Ratio (e.g. 3.9x)' },
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
	{ variableId: 'brightPosition', name: 'Bright Position', block: '097e7e01', models: CAP_BRIGHTNESS },
	{ variableId: 'wideDynamic', name: 'Wide Dynamic Range (on/off)', block: '097e7e01', models: CAP_WIDE_DYNAMIC },
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
	const ptRange = getPanTiltRange(this.config.model)
	const panPct = normalizePct(this.state.panPosition, ptRange.pan[0], ptRange.pan[1])
	const [tiltMin, tiltMax] = this.state.imageFlip === 'On' ? ptRange.tiltOn : ptRange.tiltOff
	const tiltPct = normalizePct(this.state.tiltPosition, tiltMin, tiltMax)
	const zoomMax = getZoomMax(this.config.model, this.state.zoomMode)
	const zoomClamped = this.state.zoomPosition != null ? Math.min(this.state.zoomPosition, zoomMax) : null
	const zoomPct = normalizePct(zoomClamped, 0, zoomMax)
	const [focusFar] = getFocusRange(this.config.model)
	const focusNear = this.state.focusNearLimit ?? getFocusRange(this.config.model)[1]
	const focusClamped =
		this.state.focusPosition != null ? Math.max(focusFar, Math.min(this.state.focusPosition, focusNear)) : null
	const focusPctRaw = normalizePct(focusClamped, focusFar, focusNear)
	const focusPct = focusPctRaw != null ? 100 - focusPctRaw : null
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
		// Position bars and zoom ratio
		zoomRatio: formatZoomRatio(this.state.zoomPosition, this.config.model),
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
		lastPresetUsed: this.state.lastPresetUsed,
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
		brightPosition: this.state.brightPosition,
		wideDynamic: this.state.wideDynamic,
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
