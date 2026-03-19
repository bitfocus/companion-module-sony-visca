// Per-model-group inquiry block support.
// Not all cameras support all blocks — enlargement blocks (03-05)
// are only confirmed on newer models.
export const INQUIRY_PROFILES = {
	'1a': ['097e7e00', '097e7e01', '097e7e02', '097e7e03', '097e7e04', '097e7e05'],
	'1b': ['097e7e00', '097e7e01', '097e7e02', '097e7e03', '097e7e04'],
	2: ['097e7e00', '097e7e01', '097e7e02'],
	'3a': ['097e7e00', '097e7e01', '097e7e02'],
	'3b': ['097e7e00', '097e7e01', '097e7e02'],
	4: ['097e7e00', '097e7e01', '097e7e02'],
}
