var instance_skel = require('../../instance_skel');
var udp           = require('../../udp');
var debug;
var log;

var IRIS = [
	{ id: '15', label: 'F2.8 OPEN' },
	{ id: '14', label: 'F3.1' },
	{ id: '13', label: 'F3.4' },
	{ id: '12', label: 'F3.7' },
	{ id: '11', label: 'F4.0' },
	{ id: '10', label: 'F4.4' },
	{ id: '0F', label: 'F4.8' },
	{ id: '0E', label: 'F5.2' },
	{ id: '0D', label: 'F5.6' },
	{ id: '0C', label: 'F6.2' },
	{ id: '0B', label: 'F6.8' },
	{ id: '0A', label: 'F7.3' },
	{ id: '09', label: 'F8.0' },
	{ id: '08', label: 'F8.7' },
	{ id: '07', label: 'F9.6' },
	{ id: '06', label: 'F10' },
	{ id: '05', label: 'F11' }
];

var GAIN = [
	{ id: '0C', label: '33 dB' },
	{ id: '0B', label: '30 dB' },
	{ id: '0A', label: '27 dB' },
	{ id: '09', label: '24 dB' },
	{ id: '08', label: '21 dB' },
	{ id: '07', label: '18 dB' },
	{ id: '06', label: '15 dB' },
	{ id: '05', label: '12 dB' },
	{ id: '04', label: '9 dB' },
	{ id: '03', label: '6 dB' },
	{ id: '02', label: '3 dB' },
	{ id: '01', label: '0 dB' },
	{ id: '00', label: '-3 dB' }
];

var SHUTTER = [
	{ id: '15', label: '1/10000 | 1/10000' },
	{ id: '14', label: '1/6000 | 1/6000' },
	{ id: '13', label: '1/4000 | 1/3500' },
	{ id: '12', label: '1/3000 | 1/2500' },
	{ id: '11', label: '1/2000 | 1/1750' },
	{ id: '10', label: '1/1500 | 1/1250' },
	{ id: '0F', label: '1/1000 | 1/1000' },
	{ id: '0E', label: '1/725 | 1/600' },
	{ id: '0D', label: '1/500 | 1/425' },
	{ id: '0C', label: '1/350 | 1/300' },
	{ id: '0B', label: '1/250 | 1/215' },
	{ id: '0A', label: '1/180 | 1/150' },
	{ id: '09', label: '1/125 | 1/120' },
	{ id: '08', label: '1/100 | 1/100' },
	{ id: '07', label: '1/90 | 1/75' },
	{ id: '06', label: '1/60 | 1/50' },
	{ id: '05', label: '1/30 | 1/25' },
	{ id: '04', label: '1/15 | 1/12' },
	{ id: '03', label: '1/8 | 1/6' }
];

var PRESET = [
	{ id: '0F', label: 'Preset 16' },
	{ id: '0E', label: 'Preset 15' },
	{ id: '0D', label: 'Preset 14' },
	{ id: '0C', label: 'Preset 13' },
	{ id: '0B', label: 'Preset 12' },
	{ id: '0A', label: 'Preset 11' },
	{ id: '09', label: 'Preset 10' },
	{ id: '08', label: 'Preset 9' },
	{ id: '07', label: 'Preset 8' },
	{ id: '06', label: 'Preset 7' },
	{ id: '05', label: 'Preset 6' },
	{ id: '04', label: 'Preset 5' },
	{ id: '03', label: 'Preset 4' },
	{ id: '02', label: 'Preset 3' },
	{ id: '01', label: 'Preset 2' },
	{ id: '00', label: 'Preset 1' }
];

	var SPEED = [
		{ id: '18', label: 'Speed 24 (Fast)' },
		{ id: '17', label: 'Speed 23' },
		{ id: '16', label: 'Speed 22' },
		{ id: '15', label: 'Speed 21' },
		{ id: '14', label: 'Speed 20' },
		{ id: '13', label: 'Speed 19' },
		{ id: '12', label: 'Speed 18' },
		{ id: '11', label: 'Speed 17' },
		{ id: '10', label: 'Speed 16' },
		{ id: '0F', label: 'Speed 15' },
		{ id: '0E', label: 'Speed 14' },
		{ id: '0D', label: 'Speed 13' },
		{ id: '0C', label: 'Speed 12' },
		{ id: '0B', label: 'Speed 11' },
		{ id: '0A', label: 'Speed 10' },
		{ id: '09', label: 'Speed 09' },
		{ id: '08', label: 'Speed 08' },
		{ id: '07', label: 'Speed 07' },
		{ id: '06', label: 'Speed 06' },
		{ id: '05', label: 'Speed 05' },
		{ id: '04', label: 'Speed 04' },
		{ id: '03', label: 'Speed 03' },
		{ id: '02', label: 'Speed 02' },
		{ id: '01', label: 'Speed 01 (Slow)' }
	];

	var CAMERAID = [
		{ id: '128', label: 'id 0'},
		{ id: '129', label: 'id 1'},
		{ id: '130', label: 'id 2'},
		{ id: '131', label: 'id 3'},
		{ id: '132', label: 'id 4'},
		{ id: '133', label: 'id 5'},
		{ id: '134', label: 'id 6'},
		{ id: '135', label: 'id 7'},
		{ id: '136', label: 'id 8'}
	];

instance.prototype.sendVISCACommand = function(payload) {
	var self = this;
	var buf = new Buffer(32);

		// 0x01 0x00 = VISCA Command
		buf[0] = 0x01;
		buf[1] = 0x00;

		self.packet_counter = (self.packet_counter + 1) % 0xFFFFFFFF;

		buf.writeUInt16BE(payload.length, 2);
		buf.writeUInt32BE(self.packet_counter, 4);

		if (typeof payload == 'string') {
				buf.write(payload, 8, 'binary');
		} else if (typeof payload == 'object' && payload instanceof Buffer) {
				payload.copy(buf, 8);
		}

		var newbuf = buf.slice(0, 8 + payload.length);

		// udp.send(newbuf);

		debug('sending',newbuf,"to",self.udp.host);
		self.udp.send(newbuf);

};


 instance.prototype.sendControlCommand = function(payload) {
	var self = this;
	var buf = new Buffer(32);

	// 0x01 0x00 = VISCA Command
	buf[0] = 0x02;
	buf[1] = 0x00;

	self.packet_counter = (self.packet_counter + 1) % 0xFFFFFFFF;

	buf.writeUInt16BE(payload.length, 2);
	buf.writeUInt32BE(self.packet_counter, 4);

	if (typeof payload == 'string') {
			buf.write(payload, 8, 'binary');
	} else if (typeof payload == 'object' && payload instanceof Buffer) {
			payload.copy(buf, 8);
	}

	var newbuf = buf.slice(0, 8 + payload.length);

	// udp.send(newbuf);

	debug('sending',newbuf,"to",self.udp.host);
	self.udp.send(newbuf);

};

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	return self;
}



instance.prototype.init_udp = function() {
	var self = this;

	if (self.udp !== undefined) {
		self.udp.destroy();
		delete self.udp;
	}

	if (self.config.host !== undefined) {
		self.udp = new udp(self.config.host, self.config.port);

		// Reset sequence number
		self.sendControlCommand('\x01');
		self.packet_counter = 0;

		self.udp.on('status_change', function (status, message) {
			self.status(status, message);
		});
		self.udp.on('data', function (data) {
			console.log("Data from SONY VISCA: ", data);
		});
	debug(self.udp.host,':',self.config.port);
	}
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;
	self.ptSpeed = '0C';
	self.ptSpeedIndex = 12;

	self.status(self.STATUS_UNKNOWN);
	self.init_udp();
	self.actions(); // export actions
	self.init_presets();
};

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;
	self.init_presets();

	if (self.udp !== undefined) {
		self.udp.destroy();
		delete self.udp;
	}

	self.status(self.STATUS_UNKNOWN);

	if (self.config.host !== undefined) {
		self.udp = new udp(self.config.host, self.config.port);

		self.udp.on('status_change', function (status, message) {
			self.status(status, message);
		});
	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls PTZ cameras with VISCA over IP protocol'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target PORT',
			width: 6,
			regex: self.REGEX_PORT,
			default: '52381'
		},
		{
			type: 'dropdown',
			id: 'id',
			label: 'camera id',
			width: 6,
			default: '128',
			choices: CAMERAID
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.udp !== undefined) {
		self.udp.destroy();
	}
	debug("destroy", self.id);
};

instance.prototype.init_presets = function () {
	var self = this;
	var presets = [
		{
			category: 'Pan/Tilt',
			label: 'UP',
			bank: {
				style: 'png',
				text: '',
				png64: image_up,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,255)
			},
			actions: [
				{
					action: 'up',
				}
			],
			release_actions: [
				{
					action: 'stop',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'DOWN',
			bank: {
				style: 'png',
				text: '',
				png64: image_down,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'down',
				}
			],
			release_actions: [
				{
					action: 'stop',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'LEFT',
			bank: {
				style: 'png',
				text: '',
				png64: image_left,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'left',
				}
			],
			release_actions: [
				{
					action: 'stop',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'RIGHT',
			bank: {
				style: 'png',
				text: '',
				png64: image_right,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'right',
				}
			],
			release_actions: [
				{
					action: 'stop',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'UP RIGHT',
			bank: {
				style: 'png',
				text: '',
				png64: image_up_right,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'upRight',
				}
			],
			release_actions: [
				{
					action: 'stop',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'UP LEFT',
			bank: {
				style: 'png',
				text: '',
				png64: image_up_left,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'upLeft',
				}
			],
			release_actions: [
				{
					action: 'stop',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'DOWN LEFT',
			bank: {
				style: 'png',
				text: '',
				png64: image_down_left,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'downLeft',
				}
			],
			release_actions: [
				{
					action: 'stop',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'DOWN RIGHT',
			bank: {
				style: 'png',
				text: '',
				png64: image_down_right,
				pngalignment: 'center:center',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'downRight',
				}
			],
			release_actions: [
				{
					action: 'stop',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'Home',
			bank: {
				style: 'text',
				text: 'HOME',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'home',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'Speed Up',
			bank: {
				style: 'text',
				text: 'SPEED\\nUP',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'ptSpeedU',
				}
			]
		},
		{
			category: 'Pan/Tilt',
			label: 'Speed Down',
			bank: {
				style: 'text',
				text: 'SPEED\\nDOWN',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'ptSpeedD',
				}
			]
		},
		{
			category: 'Lens',
			label: 'Zoom In',
			bank: {
				style: 'text',
				text: 'ZOOM\\nIN',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'zoomI',
				}
			],
			release_actions: [
				{
					action: 'zoomS',
				}
			]
		},
		{
			category: 'Lens',
			label: 'Zoom Out',
			bank: {
				style: 'text',
				text: 'ZOOM\\nOUT',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0)
			},
			actions: [
				{
					action: 'zoomO',
				}
			],
			release_actions: [
				{
					action: 'zoomS',
				}
			]
		},
		{
			category: 'Lens',
			label: 'CI Zoom',
			bank: {
				style: 'text',
				text: 'CI\\nZOOM',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
				latch: true
			},
			actions: [
				{
					action: 'ciZoom',
					options: {
						bol: 1,
					}
				}
			],
			release_actions: [
				{
					action: 'ciZoom',
					options: {
						bol: 0,
					}
				}
			]
		},
		{
			category: 'Lens',
			label: 'Focus Near',
			bank: {
				style: 'text',
				text: 'FOCUS\\nNEAR',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
			},
			actions: [
				{
					action: 'focusN',
				}
			],
			release_actions: [
				{
					action: 'focusS',
				}
			]
		},
		{
			category: 'Lens',
			label: 'Focus Far',
			bank: {
				style: 'text',
				text: 'FOCUS\\nFAR',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
			},
			actions: [
				{
					action: 'focusF',
				}
			],
			release_actions: [
				{
					action: 'focusS',
				}
			]
		},
		{
			category: 'Lens',
			label: 'Auto Focus',
			bank: {
				style: 'text',
				text: 'AUTO\\nFOCUS',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
				latch: true
			},
			actions: [
				{
					action: 'focusM',
					options: {
						bol: 0,
					}
				}
			],
			release_actions: [
				{
					action: 'focusM',
					options: {
						bol: 1,
					}
				}
			]
		},
		{
			category: 'Lens',
			label: 'One Push Auto Focus',
			bank: {
				style: 'text',
				text: 'O.P.\\nAF',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
			},
			actions: [
				{
					action: 'focusOpaf',
				}
			]
		},
		{
			category: 'Exposure',
			label: 'Exposure Mode',
			bank: {
				style: 'text',
				text: 'EXP\\nMODE',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
				latch: true
			},
			actions: [
				{
					action: 'expM',
					options: {
						bol: 0,
					}
				}
			],
			release_actions: [
				{
					action: 'expM',
					options: {
						bol: 1,
					}
				}
			]
		},
		{
			category: 'Exposure',
			label: 'Gain Up',
			bank: {
				style: 'text',
				text: 'GAIN\\nUP',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
			},
			actions: [
				{
					action: 'gainU',
				}
			]
		},
		{
			category: 'Exposure',
			label: 'Gain Down',
			bank: {
				style: 'text',
				text: 'GAIN\\nDOWN',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
			},
			actions: [
				{
					action: 'gainD',
				}
			]
		},
		{
			category: 'Exposure',
			label: 'Iris Up',
			bank: {
				style: 'text',
				text: 'IRIS\\nUP',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
			},
			actions: [
				{
					action: 'irisU',
				}
			]
		},
		{
			category: 'Exposure',
			label: 'Iris Down',
			bank: {
				style: 'text',
				text: 'IRIS\\nDOWN',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
			},
			actions: [
				{
					action: 'irisD',
				}
			]
		},
		{
			category: 'Exposure',
			label: 'Shutter Up',
			bank: {
				style: 'text',
				text: 'Shut\\nUP',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
			},
			actions: [
				{
					action: 'shutU',
				}
			]
		},
		{
			category: 'Exposure',
			label: 'Shutter Down',
			bank: {
				style: 'text',
				text: 'Shut\\nDOWN',
				size: '18',
				color: '16777215',
				bgcolor: self.rgb(0,0,0),
			},
			actions: [
				{
					action: 'shutD',
				}
			]
		}
	];

var save;
for (save = 0; save < 16; save++) {
	presets.push({
		category: 'Save Preset',
		label: 'Save Preset '+ parseInt(save+1) ,
		bank: {
			style: 'text',
			text: 'SAVE\\nPSET\\n' + parseInt(save+1) ,
			size: '14',
			color: '16777215',
			bgcolor: self.rgb(0,0,0),
		},
		actions: [
			{
				action: 'savePset',
				options: {
				val: '0' + save.toString(16).toUpperCase(),
				}
			}
		]
	});
}

var recall;
for (recall = 0; recall < 16; recall++) {
	presets.push({
		category: 'Recall Preset',
		label: 'Recall Preset '+ parseInt(recall+1) ,
		bank: {
			style: 'text',
			text: 'Recall\\nPSET\\n' + parseInt(recall+1) ,
			size: '14',
			color: '16777215',
			bgcolor: self.rgb(0,0,0),
		},
		actions: [
			{
				action: 'recallPset',
				options: {
				val: '0' + recall.toString(16).toUpperCase(),
				}
			}
		]
	});
}

	self.setPresetDefinitions(presets);
};


instance.prototype.actions = function(system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		'left':           { label: 'Pan Left' },
		'right':          { label: 'Pan Right' },
		'up':             { label: 'Tilt Up' },
		'down':           { label: 'Tilt Down' },
		'upLeft':         { label: 'Up Left' },
		'upRight':        { label: 'Up Right' },
		'downLeft':       { label: 'Down Left' },
		'downRight':      { label: 'Down Right' },
		'stop':           { label: 'P/T Stop' },
		'home':           { label: 'P/T Home' },
		'ptSpeedS':       {
			label: 'P/T Speed',
			options: [
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: SPEED
				}
			]
		},
		'ptSpeedU':       { label: 'P/T Speed Up'},
		'ptSpeedD':       { label: 'P/T Speed Down'},
		'ptSlow':         {
			label: 'P/T Slow Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Slow Mode On/Off',
					id: 'bol',
					choices: [ { id: '1', label: 'Off' }, { id: '0', label: 'On' } ]
				}
			]
		},
		'zoomI':          { label: 'Zoom In' },
		'zoomO':          { label: 'Zoom Out' },
		'zoomS':          { label: 'Zoom Stop' },
		'ciZoom':         {
			label: 'Clear Image Zoom',
			options: [
				{
					type: 'dropdown',
					label: 'Clear Image On/Off',
					id: 'bol',
					choices: [ { id: '0', label: 'Off' }, { id: '1', label: 'On' } ]
				}
			]
		},
		'focusN':         { label: 'Focus Near' },
		'focusF':         { label: 'Focus Far' },
		'focusS':         { label: 'Focus Stop' },
		'focusM':         {
			label: 'Focus Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Auto / Manual Focus',
					id: 'bol',
					choices: [ { id: '0', label: 'Auto Focus' }, { id: '1', label: 'Manual Focus' } ]
				}
			]
		},
		'focusOpaf':      { label: 'One Push Auto Focus' },
		'expM':           {
			label: 'Exposure Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode setting',
					id: 'val',
					choices: [
						{ id: '0', label: 'Full auto' },
						{ id: '1', label: 'Manual' },
						{ id: '2', label: 'Shutter Pri' },
						{ id: '3', label: 'Iris Pri' },
						{ id: '4', label: 'Gain Pri' }
					]
				}
			]
		},
		'gainU':          { label: 'Gain Up' },
		'gainD':          { label: 'Gain Down' },
		'gainS':          {
			label: 'Set Gain',
			options: [
				{
					type: 'dropdown',
					label: 'Gain setting',
					id: 'val',
					choices: GAIN
				}
			]
		},
		'irisU':          { label: 'Iris Up' },
		'irisD':          { label: 'Iris Down' },
		'irisS':          {
			label: 'Set Iris',
			options: [
				{
					type: 'dropdown',
					label: 'Iris setting',
					id: 'val',
					choices: IRIS
				}
			]
		},
		'shutU':          { label: 'Shutter Up' },
		'shutD':          { label: 'Shutter Down' },
		'shutS':          {
			label: 'Set Shutter',
			options: [
				{
					type: 'dropdown',
					label: 'Shutter setting',
					id: 'val',
					choices: SHUTTER
				}
			]
		},
		'savePset':       {
			label: 'Save Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: PRESET
				}
			]
		},
		'recallPset':     {
			label: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: PRESET
				}
			]
		},
		'speedPset':      {
			label: 'Preset Drive Speed',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: 'val',
					choices: PRESET
				},
				{
					type: 'dropdown',
					label: 'speed setting',
					id: 'speed',
					choices: SPEED
				}
			]
		},
		'tally':          {
			label: 'Tally on/off',
			options: [
				{
					type: 'dropdown',
					label: 'On / Off',
					id: 'bol',
					choices: [ { id: '0', label: 'Off' }, { id: '1', label: 'On' } ]
				}
			]
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var opt = action.options;
	var cmd = ''



	switch (action.action) {

		case 'left':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x01\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'right':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x02\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'up':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x03\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'down':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x03\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'upLeft':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x01\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'upRight':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x02\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'downLeft':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x01\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'downRight':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x02\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'stop':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x03\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'home':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x04\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'ptSlow':
			if (opt.bol == '0') {
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x44\x02\xFF';
			}
			if (opt.bol == '1') {
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x06\x44\x03\xFF';
			}
			self.sendVISCACommand(cmd);
			break;

		case 'ptSpeedS':
			self.ptSpeed = opt.speed;

			var idx = -1;
			for (var i = 0; i < SPEED.length; ++i) {
				if (SPEED[i].id == self.ptSpeed) {
					idx = i;
					break;
				}
			}
			if (idx > -1) {
				self.ptSpeedIndex = idx;
			}
			debug(self.ptSpeed + ' == ' + self.ptSpeedIndex)
			break;

		case 'ptSpeedD':
			if (self.ptSpeedIndex == 23) {
				self.ptSpeedIndex = 23;
			}
			else if (self.ptSpeedIndex < 23) {
				self.ptSpeedIndex ++;
			}
			self.ptSpeed = SPEED[self.ptSpeedIndex].id
			break;

		case 'ptSpeedU':
			if (self.ptSpeedIndex == 0) {
				self.ptSpeedIndex = 0;
			}
			else if (self.ptSpeedIndex > 0) {
				self.ptSpeedIndex--;
			}
			self.ptSpeed = SPEED[self.ptSpeedIndex].id
			break;


		case 'zoomI':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x07\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'zoomO':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x07\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'zoomS':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x07\x00\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'ciZoom':
			if (opt.bol == 0){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x06\x03\xFF';
			}
			if (opt.bol == 1){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x06\x04\xFF';
			}
			self.sendVISCACommand(cmd);
			break;

		case 'focusN':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x08\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'focusF':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x08\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'focusS':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x38\x00\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'focusM':
			if (opt.bol == 0){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x38\x02\xFF';
			}
			if (opt.bol == 1){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x38\x03\xFF';
			}
			self.sendVISCACommand(cmd);
			break;

		case 'focusOpaf':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x18\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'expM':
			if (opt.val == 0){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x39\x00\xFF';
			}
			if (opt.val == 1){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x39\x03\xFF';
			}
			if (opt.val == 2){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x39\x0A\xFF';
			}
			if (opt.val == 3){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x39\x0B\xFF';
			}
			if (opt.val == 4){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x39\x0E\xFF';
			}
			self.sendVISCACommand(cmd);
			break;


		case 'gainU':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x0C\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'gainD':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x0C\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'gainS':
			cmd = Buffer.from(String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x4C\x00\x00\x00\x00\xFF', 'binary');
			cmd.writeUInt8((parseInt(opt.val,16) & 0xF0) >> 4, 6);
			cmd.writeUInt8(parseInt(opt.val,16) & 0x0F, 7);
			self.sendVISCACommand(cmd);
			debug('cmd=',cmd);
			break;

		case 'irisU':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x0B\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'irisD':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x0B\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'irisS':
			cmd = Buffer.from(String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x4B\x00\x00\x00\x00\xFF', 'binary');
			cmd.writeUInt8((parseInt(opt.val,16) & 0xF0) >> 4, 6);
			cmd.writeUInt8(parseInt(opt.val,16) & 0x0F, 7);
			self.sendVISCACommand(cmd);
			debug('cmd=',cmd);
			break;

		case 'shutU':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x0A\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'shutD':
			cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x0A\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'shutS':
			cmd = Buffer.from(String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x4A\x00\x00\x00\x00\xFF', 'binary');
			cmd.writeUInt8((parseInt(opt.val,16) & 0xF0) >> 4, 6);
			cmd.writeUInt8(parseInt(opt.val,16) & 0x0F, 7);
			self.sendVISCACommand(cmd);
			debug('cmd=',cmd);
			break;

		case 'savePset':
			cmd =String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x3F\x01' + String.fromCharCode(parseInt(opt.val,16) & 0xFF) + '\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'recallPset':
			cmd =String.fromCharCode(parseInt(self.config.id)) +'\x01\x04\x3F\x02' + String.fromCharCode(parseInt(opt.val,16) & 0xFF) + '\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'speedPset':
			cmd =String.fromCharCode(parseInt(self.config.id)) +'\x01\x7E\x01\x0B' + String.fromCharCode(parseInt(opt.val,16) & 0xFF) + String.fromCharCode(parseInt(opt.speed,16) & 0xFF) + '\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'tally':
			if (opt.bol == 0){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x7E\x01\x0A\x00\x03\xFF';
			}
			if (opt.bol == 1){
				cmd = String.fromCharCode(parseInt(self.config.id)) +'\x01\x7E\x01\x0A\x00\x02\xFF';
			}
			self.sendVISCACommand(cmd);
			break;
	}
};


instance_skel.extendedBy(instance);

 // Variables for Base64 image data do not edit
var image_up = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIFJREFUKM+90EEKgzAQRmFDFy49ghcp5FquVPBighcRegHBjWDJ68D8U6F7m00+EnhkUlW3ru6rdyCV0INQzSg1zFLLKmU2aeCQQMEEJXIQORRsTLNyKJhNm3IoaPBg4mQorp2Mh1+00kKN307o/bZrpt5O/FlPU/c75X91/fPd6wPRD1eHyHEL4wAAAABJRU5ErkJggg==';

var image_down = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAIlJREFUKM/F0DEOwyAMBVAjDxk5Qo7CtdiClIv1KJF6gUpZIhXxY2zTDJ2benoS8LFN9MsKbYjxF2XRS1UZ4bCeGFztFmNqphURpidm146kpwFvLDYJpPQtLSLNoySyP2bRpoqih2oSFW8K3lYAxmJGXA88XMnjeuDmih7XA8vXvNeeqX6U6aY6AacbWAQNWOPUAAAAAElFTkSuQmCC';

var image_left = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHpJREFUKM+1kTEOgCAQBM9Q2JjwA/mJPA2fxlN4giWF8TRBBhMpbKSaZie3i8gPb4Y8FNZKGm8YIAONkNWacIruQLejy+gyug1dQhfRqZa0v6gYA6QfqSWapZnto1B6XdUuFaVHoJunr2MD21nIdJYUEhLYfoGmP777BKKIXC0eYSD5AAAAAElFTkSuQmCC';

var image_right = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6AQMAAAApyY3OAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAHhJREFUKM+10LERgCAMQFE4CktHcBRWcRMYzVEcwdKCI+od+fGksVCq3/AuiXOfvZnaNXzRClVrEKtMLdSqP2RTRQAFMAFGwAlw7MAk0sAzGnhVoerLKg/F5Pv4NoFNZZNGpk9sxJYeLsDdL5T7S8IFOM/R3OZ+fQeQZV9pMy+bVgAAAABJRU5ErkJggg==';

var image_up_right = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABhlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+X02G5AAAAgXRSTlMAAte32QZhZx7d+TywDTf8/d5VstYPOxULNvKmSY8TFBrxyeGCluJeELQ5uw7ULND4BedlKuv2P/vDA8UgCk30WO41s8+5X8dABAz6QhHVaR156JpPnihSfTJDNOMBm4bzSICqr23NsRjcGRbtjTCS2lzsOmyu9+WLKb2fTL8+RPDhqO4yAAABfElEQVRYw+3WZW/CUBQG4AO0FBsOwwcMm7sLc3d3d3e388/HGGs7lpD0tsm+9P3S5CT3SdPec+8BkCNHzv9FAVAAEABYdQDkA7jo9GNUIDMBzstb5vr0/Gx8Z35zOjI36R2xbu+619eWa2xCoK0FClF5h1cWxDHEwilEOyLlQc8hokoAlMRcESBh7siQlJBWKkijNaHuPrWBED9iYiDQ7Pv1D4Z4/DXyFo2JgeAghQEkEgAvT6IgNo/PIUmgd62oj80mqEIpINoXRkmg2j2UBDIWVXKLTSXEUIOF/xbV5aRQsJvvUOoqMqjZZ+c7FcX8ThYCtTbxHV0fkEGDA73D3Dpzi/6rWEYAdSn579PZ/t3IBJChkef0dLRlHXdkJ6TSmSnmiYPq1LQIiGHX9BvZYinJ7/+R6q1czUG0j9KSOTxDc6UhshZhMIQrS78mncwZtzErrNcYL6V2Zd0tJ6i7QFtAYPcvHv25W6J+/Y3BrRA/x6WGuGN5mpUjhyyfsGtrpKE95HoAAAAASUVORK5CYII=';

var image_down_right = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABXFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9jYfXuAAAAc3RSTlMAQ98Ox1j9gAtRNTqBPfgu9p/MTQ+G1Qfx7Y0VBYyJgjkGd3ysU+Zz1IQvMM20PgwBp8Mi4TSUiDvlPxylsaF2WfcjJh0S+wLzQLmY4l/ovX3ra1rPLAOSKa4RUEvgcZwbFHqPzodGbX7qPMvCtsEq1laguT+HEwAAAVlJREFUWMPt1sduwkAQgOGxDfFCIITe0nvvvZHee++992TeX4pJQIC9hPWaQ6T41x6skfY7WGPJAGZm/6qgZjIH4AMgOp2Lq32batTkdW/trPt9+qC70DVmSKS2BXF7A1fX9DDnN2FUSpe8y5hID3SZuJMmrcwmoSFm5vD0BDWSNTnCUmZoD1PZtJCDGfIgRUpBMjPkR4rEAwUtFIkHAkKRuCCaxAdRJE5IK/FCGumWF1JLEW5ILfFD2ST9UBaJA6JLPBCQ57xAJcp5NQbtSgBReJSsH8QI5No8ODo+u397ecL3T35IGhcRA4jig8E9qmjAX2OGnAV5ggrxr0ELOaByVmg6B1TGvEYyTvxcKUaMv/ii7xN/VAZYY2dfSHkkPOYY7Kpf7OmLzLfGPIFGd6izWrRUjdYt9Xfo+ULsLpgRKqGtGyadAEIUmnuhXSAwMAXD5j+omZlZRl+X30CWTm2dHwAAAABJRU5ErkJggg==';

var image_up_left = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABLFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PVkEkAAAAY3RSTlMAAQ/6Uc0OEAvHTzL7TcudsMHvdwnfUwMcG8UGiIfTrIkg9QI+/ZTDe460km73LNovCo1vQUuR4Lwk45/OK+3UERTkekziZlSK8QQnoOsFaaXmLqOylvPZLYDRZTUWUpiTDfAuEmiSAAABUklEQVRYw+3WZ2+DMBAG4EtTygrQ7NHsJt1777333vv+/38o6gIMSo0dqf3AK1lIZ/mRjPEJgCBBgvxtQr8WqDKbCiWUG1AnYXU7C7UJqKQSR5oKQwqIPphsYW24nEPjJCYXilf9F+G+qeTmThTP5w8X8gK9NLqOGMGPhD8fdXtBkGihlmlsmF5aqK2xg9FmQe3/DupuEhTpoT41z/V1HVHfxWRRo/6ORBfyjILx9mRo+2MDlS3ggF5q4uP9qzmVNjfOA+EDdDLcWA8IW6FJEJPkCbFI3hCDZEFVPsmC7mQuyYJ0iUuyIAG4JDvEJTkgHskJcUgExC6RECmxQ4REDa24ILsU6wL/rfYHskmX9C87Pfi9aA5cUmnRx/kffDmncSCkat7X342KSzOIuesNR1WSl7GU8Xfbbs9Gyoo0TvRp6Tie8d2TOsyx51UMEiQIS94B13oTqqYgGGoAAAAASUVORK5CYII=';

var image_down_left = 'iVBORw0KGgoAAAANSUhEUgAAAEgAAAA6CAMAAAAk2e+/AAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAABg1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8aT76cAAAAgHRSTlMAafwJfflezc+3WA7Z5Rk6PAvpBNE73kJT89QxZ48czNIv9A1DnI3qKQUaymjT4a7HdVuGf85LR20CVHr+tLBlA0GvYSTYZEnbAcazNPX4yB4GrAgnmL6Bcj4qIVKIe8kdVadIEe27B90bOG/3Er1rYJq1wibyh+4Q5CMzRllMXDo5euMAAAGfSURBVFjD7dblUwJBGAbw5aSlBJRGQERBkLC7u7u7u7veP90jDnaEcdhjP+k9X5h9Zu43O7PLe4eQECH/KGsIaUooOEcLK75LpehH628idSrE+nMANfyQ3MY2BRm0C6mM462tUwJAJtVyUB1WmsoSFZEk46D6TBcYS3UKPpCYawxD5VxHImVD/RHIxMQbGintkGQcppkcOkuutQPYfkDfmjck556ZTSydve2YY5UWk0Mww672VPh+XFqCU8tA+whtL+KOpa+bF3Rh8B4ymDNaSnSzG9IPIpsL34/HTPZfS58auMPYuYNMWcQXOsD3U9ZDOkZkkCvqwSIqUI2WfEDmgiQxRANiIp8GKtDLO6/Znw19oOdXhKoROtEUBr1F5Y9f4dt1XygqKgh6YqcHwMQkQBWICr1H6czTgrpoQde0IGnekJEWNEwLMv/GPDDB/M/fDioVeLYA5GqoYt+xNRY4toJkCiBUG7vTEVxJu2Z549RbqXQuba7uVDZWO66mgw6d7kYaEPvvCb+REIp/srGzLP4aa0n8zKFkKUSIkD+Qb9QrYMvxAbaBAAAAAElFTkSuQmCC';

exports = module.exports = instance;
