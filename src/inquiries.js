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
	0x00: 'auto',
	0x03: 'manual',
	0x0a: 'shutter pri',
	0x0b: 'iris pri',
	0x0d: 'bright',
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

export const INQUIRY_BLOCKS = {
	'097e7e00': {
		name: 'Lens Control',
		minLength: 16,
		fields: [
			{ variable: 'zoomPosition', type: 'nibbleConcat', bytes: [2, 3, 4, 5] },
			{ variable: 'focusNearLimit', type: 'nibbleConcat', bytes: [6, 7] },
			{ variable: 'focusPosition', type: 'nibbleConcat', bytes: [8, 9, 10, 11] },
			{ variable: 'focusMode', type: 'flag', byte: 13, bit: 0, on: 'auto', off: 'manual' },
			{
				variable: 'zoomMode',
				type: 'mapped',
				extract: (r) => ((r[13] >> 5) & 0x02) | ((r[13] >> 1) & 0x01),
				map: { 0: 'optical', 1: 'digital', 2: 'clr img' },
			},
			{
				variable: 'afMode',
				type: 'mapped',
				extract: (r) => (r[13] >> 3) & 0x03,
				map: { 0: 'Normal', 1: 'Interval', 2: 'Zoom Trigger' },
			},
			{ variable: 'afSensitivity', type: 'flag', byte: 13, bit: 2, on: 'Normal', off: 'Low' },
			{ variable: 'presetRecallExecuting', type: 'flag', byte: 14, bit: 2, on: 'yes', off: 'no' },
			{ variable: 'focusCmdExecuting', type: 'flag', byte: 14, bit: 1, on: 'yes', off: 'no' },
			{ variable: 'zoomCmdExecuting', type: 'flag', byte: 14, bit: 0, on: 'yes', off: 'no' },
		],
	},

	'097e7e01': {
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
			{ variable: 'highResolution', type: 'flag', byte: 9, bit: 5, on: 'on', off: 'off' },
			{ variable: 've', type: 'flag', byte: 9, bit: 4, on: 'on', off: 'off' },
			{ variable: 'backlightComp', type: 'flag', byte: 9, bit: 2, on: 'on', off: 'off' },
			{ variable: 'expCompOnOff', type: 'flag', byte: 9, bit: 1, on: 'on', off: 'off' },
			{ variable: 'slowShutter', type: 'flag', byte: 9, bit: 0, on: 'auto', off: 'manual' },
			{ variable: 'shutterSpeed', type: 'choiceLookup', byte: 10, mask: 0xff, choiceKey: 'SHUTTER' },
			{ variable: 'irisLevel', type: 'choiceLookup', byte: 11, mask: 0xff, choiceKey: 'IRIS' },
			{ variable: 'gainLevel', type: 'choiceLookup', byte: 12, mask: 0xff, choiceKey: 'GAIN' },
			{ variable: 'expCompLevel', type: 'offset', byte: 14, mask: 0x0f, center: 7 },
		],
	},

	'097e7e02': {
		name: 'Other',
		minLength: 16,
		fields: [
			{ variable: 'spotlightComp', type: 'flag', byte: 2, bit: 5, on: 'on', off: 'off' },
			{ variable: 'flickerCancel', type: 'flag', byte: 2, bit: 4, on: 'on', off: 'off' },
			{ variable: 'IRCutFilterAuto', type: 'flag', byte: 2, bit: 2, on: 'auto', off: 'manual' },
			{ variable: 'power', type: 'flag', byte: 2, bit: 0, on: 'on', off: 'off' },
			{ variable: 'imageStabilizer', type: 'flag', byte: 3, bit: 6, on: 'on', off: 'off' },
			{ variable: 'IRCutFilter', type: 'flag', byte: 3, bit: 4, on: 'on', off: 'off' },
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
			{ variable: 'kneeSetting', type: 'flag', byte: 14, bit: 4, on: 'on', off: 'off' },
			{ variable: 'kneePoint', type: 'bits', byte: 14, shift: 0, mask: 0x0f },
		],
	},

	'097e7e03': {
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
			{ variable: 'imageFlip', type: 'flag', byte: 10, bit: 0, on: 'on', off: 'off' },
			{ variable: 'colorGain', type: 'bits', byte: 11, shift: 3, mask: 0x0f },
			{ variable: 'aeSpeed', type: 'bits', byte: 12, shift: 0, mask: 0x3f },
			{ variable: 'highSensitivity', type: 'flag', byte: 13, bit: 3, on: 'on', off: 'off' },
			{ variable: 'nrLevel', type: 'bits', byte: 13, shift: 0, mask: 0x07 },
			{ variable: 'chromaSuppress', type: 'bits', byte: 14, shift: 4, mask: 0x07 },
			{ variable: 'gainLimit', type: 'choiceLookup', byte: 14, mask: 0x0f, choiceKey: 'GAIN' },
		],
	},

	'097e7e04': {
		name: 'Enlargement 2',
		minLength: 16,
		fields: [
			{
				variable: 'blackLevel',
				type: 'custom',
				extract: (r) => (r[3] << 4) | ((r[4] >> 3) & 0x0f),
			},
			{ variable: 'veLevel', type: 'offset', byte: 4, mask: 0x07, center: 3 },
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
					const magnitude = ((r[7] & 0x0f) << 4) | ((r[8] >> 4) & 0x0f)
					return sign ? -magnitude : magnitude
				},
			},
			{ variable: 'minShutterSpeed', type: 'choiceLookup', byte: 9, mask: 0xff, choiceKey: 'SHUTTER' },
			{ variable: 'maxShutterSpeed', type: 'choiceLookup', byte: 10, mask: 0xff, choiceKey: 'SHUTTER' },
			{
				variable: 'detailHVBalance',
				type: 'custom',
				extract: (r) => ((r[11] >> 3) & 0x07) - 2,
			},
			{ variable: 'detailCrispening', type: 'bits', byte: 11, shift: 0, mask: 0x07 },
			{ variable: 'detailLimit', type: 'bits', byte: 12, shift: 3, mask: 0x0f },
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
	},

	'097e7e05': {
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
	},
}
