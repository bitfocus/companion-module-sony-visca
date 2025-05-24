import * as fs from 'fs'
import * as actions from '../src/actions.js'
import * as presets from '../src/presets.js'
import * as variables from '../src/variables.js'

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
	'- Type in the port of the device (default is 52381)\n' +
	'- You can also specify the Camera ID  \n' +
	'(In most cases **id 1** is the best choice)' +
	'\n' +
	'## Enabling VISCA over IP on your camera\n' +
	'\n' +
	'Several Sony PTZ camera models do not enable VISCA over IP by default. On some models you can enable it using the on screen menu.\n' +
	'\n' +
	'Most models have dip switches on the back of the cameras with descriptions of their functions on the bottom of the camera. In many cases, such as the "IMLE-FR7" setting switch three to the on position and re-powering the camera enables VISCA over IP.\n' +
	'\n' +
	'Please refer to the manual for your camera for specific instructions.\n'

if (actions.getActionsMarkdown()) {
	markdown += '\n' + actions.getActionsMarkdown()
}
if (presets.getPresetsMarkdown()) {
	markdown += '\n' + presets.getPresetsMarkdown()
}
if (variables.getVariablesMarkdown()) {
	markdown += '\n' + variables.getVariablesMarkdown()
}

fs.writeFileSync('companion/HELP.md', markdown)
