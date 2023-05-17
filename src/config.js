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
			label: 'Target IP',
			width: 4,
			regex: Regex.IP,
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
			width: 2,
			default: '128',
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
	]
}
