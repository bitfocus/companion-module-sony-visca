import { Regex } from '@companion-module/base'
import { MODELS } from './models.js'

export function getConfigDefinitions(CHOICES) {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls PTZ cameras with VISCA over IP protocol',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP or Hostname',
			width: 3,
			regex: Regex.HOSTNAME,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port (default: 52381)',
			width: 4,
			regex: Regex.PORT,
			default: '52381',
		},
		{
			type: 'dropdown',
			id: 'id',
			label: 'Camera Id',
			width: 3,
			default: '129',
			choices: CHOICES.CAMERA_ID,
		},
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Camera Information',
			value: 'The Camera Model and Frame Rate are used to determine specific exposure settings.',
		},
		{
			type: 'dropdown',
			id: 'model',
			label: 'Select Your Camera Model',
			width: 4,
			default: MODELS[0].id,
			choices: MODELS,
		},
		{
			type: 'dropdown',
			id: 'frameRate',
			label: 'Select Your Frame Rate',
			width: 4,
			default: '60',
			choices: [
				{ id: '60', label: '59.94 or 29.97 (60 Hz)' },
				{ id: '50', label: '50 or 25 fps (50 Hz)' },
				{ id: '24', label: '23.98 fps' },
			],
		},
		{
			type: 'static-text',
			id: 'presetColorInfo',
			width: 12,
			label: 'Color for Presets',
			value: 'Default color for new camera presets',
		},
		{
			type: 'colorpicker',
			id: 'presetColorText',
			label: 'Text',
			default: '#FFFFFF',
			width: 2,
		},
		{
			type: 'colorpicker',
			id: 'presetColorBG',
			label: 'Background',
			default: '#36454F',
			width: 3,
		},
		{
			type: 'colorpicker',
			id: 'presetSelectedText',
			label: 'Selected Text',
			default: '#FFFFFF',
			width: 2,
		},
		{
			type: 'colorpicker',
			id: 'presetSelectedBG',
			label: 'Selected Background',
			default: '#777788',
			width: 2,
		},
	]
}
