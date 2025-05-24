import { combineRgb } from '@companion-module/base'

export const COLORS = {
	BLACK: combineRgb(0, 0, 0),
	DARKER_GRAY: combineRgb(48, 48, 48),
	DARK_GRAY: combineRgb(72, 72, 72),
	GRAY: combineRgb(128, 128, 128),
	WHITE: combineRgb(255, 255, 255),

	RED: combineRgb(255, 0, 0),
	DARK_RED: combineRgb(102, 0, 0),
	MEDIUM_RED: combineRgb(153, 0, 0),
	PALE_RED: combineRgb(255, 128, 128),

	ORANGE: combineRgb(255, 128, 0),
	PALE_ORANGE: combineRgb(255, 191, 128),

	YELLOW: combineRgb(255, 255, 0),
	DARK_YELLOW: combineRgb(102, 102, 0),
	PALE_YELLOW: combineRgb(255, 255, 128),

	GREEN: combineRgb(0, 255, 0),
	DARK_GREEN: combineRgb(0, 51, 0),
	MEDIUM_GREEN: combineRgb(0, 102, 0),
	PALE_GREEN: combineRgb(128, 255, 128),

	BLUE: combineRgb(0, 0, 255),
	DARK_BLUE: combineRgb(0, 0, 102),
	CHARCOAL: combineRgb(54, 69, 79),
	MEDIUM_BLUE: combineRgb(0, 0, 153),
	SLATE: combineRgb(112, 128, 144),
	PALE_BLUE: combineRgb(128, 128, 255),

	CYAN: combineRgb(0, 255, 255),

	MAGENTA: combineRgb(255, 0, 255),
	PALE_MAGENTA: combineRgb(255, 128, 255),
}
