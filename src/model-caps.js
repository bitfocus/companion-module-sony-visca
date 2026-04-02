// Protocol families — models sharing a protocol specification
// X400 family: BRC-X400 doc covers all, but † marks X400/X401-only commands
const FAMILY_X400_CORE = new Set(['051C', '051D']) // BRC-X400, BRC-X401
const FAMILY_X400_SRG = new Set(['061A', '061B', '0618', '0617', '061C']) // SRG-201M2, HD1M2, X120, X400, X402
const FAMILY_X400 = new Set([...FAMILY_X400_CORE, ...FAMILY_X400_SRG])
const FAMILY_X40UH = new Set(['061F', '0620', '0621', '0622']) // SRG-X40UH, SRG-H40UH, SRG-A40, SRG-A12
const FAMILY_X1000 = new Set(['0519', '051B', '051A']) // BRC-X1000, BRC-H780, BRC-H800
const FAMILY_X1000_NO_H780 = new Set(['0519', '051A']) // X1000 doc † = not available for H780
const FAMILY_FR7 = new Set(['051E', '051Ek']) // ILME-FR7, ILME-FR7K
const FAMILY_AM7 = new Set(['051F']) // BRC-AM7
const FAMILY_120DH = new Set(['0511']) // SRG-120DH
const FAMILY_300H = new Set(['0513']) // SRG-300H
const FAMILY_SE = new Set(['0516a', '0516b', '0516c']) // SRG-201SE, SRG-300SE, SRG-301SE
const FAMILY_360SHE = new Set(['0604', '0605']) // SRG-360SHE, SRG-280SHE

// --- Capability sets — used as `models` property on actions/feedbacks/variables ---

// All real camera models
export const CAP_ALL_CAMERAS = new Set([
	...FAMILY_X400,
	...FAMILY_X40UH,
	...FAMILY_X1000,
	...FAMILY_FR7,
	...FAMILY_AM7,
	...FAMILY_120DH,
	...FAMILY_300H,
	...FAMILY_SE,
	...FAMILY_360SHE,
])

// All modern protocol cameras (non-dagger X400 commands shared by X40UH + X1000)
export const CAP_ADVANCED = new Set([...FAMILY_X400, ...FAMILY_X40UH, ...FAMILY_X1000])

// Modern + legacy (basic advanced commands that legacy cameras also support per their protocol docs)
export const CAP_ADVANCED_LEGACY = new Set([
	...FAMILY_X400,
	...FAMILY_X40UH,
	...FAMILY_X1000,
	...FAMILY_120DH,
	...FAMILY_300H,
	...FAMILY_SE,
	...FAMILY_360SHE,
])

// X400 full family + X40UH (non-dagger X400 commands also in X40UH, absent from X1000)
export const CAP_X400_X40UH = new Set([...FAMILY_X400, ...FAMILY_X40UH])

// X400 full family + X40UH + SE + 360SHE (auto ICR, image stabilizer)
export const CAP_X400_X40UH_SE = new Set([
	...FAMILY_X400,
	...FAMILY_X40UH,
	...FAMILY_SE,
	...FAMILY_360SHE,
	...FAMILY_300H,
])

// X400/X401 + X1000 (X400 dagger commands also present in X1000 protocol)
export const CAP_X400_X1000 = new Set([...FAMILY_X400_CORE, ...FAMILY_X1000])

// X400/X401 + X1000 without H780 (both families have dagger restrictions)
export const CAP_X400_X1000_NO_H780 = new Set([...FAMILY_X400_CORE, ...FAMILY_X1000_NO_H780])

// X400/X401 + X40UH (X400 dagger commands also present in X40UH protocol)
export const CAP_X400_CORE_X40UH = new Set([...FAMILY_X400_CORE, ...FAMILY_X40UH])

// BRC-X400/X401 only
export const CAP_X400_ONLY = new Set([...FAMILY_X400_CORE])

// Tele Convert: X400/X401 + SRG-X402 (*3 footnote) + X1000 family
export const CAP_TELECONVERT = new Set([...FAMILY_X400_CORE, '061C', ...FAMILY_X1000, '051F'])

// ICR: X400 all + X40UH + X1000(no H780) + SE + 360SHE (per protocol docs)
export const CAP_ICR = new Set([
	...FAMILY_X400,
	...FAMILY_X40UH,
	...FAMILY_X1000_NO_H780,
	...FAMILY_SE,
	...FAMILY_360SHE,
	...FAMILY_300H,
])

// X1000 family only
export const CAP_X1000 = new Set([...FAMILY_X1000])

// X1000 + FR7
export const CAP_X1000_FR7 = new Set([...FAMILY_X1000, ...FAMILY_FR7])

// FR7 only
export const CAP_FR7 = new Set([...FAMILY_FR7])

// FR7 + AM7 shared features (ND, audio, recording, tally green, push AF/MF, direct controls, etc.)
export const CAP_FR7_AM7 = new Set([...FAMILY_FR7, ...FAMILY_AM7])

// Wide Dynamic Range: X1000 + legacy cameras (120DH, SE, 360SHE)
export const CAP_WIDE_DYNAMIC = new Set([
	...FAMILY_X1000,
	...FAMILY_120DH,
	...FAMILY_300H,
	...FAMILY_SE,
	...FAMILY_360SHE,
])

// Brightness position: only legacy cameras have BRIGHTNESS choices
export const CAP_BRIGHTNESS = new Set([...FAMILY_120DH, ...FAMILY_300H, ...FAMILY_SE, ...FAMILY_360SHE])

// Tally on/off: X400/X401 + X1000 + 360SHE + FR7 (red: 7E 01 0A, green FR7 only: 7E 04 1A)
export const CAP_TALLY = new Set([...FAMILY_X400_CORE, ...FAMILY_X1000, ...FAMILY_360SHE, ...FAMILY_FR7, ...FAMILY_AM7])

// Ramp Curve: X400 + X40UH + X1000 + FR7 + AM7 (06 31)
export const CAP_RAMP_CURVE = new Set([...FAMILY_X400, ...FAMILY_X40UH, ...FAMILY_X1000, ...FAMILY_FR7, ...FAMILY_AM7])

// PTZ Auto Framing: FR7 + SRG-A40/A12 (7E 04 3A)
export const CAP_AUTO_FRAMING = new Set([...FAMILY_FR7, ...FAMILY_AM7, '0621', '0622'])

/**
 * Filter definitions by model ID.
 * - Definitions without a `models` property are universal (always included).
 * - `other_all` gets everything.
 * - `other_min` only gets universal definitions.
 * - Real model IDs get universal + definitions whose `models` Set contains that ID.
 */
export function filterByModel(definitions, modelId) {
	if (modelId === 'other_all') return definitions
	const filtered = {}
	for (const [key, def] of Object.entries(definitions)) {
		if (!def.models || (modelId !== 'other_min' && def.models.has(modelId))) {
			filtered[key] = def
		}
	}
	return filtered
}
