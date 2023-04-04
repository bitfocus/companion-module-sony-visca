import * as fs from 'fs'
import * as actions from '../src/actions.js'
import * as presets from '../src/presets.js'

// This script is run by 'yarn docs' to generate the 'companion/HELP.md' file based on the definitions in the module.

let markdown =
	'# Sony VISCA\n' +
	'\n' +
	'This module uses the Sony VISCA protocol to control PTZ cameras.\n' +
	'\n' +
	'**Please Note**: Not all Sony PTZ cameras support all VISCA commands. Please check the official "Technical Manual" of your exact model to see what commands it supports, in case one of the commands in this module is not working for you.\n' +
	'\n' +
	'## Configuration\n' +
	'\n' +
	'- Type in the IP address of the device.\n' +
	'- Type in the port of the device (default is 52381).\n' +
	'- You can also specify the Camera ID.\n'

if (actions.getActionsMarkdown()) {
	markdown += '\n' + actions.getActionsMarkdown()
}
if (presets.getPresetsMarkdown()) {
	markdown += '\n' + presets.getPresetsMarkdown()
}

fs.writeFileSync('companion/HELP.md', markdown)
