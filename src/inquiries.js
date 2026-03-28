// Concatenate lower nibbles of bytes at given indices into a single value
function nibbleConcat(resp, indices) {
	let value = 0
	for (let i = 0; i < indices.length; i++) {
		value |= (resp[indices[i]] & 0x0f) << ((indices.length - 1 - i) * 4)
	}
	return value
}

// Lookup a raw byte value in a choices table by hex string ID
function choiceLookup(rawByte, choices) {
	const hexId = rawByte.toString(16).padStart(2, '0').toUpperCase()
	const match = choices?.find((c) => c.id.toUpperCase() === hexId)
	return match ? match.label : `Unknown (0x${hexId})`
}

function extractField(field, resp, choices) {
	switch (field.type) {
		case 'nibbleConcat':
			return nibbleConcat(resp, field.bytes)
		case 'flag':
			return (resp[field.byte] >> field.bit) & 0x01 ? field.on : field.off
		case 'bits':
			return (resp[field.byte] >> (field.shift ?? 0)) & (field.mask ?? 0xff)
		case 'offset':
			return ((resp[field.byte] >> (field.shift ?? 0)) & (field.mask ?? 0x0f)) - field.center
		case 'choiceLookup':
			return choiceLookup(resp[field.byte] & (field.mask ?? 0xff), choices?.[field.choiceKey])
		case 'mapped':
			return field.map[field.extract(resp)] ?? 'Unknown'
		case 'custom':
			return field.extract(resp)
		default:
			return undefined
	}
}

/**
 * Parse an inquiry response payload and update state.
 * Returns true if any state value changed.
 */
export function parseInquiryResponse(blockDef, payload, state, choices) {
	if (payload.length < blockDef.minLength) {
		return false
	}

	let changed = false
	for (const field of blockDef.fields) {
		try {
			const value = extractField(field, payload, choices)
			if (value !== undefined && state[field.variable] !== value) {
				state[field.variable] = value
				changed = true
			}
		} catch {
			// Skip field on error, keep previous value
		}
	}
	return changed
}

// White balance mode values (not in choices.js)
const WB_MODES = {
	0x00: 'Auto 1',
	0x01: 'Indoor',
	0x02: 'Outdoor',
	0x03: 'One Push',
	0x04: 'Auto 2',
	0x05: 'Manual',
}

// Exposure mode values
const EXPOSURE_MODES = {
	0x00: 'Auto',
	0x03: 'Manual',
	0x0a: 'Shutter Pri',
	0x0b: 'Iris Pri',
	0x0d: 'Bright',
	0x0e: 'Gain Pri',
}

// Color matrix values
const COLOR_MATRIX = {
	0: 'Std',
	1: 'OFF',
	2: 'High Sat',
	3: 'FL Light',
	4: 'Movie',
	5: 'Still',
	6: 'Cinema',
	7: 'Pro',
	8: 'ITU709',
	9: 'B&W',
}

// Gamma values
const GAMMA_VALUES = {
	0: 'Std',
	1: 'Straight',
	2: 'Pattern',
	8: 'Movie',
	9: 'Still',
	0x0a: 'Cine1',
	0x0b: 'Cine2',
	0x0c: 'Cine3',
	0x0d: 'Cine4',
	0x0e: 'ITU709',
}

// Helper for block 05 two-byte color matrix correction values
function colorMatrixCorrection(resp, byteHigh, byteLow) {
	return (((resp[byteHigh] << 4) & 0xf0) | (resp[byteLow] & 0x0f)) - 99
}

// ==================== Block 00: Lens Control (shared across all families) ====================

const BLOCK_00_LENS = {
	name: 'Lens Control',
	minLength: 16,
	fields: [
		{ variable: 'zoomPosition', type: 'nibbleConcat', bytes: [2, 3, 4, 5] },
		{
			variable: 'focusNearLimit',
			type: 'custom',
			extract: (r) => (((r[6] & 0x0f) << 4) | (r[7] & 0x0f)) << 8,
		},
		{ variable: 'focusPosition', type: 'nibbleConcat', bytes: [8, 9, 10, 11] },
		{ variable: 'focusMode', type: 'flag', byte: 13, bit: 0, on: 'Auto', off: 'Manual' },
		{
			variable: 'zoomMode',
			type: 'mapped',
			extract: (r) => ((r[13] >> 5) & 0x02) | ((r[13] >> 1) & 0x01),
			map: { 0: 'Optical', 1: 'Digital', 2: 'Clr Img' },
		},
		{
			variable: 'afMode',
			type: 'mapped',
			extract: (r) => (r[13] >> 3) & 0x03,
			map: { 0: 'Normal', 1: 'Interval', 2: 'Zoom Trigger' },
		},
		{ variable: 'afSensitivity', type: 'flag', byte: 13, bit: 2, on: 'Normal', off: 'Low' },
		{ variable: 'presetRecallExecuting', type: 'flag', byte: 14, bit: 2, on: 'Yes', off: 'No' },
		{ variable: 'focusCmdExecuting', type: 'flag', byte: 14, bit: 1, on: 'Yes', off: 'No' },
		{ variable: 'zoomCmdExecuting', type: 'flag', byte: 14, bit: 0, on: 'Yes', off: 'No' },
	],
}

// ==================== Block 01: Camera Control (per-family) ====================

// BRC-X400 family (group 1a) — tested on hardware
const BLOCK_01_X400 = {
	name: 'Camera Control',
	minLength: 16,
	fields: [
		{ variable: 'redGain', type: 'nibbleConcat', bytes: [2, 3] },
		{ variable: 'blueGain', type: 'nibbleConcat', bytes: [4, 5] },
		{
			variable: 'wbMode',
			type: 'mapped',
			extract: (r) => r[6] & 0x0f,
			map: WB_MODES,
		},
		{ variable: 'wbSpeed', type: 'bits', byte: 7, shift: 4, mask: 0x07 },
		{ variable: 'detailLevel', type: 'offset', byte: 7, mask: 0x0f, center: 7 },
		{
			variable: 'colorMatrix',
			type: 'mapped',
			extract: (r) => ((r[8] >> 5) & 0x03) | ((r[14] >> 2) & 0x1c),
			map: COLOR_MATRIX,
		},
		{
			variable: 'exposureMode',
			type: 'mapped',
			extract: (r) => r[8] & 0x0f,
			map: EXPOSURE_MODES,
		},
		{ variable: 'highResolution', type: 'flag', byte: 9, bit: 5, on: 'On', off: 'Off' },
		{ variable: 've', type: 'flag', byte: 9, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'backlightComp', type: 'flag', byte: 9, bit: 2, on: 'On', off: 'Off' },
		{ variable: 'expCompOnOff', type: 'flag', byte: 9, bit: 1, on: 'On', off: 'Off' },
		{ variable: 'slowShutter', type: 'flag', byte: 9, bit: 0, on: 'Auto', off: 'Manual' },
		{ variable: 'shutterSpeed', type: 'choiceLookup', byte: 10, mask: 0x3f, choiceKey: 'SHUTTER' },
		{ variable: 'irisLevel', type: 'choiceLookup', byte: 11, mask: 0x1f, choiceKey: 'IRIS' },
		{ variable: 'irisRaw', type: 'bits', byte: 11, shift: 0, mask: 0x1f },
		{ variable: 'gainLevel', type: 'choiceLookup', byte: 12, mask: 0x1f, choiceKey: 'GAIN' },
		{ variable: 'expCompLevel', type: 'offset', byte: 14, mask: 0x0f, center: 7 },
	],
}

// SRG-X40UH family (group 1b)
// Response: y0 50 0r 0r 0b 0b 0w sd 0e uu vv ww 0g 00 0z FF
const BLOCK_01_X40UH = {
	name: 'Camera Control',
	minLength: 16,
	fields: [
		{ variable: 'redGain', type: 'nibbleConcat', bytes: [2, 3] },
		{ variable: 'blueGain', type: 'nibbleConcat', bytes: [4, 5] },
		{
			variable: 'wbMode',
			type: 'mapped',
			extract: (r) => r[6] & 0x0f,
			map: WB_MODES,
		},
		{ variable: 'wbSpeed', type: 'bits', byte: 7, shift: 4, mask: 0x07 },
		{ variable: 'detailLevel', type: 'offset', byte: 7, mask: 0x0f, center: 7 },
		{
			variable: 'exposureMode',
			type: 'mapped',
			extract: (r) => r[8] & 0x0f,
			map: EXPOSURE_MODES,
		},
		{ variable: 'highSensitivity', type: 'flag', byte: 9, bit: 5, on: 'On', off: 'Off' },
		{ variable: 've', type: 'flag', byte: 9, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'backlightComp', type: 'flag', byte: 9, bit: 2, on: 'On', off: 'Off' },
		{ variable: 'expCompOnOff', type: 'flag', byte: 9, bit: 1, on: 'On', off: 'Off' },
		{ variable: 'slowShutter', type: 'flag', byte: 9, bit: 0, on: 'Auto', off: 'Manual' },
		{ variable: 'shutterSpeed', type: 'choiceLookup', byte: 10, mask: 0x3f, choiceKey: 'SHUTTER' },
		{ variable: 'irisLevel', type: 'choiceLookup', byte: 11, mask: 0x1f, choiceKey: 'IRIS' },
		{ variable: 'irisRaw', type: 'bits', byte: 11, shift: 0, mask: 0x1f },
		{ variable: 'gainLevel', type: 'choiceLookup', byte: 12, mask: 0x1f, choiceKey: 'GAIN' },
		{ variable: 'expCompLevel', type: 'offset', byte: 14, mask: 0x0f, center: 7 },
	],
}

// BRC-X1000 family (group 2)
// Response: y0 50 0r 0r 0b 0b 0w 0a ee 0u vv ww 0g 00 hz FF
const BLOCK_01_X1000 = {
	name: 'Camera Control',
	minLength: 16,
	fields: [
		{ variable: 'redGain', type: 'nibbleConcat', bytes: [2, 3] },
		{ variable: 'blueGain', type: 'nibbleConcat', bytes: [4, 5] },
		{
			variable: 'wbMode',
			type: 'mapped',
			extract: (r) => r[6] & 0x0f,
			map: WB_MODES,
		},
		{
			variable: 'exposureMode',
			type: 'mapped',
			extract: (r) => r[8] & 0x0f,
			map: EXPOSURE_MODES,
		},
		{ variable: 'wideDynamic', type: 'flag', byte: 9, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'backlightComp', type: 'flag', byte: 9, bit: 2, on: 'On', off: 'Off' },
		{ variable: 'expCompOnOff', type: 'flag', byte: 9, bit: 1, on: 'On', off: 'Off' },
		{ variable: 'shutterSpeed', type: 'choiceLookup', byte: 10, mask: 0x1f, choiceKey: 'SHUTTER' },
		{ variable: 'irisLevel', type: 'choiceLookup', byte: 11, mask: 0x1f, choiceKey: 'IRIS' },
		{ variable: 'irisRaw', type: 'bits', byte: 11, shift: 0, mask: 0x1f },
		{ variable: 'gainLevel', type: 'choiceLookup', byte: 12, mask: 0x1f, choiceKey: 'GAIN' },
		{ variable: 'expCompLevel', type: 'offset', byte: 14, mask: 0x0f, center: 7 },
	],
}

// SRG-120DH (group 3a) and SRG-300SE (group 3b) — identical block 01 layout
// Differences from X400: no wbSpeed/detailLevel at byte 7, no colorMatrix,
// wideDynamic replaces VE at byte 9 bit 4, brightPosition at byte 13
const BLOCK_01_LEGACY = {
	name: 'Camera Control',
	minLength: 16,
	fields: [
		{ variable: 'redGain', type: 'nibbleConcat', bytes: [2, 3] },
		{ variable: 'blueGain', type: 'nibbleConcat', bytes: [4, 5] },
		{
			variable: 'wbMode',
			type: 'mapped',
			extract: (r) => r[6] & 0x0f,
			map: WB_MODES,
		},
		{
			variable: 'exposureMode',
			type: 'mapped',
			extract: (r) => r[8] & 0x0f,
			map: EXPOSURE_MODES,
		},
		{ variable: 'highResolution', type: 'flag', byte: 9, bit: 5, on: 'On', off: 'Off' },
		{ variable: 'wideDynamic', type: 'flag', byte: 9, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'backlightComp', type: 'flag', byte: 9, bit: 2, on: 'On', off: 'Off' },
		{ variable: 'expCompOnOff', type: 'flag', byte: 9, bit: 1, on: 'On', off: 'Off' },
		{ variable: 'slowShutter', type: 'flag', byte: 9, bit: 0, on: 'Auto', off: 'Manual' },
		{ variable: 'shutterSpeed', type: 'choiceLookup', byte: 10, mask: 0x1f, choiceKey: 'SHUTTER' },
		{ variable: 'irisLevel', type: 'choiceLookup', byte: 11, mask: 0x1f, choiceKey: 'IRIS' },
		{ variable: 'irisRaw', type: 'bits', byte: 11, shift: 0, mask: 0x1f },
		{ variable: 'gainLevel', type: 'choiceLookup', byte: 12, mask: 0x0f, choiceKey: 'GAIN' },
		{ variable: 'brightPosition', type: 'choiceLookup', byte: 13, mask: 0x1f, choiceKey: 'BRIGHTNESS' },
		{ variable: 'expCompLevel', type: 'offset', byte: 14, mask: 0x0f, center: 7 },
	],
}

// ==================== Block 02: Other (per-family, completely different layouts) ====================

// BRC-X400 family (group 1a) — tested on hardware
const BLOCK_02_X400 = {
	name: 'Other',
	minLength: 16,
	fields: [
		{ variable: 'spotlightComp', type: 'flag', byte: 2, bit: 5, on: 'On', off: 'Off' },
		{ variable: 'flickerCancel', type: 'flag', byte: 2, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'IRCutFilterAuto', type: 'flag', byte: 2, bit: 2, on: 'Auto', off: 'Manual' },
		{ variable: 'power', type: 'flag', byte: 2, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'imageStabilizer', type: 'flag', byte: 3, bit: 6, on: 'On', off: 'Off' },
		{ variable: 'IRCutFilter', type: 'flag', byte: 3, bit: 4, on: 'On', off: 'Off' },
		{
			variable: 'pictureEffectOn',
			type: 'custom',
			extract: (r) => '0x' + (r[5] & 0x0f).toString(16).toUpperCase(),
		},
		{ variable: 'wbOffset', type: 'offset', byte: 7, mask: 0x0f, center: 7 },
		{
			variable: 'cameraIdReported',
			type: 'custom',
			extract: (r) => nibbleConcat(r, [8, 9, 10, 11]).toString(16).padStart(4, '0').toUpperCase(),
		},
		{ variable: 'kneeMode', type: 'flag', byte: 13, bit: 4, on: 'Manual', off: 'Auto' },
		{ variable: 'kneeSlope', type: 'offset', byte: 13, mask: 0x0f, center: 7 },
		{ variable: 'kneeSetting', type: 'flag', byte: 14, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'kneePoint', type: 'bits', byte: 14, shift: 0, mask: 0x0f },
	],
}

// SRG-X40UH family (group 1b)
// Response: y0 50 pp qq 00 00 00 0r ss tt uu vv 00 00 00 00 FF
const BLOCK_02_X40UH = {
	name: 'Other',
	minLength: 16,
	fields: [
		{ variable: 'spotlightComp', type: 'flag', byte: 2, bit: 5, on: 'On', off: 'Off' },
		{ variable: 'flickerCancel', type: 'flag', byte: 2, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'IRCutFilterAuto', type: 'flag', byte: 2, bit: 2, on: 'Auto', off: 'Manual' },
		{ variable: 'power', type: 'flag', byte: 2, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'imageStabilizer', type: 'flag', byte: 3, bit: 6, on: 'On', off: 'Off' },
		{ variable: 'IRCutFilter', type: 'flag', byte: 3, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'wbOffset', type: 'offset', byte: 7, mask: 0x0f, center: 7 },
		{
			variable: 'cameraIdReported',
			type: 'custom',
			extract: (r) => nibbleConcat(r, [8, 9, 10, 11]).toString(16).padStart(4, '0').toUpperCase(),
		},
	],
}

// BRC-X1000 family (group 2)
// Response: y0 50 pp 0q 00 rr 00 ss 00 00 00 00 tt uu vv FF
const BLOCK_02_X1000 = {
	name: 'Other',
	minLength: 16,
	fields: [
		{ variable: 'spotlightComp', type: 'flag', byte: 2, bit: 5, on: 'On', off: 'Off' },
		{ variable: 'flickerCancel', type: 'flag', byte: 2, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'power', type: 'flag', byte: 2, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'IRCutFilter', type: 'flag', byte: 3, bit: 4, on: 'On', off: 'Off' },
		{
			variable: 'pictureEffectOn',
			type: 'custom',
			extract: (r) => '0x' + (r[5] & 0x0f).toString(16).toUpperCase(),
		},
		{ variable: 'wbOffset', type: 'offset', byte: 7, mask: 0x0f, center: 7 },
		{ variable: 'imageStabilizer', type: 'flag', byte: 12, bit: 1, on: 'On', off: 'Off' },
		{ variable: 'kneeMode', type: 'flag', byte: 13, bit: 4, on: 'Manual', off: 'Auto' },
		{ variable: 'kneeSlope', type: 'offset', byte: 13, mask: 0x0f, center: 7 },
		{ variable: 'kneeSetting', type: 'flag', byte: 14, bit: 4, on: 'On', off: 'Off' },
		{ variable: 'kneePoint', type: 'bits', byte: 14, shift: 0, mask: 0x0f },
	],
}

// SRG-120DH (group 3a)
// Response: y0 50 0p 00 00 0q 00 00 0r 0r 0r 0r 0s 00 00 FF
const BLOCK_02_120DH = {
	name: 'Other',
	minLength: 16,
	fields: [
		{ variable: 'power', type: 'flag', byte: 2, bit: 0, on: 'On', off: 'Off' },
		{
			variable: 'pictureEffectOn',
			type: 'custom',
			extract: (r) => '0x' + (r[5] & 0x0f).toString(16).toUpperCase(),
		},
		{
			variable: 'cameraIdReported',
			type: 'custom',
			extract: (r) => nibbleConcat(r, [8, 9, 10, 11]).toString(16).padStart(4, '0').toUpperCase(),
		},
	],
}

// SRG-300SE family (group 3b)
// Response: y0 50 0p 0q 00 00 00 0r 0s 0s 0t 0t 0u 00 00 FF
const BLOCK_02_300SE = {
	name: 'Other',
	minLength: 16,
	fields: [
		{ variable: 'IRCutFilterAuto', type: 'flag', byte: 2, bit: 2, on: 'Auto', off: 'Manual' },
		{ variable: 'power', type: 'flag', byte: 2, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'imageStabilizer', type: 'flag', byte: 3, bit: 6, on: 'On', off: 'Off' },
		{ variable: 'IRCutFilter', type: 'flag', byte: 3, bit: 4, on: 'On', off: 'Off' },
		{
			variable: 'pictureEffectOn',
			type: 'custom',
			extract: (r) => '0x' + (r[5] & 0x0f).toString(16).toUpperCase(),
		},
		{
			variable: 'cameraIdReported',
			type: 'custom',
			extract: (r) => nibbleConcat(r, [8, 9, 10, 11]).toString(16).padStart(4, '0').toUpperCase(),
		},
	],
}

// ==================== Block 03: Enlargement 1 (per-family) ====================

// BRC-X400 family (group 1a) — tested on hardware
const BLOCK_03_X400 = {
	name: 'Enlargement 1',
	minLength: 16,
	fields: [
		{ variable: 'afOpTime', type: 'nibbleConcat', bytes: [4, 5] },
		{ variable: 'afStayTime', type: 'nibbleConcat', bytes: [6, 7] },
		{ variable: 'nr2dLevel', type: 'bits', byte: 8, shift: 4, mask: 0x07 },
		{ variable: 'nr3dLevel', type: 'bits', byte: 9, shift: 4, mask: 0x07 },
		{
			variable: 'gamma',
			type: 'mapped',
			extract: (r) => (r[10] & 0x78) | ((r[13] >> 4) & 0x07),
			map: GAMMA_VALUES,
		},
		{ variable: 'imageFlip', type: 'flag', byte: 10, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'colorGain', type: 'bits', byte: 11, shift: 3, mask: 0x0f },
		{ variable: 'aeSpeed', type: 'bits', byte: 12, shift: 0, mask: 0x3f },
		{ variable: 'highSensitivity', type: 'flag', byte: 13, bit: 3, on: 'On', off: 'Off' },
		{ variable: 'nrLevel', type: 'bits', byte: 13, shift: 0, mask: 0x07 },
		{ variable: 'chromaSuppress', type: 'bits', byte: 14, shift: 4, mask: 0x07 },
		{ variable: 'gainLimit', type: 'choiceLookup', byte: 14, mask: 0x0f, choiceKey: 'GAIN' },
	],
}

// SRG-X40UH family (group 1b)
// Response: y0 50 00 00 0p 0q 0r 0s tt uu 0v 00 0w 0x yy 00 FF
const BLOCK_03_X40UH = {
	name: 'Enlargement 1',
	minLength: 16,
	fields: [
		{ variable: 'afOpTime', type: 'nibbleConcat', bytes: [4, 5] },
		{ variable: 'afStayTime', type: 'nibbleConcat', bytes: [6, 7] },
		{ variable: 'nr2dLevel', type: 'bits', byte: 8, shift: 4, mask: 0x07 },
		{ variable: 'nr3dLevel', type: 'bits', byte: 9, shift: 4, mask: 0x07 },
		{ variable: 'imageFlip', type: 'flag', byte: 10, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'aeSpeed', type: 'bits', byte: 12, shift: 0, mask: 0x3f },
		{ variable: 'highSensitivity', type: 'flag', byte: 13, bit: 3, on: 'On', off: 'Off' },
		{ variable: 'nrLevel', type: 'bits', byte: 13, shift: 0, mask: 0x07 },
	],
}

// BRC-X1000 family (group 2)
// Response: y0 50 0a 00 00 00 00 00 cc dd ee ff 0g hh jj kk FF
const BLOCK_03_X1000 = {
	name: 'Enlargement 1',
	minLength: 16,
	fields: [
		{ variable: 'nr2dLevel', type: 'bits', byte: 8, shift: 4, mask: 0x07 },
		{ variable: 'nr3dLevel', type: 'bits', byte: 9, shift: 4, mask: 0x07 },
		{
			variable: 'gamma',
			type: 'mapped',
			extract: (r) => (r[10] & 0x78) | ((r[13] >> 4) & 0x07),
			map: GAMMA_VALUES,
		},
		{ variable: 'imageFlip', type: 'flag', byte: 10, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'colorGain', type: 'bits', byte: 11, shift: 3, mask: 0x0f },
		{ variable: 'aeSpeed', type: 'bits', byte: 12, shift: 0, mask: 0x3f },
		{ variable: 'nrLevel', type: 'bits', byte: 13, shift: 0, mask: 0x07 },
		{ variable: 'chromaSuppress', type: 'bits', byte: 14, shift: 4, mask: 0x07 },
		{ variable: 'gainLimit', type: 'choiceLookup', byte: 14, mask: 0x0f, choiceKey: 'GAIN' },
	],
}

// SRG-A40 family (group 5) — X40UH block 03 + chromaSuppress/gainLimit
// Response: y0 50 00 00 0p 0q 0r 0s tt uu 0v 0w 0x 0y zz aa FF
const BLOCK_03_A40 = {
	name: 'Enlargement 1',
	minLength: 16,
	fields: [
		{ variable: 'afOpTime', type: 'nibbleConcat', bytes: [4, 5] },
		{ variable: 'afStayTime', type: 'nibbleConcat', bytes: [6, 7] },
		{ variable: 'nr2dLevel', type: 'bits', byte: 8, shift: 4, mask: 0x07 },
		{ variable: 'nr3dLevel', type: 'bits', byte: 9, shift: 4, mask: 0x07 },
		{ variable: 'imageFlip', type: 'flag', byte: 10, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'aeSpeed', type: 'bits', byte: 12, shift: 0, mask: 0x3f },
		{ variable: 'highSensitivity', type: 'flag', byte: 13, bit: 3, on: 'On', off: 'Off' },
		{ variable: 'nrLevel', type: 'bits', byte: 13, shift: 0, mask: 0x07 },
		{ variable: 'chromaSuppress', type: 'bits', byte: 14, shift: 4, mask: 0x07 },
		{ variable: 'gainLimit', type: 'choiceLookup', byte: 14, mask: 0x0f, choiceKey: 'GAIN' },
	],
}

// SRG-A40 family (group 5) — X40UH block 04 + defog/defogLevel
// Response: y0 50 pp 00 qq rr ss 00 0t uu vv ww xx yy zz FF
const BLOCK_04_A40 = {
	name: 'Enlargement 2',
	minLength: 16,
	fields: [
		{
			variable: 'veMode',
			type: 'mapped',
			extract: (r) => r[2] & 0x03,
			map: { 0: 'Off', 2: 'On', 3: 'Manual' },
		},
		{ variable: 'veLevel', type: 'bits', byte: 4, shift: 0, mask: 0x07 },
		{
			variable: 'veBrightnessComp',
			type: 'mapped',
			extract: (r) => r[5] & 0x03,
			map: { 0: 'Very Dark', 1: 'Dark', 2: 'Standard', 3: 'Bright' },
		},
		{ variable: 'veCompLevel', type: 'bits', byte: 6, shift: 0, mask: 0x03 },
		{ variable: 'defog', type: 'flag', byte: 7, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'defogLevel', type: 'bits', byte: 8, shift: 0, mask: 0x03 },
		{ variable: 'minShutterSpeed', type: 'choiceLookup', byte: 9, mask: 0x3f, choiceKey: 'SHUTTER' },
		{ variable: 'maxShutterSpeed', type: 'choiceLookup', byte: 10, mask: 0x3f, choiceKey: 'SHUTTER' },
		{
			variable: 'detailHVBalance',
			type: 'custom',
			extract: (r) => ((r[11] >> 3) & 0x07) - 2,
		},
		{ variable: 'detailCrispening', type: 'bits', byte: 11, shift: 0, mask: 0x07 },
		{ variable: 'detailLimit', type: 'bits', byte: 12, shift: 3, mask: 0x07 },
		{
			variable: 'detailBWBalance',
			type: 'custom',
			extract: (r) => 'Type ' + (r[12] & 0x07),
		},
		{ variable: 'detailHighlightDetail', type: 'bits', byte: 13, shift: 3, mask: 0x07 },
		{ variable: 'detailSuperLow', type: 'bits', byte: 13, shift: 0, mask: 0x07 },
		{ variable: 'detailMode', type: 'flag', byte: 14, bit: 3, on: 'Manual', off: 'Auto' },
		{
			variable: 'detailBandwidth',
			type: 'mapped',
			extract: (r) => r[14] & 0x07,
			map: { 0: 'Standard', 1: 'Low', 2: 'Mid', 3: 'High', 4: 'Wide' },
		},
	],
}

// SRG-120DH (group 3a) and SRG-300SE (group 3b) — identical block 03 layout
// Response: y0 50 0a 0b 0c 0d 0e 0f 00 00 00 gg 00 hh jj FF
const BLOCK_03_LEGACY = {
	name: 'Enlargement 1',
	minLength: 16,
	fields: [
		{ variable: 'digitalZoomPos', type: 'nibbleConcat', bytes: [2, 3] },
		{ variable: 'afOpTime', type: 'nibbleConcat', bytes: [4, 5] },
		{ variable: 'afStayTime', type: 'nibbleConcat', bytes: [6, 7] },
		{ variable: 'colorGain', type: 'bits', byte: 11, shift: 3, mask: 0x0f },
		{
			variable: 'gamma',
			type: 'mapped',
			extract: (r) => (r[13] >> 4) & 0x07,
			map: GAMMA_VALUES,
		},
		{ variable: 'highSensitivity', type: 'flag', byte: 13, bit: 3, on: 'On', off: 'Off' },
		{ variable: 'nrLevel', type: 'bits', byte: 13, shift: 0, mask: 0x07 },
		{ variable: 'chromaSuppress', type: 'bits', byte: 14, shift: 4, mask: 0x07 },
		{ variable: 'gainLimit', type: 'choiceLookup', byte: 14, mask: 0x0f, choiceKey: 'GAIN' },
	],
}

// SRG-120DH and SRG-300SE — only defog at byte7[0]
// Response: y0 50 pp 00 qq rr ss 00 0t 00 00 00 00 00 00 00 FF
const BLOCK_04_LEGACY = {
	name: 'Enlargement 2',
	minLength: 16,
	fields: [{ variable: 'defog', type: 'flag', byte: 7, bit: 0, on: 'On', off: 'Off' }],
}

// SRG-120DH and SRG-300SE — only colorHue at byte2[3:0]
// Response: y0 50 0a 00 00 00 00 00 00 00 00 00 00 00 00 00 FF
const BLOCK_05_LEGACY = {
	name: 'Enlargement 3',
	minLength: 16,
	fields: [{ variable: 'colorHue', type: 'offset', byte: 2, mask: 0x0f, center: 7 }],
}

// ==================== Block 04: Enlargement 2 / Color (per-family) ====================

// BRC-X400 family (group 1a) — tested on hardware
const BLOCK_04_X400 = {
	name: 'Enlargement 2',
	minLength: 16,
	fields: [
		{
			variable: 'veMode',
			type: 'mapped',
			extract: (r) => r[2] & 0x03,
			map: { 0: 'Off', 2: 'On', 3: 'Manual' },
		},
		{
			variable: 'blackLevel',
			type: 'custom',
			extract: (r) => ((r[3] & 0x0f) << 4) | ((r[4] >> 3) & 0x0f),
		},
		{ variable: 'veLevel', type: 'bits', byte: 4, shift: 0, mask: 0x07 },
		{ variable: 'blackGammaLevel', type: 'offset', byte: 5, shift: 2, mask: 0x0f, center: 7 },
		{
			variable: 'veBrightnessComp',
			type: 'mapped',
			extract: (r) => r[5] & 0x03,
			map: { 0: 'Very Dark', 1: 'Dark', 2: 'Standard', 3: 'Bright' },
		},
		{ variable: 'gammaLevel', type: 'offset', byte: 6, shift: 2, mask: 0x0f, center: 7 },
		{ variable: 'veCompLevel', type: 'bits', byte: 6, shift: 0, mask: 0x03 },
		{
			variable: 'blackGammaRange',
			type: 'mapped',
			extract: (r) => (r[7] >> 5) & 0x03,
			map: { 0: 'Low', 1: 'Mid', 2: 'High' },
		},
		{
			variable: 'gammaOffset',
			type: 'custom',
			extract: (r) => {
				const sign = (r[7] >> 4) & 0x01
				const magnitude = (((r[7] >> 1) & 0x07) << 4) | ((r[8] >> 2) & 0x0f)
				return sign ? -magnitude : magnitude
			},
		},
		{ variable: 'defog', type: 'flag', byte: 7, bit: 0, on: 'On', off: 'Off' },
		{ variable: 'defogLevel', type: 'bits', byte: 8, shift: 0, mask: 0x03 },
		{ variable: 'minShutterSpeed', type: 'choiceLookup', byte: 9, mask: 0x3f, choiceKey: 'SHUTTER' },
		{ variable: 'maxShutterSpeed', type: 'choiceLookup', byte: 10, mask: 0x3f, choiceKey: 'SHUTTER' },
		{
			variable: 'detailHVBalance',
			type: 'custom',
			extract: (r) => ((r[11] >> 3) & 0x07) - 2,
		},
		{ variable: 'detailCrispening', type: 'bits', byte: 11, shift: 0, mask: 0x07 },
		{ variable: 'detailLimit', type: 'bits', byte: 12, shift: 3, mask: 0x07 },
		{
			variable: 'detailBWBalance',
			type: 'custom',
			extract: (r) => 'Type ' + (r[12] & 0x07),
		},
		{ variable: 'detailHighlightDetail', type: 'bits', byte: 13, shift: 3, mask: 0x07 },
		{ variable: 'detailSuperLow', type: 'bits', byte: 13, shift: 0, mask: 0x07 },
		{ variable: 'detailMode', type: 'flag', byte: 14, bit: 3, on: 'Manual', off: 'Auto' },
		{
			variable: 'detailBandwidth',
			type: 'mapped',
			extract: (r) => r[14] & 0x07,
			map: { 0: 'Standard', 1: 'Low', 2: 'Mid', 3: 'High', 4: 'Wide' },
		},
	],
}

// SRG-X40UH family (group 1b)
// Response: y0 50 pp 00 qq rr ss 00 00 00 tt uu vv ww xx yy zz FF
const BLOCK_04_X40UH = {
	name: 'Enlargement 2',
	minLength: 16,
	fields: [
		{
			variable: 'veMode',
			type: 'mapped',
			extract: (r) => r[2] & 0x03,
			map: { 0: 'Off', 2: 'On', 3: 'Manual' },
		},
		{ variable: 'veLevel', type: 'bits', byte: 4, shift: 0, mask: 0x07 },
		{
			variable: 'veBrightnessComp',
			type: 'mapped',
			extract: (r) => r[5] & 0x03,
			map: { 0: 'Very Dark', 1: 'Dark', 2: 'Standard', 3: 'Bright' },
		},
		{ variable: 'veCompLevel', type: 'bits', byte: 6, shift: 0, mask: 0x03 },
		{ variable: 'minShutterSpeed', type: 'choiceLookup', byte: 9, mask: 0x3f, choiceKey: 'SHUTTER' },
		{ variable: 'maxShutterSpeed', type: 'choiceLookup', byte: 10, mask: 0x3f, choiceKey: 'SHUTTER' },
		{
			variable: 'detailHVBalance',
			type: 'custom',
			extract: (r) => ((r[11] >> 3) & 0x07) - 2,
		},
		{ variable: 'detailCrispening', type: 'bits', byte: 11, shift: 0, mask: 0x07 },
		{ variable: 'detailLimit', type: 'bits', byte: 12, shift: 3, mask: 0x07 },
		{
			variable: 'detailBWBalance',
			type: 'custom',
			extract: (r) => 'Type ' + (r[12] & 0x07),
		},
		{ variable: 'detailHighlightDetail', type: 'bits', byte: 13, shift: 3, mask: 0x07 },
		{ variable: 'detailSuperLow', type: 'bits', byte: 13, shift: 0, mask: 0x07 },
		{ variable: 'detailMode', type: 'flag', byte: 14, bit: 3, on: 'Manual', off: 'Auto' },
		{
			variable: 'detailBandwidth',
			type: 'mapped',
			extract: (r) => r[14] & 0x07,
			map: { 0: 'Standard', 1: 'Low', 2: 'Mid', 3: 'High', 4: 'Wide' },
		},
	],
}

// ==================== Block 05: Enlargement 3 / Detail (per-family) ====================

// BRC-X400 family (group 1a) — tested on hardware
const BLOCK_05_X400 = {
	name: 'Enlargement 3',
	minLength: 16,
	fields: [
		{ variable: 'colorHue', type: 'offset', byte: 2, mask: 0x0f, center: 7 },
		{ variable: 'colorRG', type: 'custom', extract: (r) => colorMatrixCorrection(r, 3, 4) },
		{ variable: 'colorRB', type: 'custom', extract: (r) => colorMatrixCorrection(r, 5, 6) },
		{ variable: 'colorGR', type: 'custom', extract: (r) => colorMatrixCorrection(r, 7, 8) },
		{ variable: 'colorGB', type: 'custom', extract: (r) => colorMatrixCorrection(r, 9, 10) },
		{ variable: 'colorBR', type: 'custom', extract: (r) => colorMatrixCorrection(r, 11, 12) },
		{ variable: 'colorBG', type: 'custom', extract: (r) => colorMatrixCorrection(r, 13, 14) },
	],
}

// ==================== Per-family block sets ====================

const BLOCKS_X400 = {
	'097e7e00': BLOCK_00_LENS,
	'097e7e01': BLOCK_01_X400,
	'097e7e02': BLOCK_02_X400,
	'097e7e03': BLOCK_03_X400,
	'097e7e04': BLOCK_04_X400,
	'097e7e05': BLOCK_05_X400,
}

const BLOCKS_X40UH = {
	'097e7e00': BLOCK_00_LENS,
	'097e7e01': BLOCK_01_X40UH,
	'097e7e02': BLOCK_02_X40UH,
	'097e7e03': BLOCK_03_X40UH,
	'097e7e04': BLOCK_04_X40UH,
}

const BLOCKS_X1000 = {
	'097e7e00': BLOCK_00_LENS,
	'097e7e01': BLOCK_01_X1000,
	'097e7e02': BLOCK_02_X1000,
	'097e7e03': BLOCK_03_X1000,
}

const BLOCKS_A40 = {
	'097e7e00': BLOCK_00_LENS,
	'097e7e01': BLOCK_01_X40UH,
	'097e7e02': BLOCK_02_X40UH,
	'097e7e03': BLOCK_03_A40,
	'097e7e04': BLOCK_04_A40,
}

const BLOCKS_120DH = {
	'097e7e00': BLOCK_00_LENS,
	'097e7e01': BLOCK_01_LEGACY,
	'097e7e02': BLOCK_02_120DH,
	'097e7e03': BLOCK_03_LEGACY,
	'097e7e04': BLOCK_04_LEGACY,
	'097e7e05': BLOCK_05_LEGACY,
}

const BLOCKS_300SE = {
	'097e7e00': BLOCK_00_LENS,
	'097e7e01': BLOCK_01_LEGACY,
	'097e7e02': BLOCK_02_300SE,
	'097e7e03': BLOCK_03_LEGACY,
	'097e7e04': BLOCK_04_LEGACY,
	'097e7e05': BLOCK_05_LEGACY,
}

// ILME-FR7 (group 4) — individual inquiries only, no block inquiry support.
// FR7 uses 02=On/03=Off instead of bit flags, and has unique WB mode values.
const FR7_WB_MODES = {
	0x04: 'ATW',
	0x05: 'Memory A',
	0x0a: 'Preset',
}

function fr7OnOff(variable, on = 'On', off = 'Off') {
	return {
		minLength: 4,
		fields: [{ variable, type: 'mapped', extract: (r) => r[2], map: { 0x02: on, 0x03: off } }],
	}
}

const BLOCKS_FR7 = {
	// ZoomPosInq: y0 50 0z 0z 0z 0z FF
	'090447': {
		minLength: 7,
		fields: [{ variable: 'zoomPosition', type: 'nibbleConcat', bytes: [2, 3, 4, 5] }],
	},
	// FocusPosInq: y0 50 0p 0p 0p 0p FF
	'090448': {
		minLength: 7,
		fields: [{ variable: 'focusPosition', type: 'nibbleConcat', bytes: [2, 3, 4, 5] }],
	},
	// FocusModeInq: y0 50 pp FF (02=Auto, 03=Manual)
	'090438': fr7OnOff('focusMode', 'Auto', 'Manual'),
	// PowerInq: y0 50 0p FF (02=On, 03=Standby)
	'090400': fr7OnOff('power'),
	// WBModeInq: y0 50 0p FF (04=ATW, 05=Memory A, 0A=Preset)
	'090435': {
		minLength: 4,
		fields: [
			{
				variable: 'wbMode',
				type: 'mapped',
				extract: (r) => r[2] & 0x0f,
				map: FR7_WB_MODES,
			},
		],
	},
	// BacklightCompInq: y0 50 0p FF (02=On, 03=Off)
	'090433': fr7OnOff('backlightComp'),
	// SpotlightCompInq: y0 50 0p FF (02=On, 03=Off)
	'09043a': fr7OnOff('spotlightComp'),
}

const GROUP_TO_BLOCKS = {
	'1a': BLOCKS_X400,
	'1b': BLOCKS_X40UH,
	2: BLOCKS_X1000,
	'3a': BLOCKS_120DH,
	'3b': BLOCKS_300SE,
	4: BLOCKS_FR7,
	5: BLOCKS_A40,
}

export function getInquiryBlocks(group) {
	return GROUP_TO_BLOCKS[group] ?? BLOCKS_X400
}
