const { combineRgb } = require('@companion-module/base')
module.exports = {
	BLACK: combineRgb(0, 0, 0),
	WHITE: combineRgb(255, 255, 255),
	RED: combineRgb(255, 0, 0),
	GREEN: combineRgb(0, 255, 0),
	BLUE: combineRgb(0, 0, 255),
	YELLOW: combineRgb(255, 255, 0),
	CYAN: combineRgb(0, 255, 255),
	MAGENTA: combineRgb(255, 0, 255),
	PALE_RED: combineRgb(255, 128, 128),
	PALE_GREEN: combineRgb(128, 255, 128),
	PALE_BLUE: combineRgb(128, 128, 255),
}
