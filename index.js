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


function hex2str(hexdata) {
		var result = '';
		for (var i = 0; i < hexdata.length; i += 2) {
				result += String.fromCharCode( parseInt(hexdata.substr(i,2), 16) );
		}

		return result;
};

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

	self.actions(); // export actions

	return self;
}



instance.prototype.init_udp = function() {
	var self = this;

	if (self.udp !== undefined) {
		self.udp.destroy();
		delete self.udp;
	}

	if (self.config.host !== undefined) {
		self.udp = new udp(self.config.host, 52381);

		// Reset sequence number
		self.sendControlCommand('\x01');
		self.packet_counter = 0;

		self.udp.on('status_change', function (status, message) {
			self.status(status, message);
		});
		self.udp.on('data', function (data) {
			console.log("Data from SONY VISCA: ", data);
		});
	debug(self.udp.host,':52381');
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
};

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;

	if (self.udp !== undefined) {
		self.udp.destroy();
		delete self.udp;
	}

	self.status(self.STATUS_UNKNOWN);

	if (self.config.host !== undefined) {
		self.udp = new udp(self.config.host, 52381);

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
			cmd = '\x80\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x01\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'right':
			cmd = '\x80\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x02\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'up':
			cmd = '\x80\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x03\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'down':
			cmd = '\x80\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x03\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'upLeft':
			cmd = '\x80\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x01\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'upRight':
			cmd = '\x80\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x02\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'downLeft':
			cmd = '\x80\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x01\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'downRight':
			cmd = '\x80\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x02\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'stop':
			cmd = '\x80\x01\x06\x01'+ String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) + String.fromCharCode(parseInt(self.ptSpeed,16) & 0xFF) +'\x03\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'home':
			cmd = '\x80\x01\x06\x04\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'ptSlow':
			if (opt.bol == '0') {
				cmd = '\x80\x01\x06\x44\x02\xFF';
			}
			if (opt.bol == '1') {
				cmd = '\x80\x01\x06\x44\x03\xFF';
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
			cmd = '\x80\x01\x04\x07\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'zoomO':
			cmd = '\x80\x01\x04\x07\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'zoomS':
			cmd = '\x80\x01\x04\x07\x00\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'ciZoom':
			if (opt.bol == 0){
				cmd = '\x80\x01\x04\x06\x03\xFF';
			}
			if (opt.bol == 1){
				cmd = '\x80\x01\x04\x06\x04\xFF';
			}
			self.sendVISCACommand(cmd);
			break;

		case 'focusN':
			cmd = '\x80\x01\x04\x08\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'focusF':
			cmd = '\x80\x01\x04\x08\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'focusS':
			cmd = '\x80\x01\x04\x38\x00\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'focusM':
			if (opt.bol == 0){
				cmd = '\x80\x01\x04\x38\x02\xFF';
			}
			if (opt.bol == 1){
				cmd = '\x80\x01\x04\x38\x03\xFF';
			}
			self.sendVISCACommand(cmd);
			break;

		case 'focusOpaf':
			cmd = '\x80\x01\x04\x18\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'expM':
			if (opt.val == 0){
				cmd = '\x80\x01\x04\x39\x00\xFF';
			}
			if (opt.val == 1){
				cmd = '\x80\x01\x04\x39\x03\xFF';
			}
			if (opt.val == 2){
				cmd = '\x80\x01\x04\x39\x0A\xFF';
			}
			if (opt.val == 3){
				cmd = '\x80\x01\x04\x39\x0B\xFF';
			}
			if (opt.val == 4){
				cmd = '\x80\x01\x04\x39\x0E\xFF';
			}
			self.sendVISCACommand(cmd);
			break;


		case 'gainU':
			cmd = '\x80\x01\x04\x0C\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'gainD':
			cmd = '\x80\x01\x04\x0C\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'gainS':
			var cmd = Buffer.from('\x80\x01\x04\x4C\x00\x00\x00\x00\xFF', 'binary');
			cmd.writeUInt8((parseInt(opt.val,16) & 0xF0) >> 4, 6);
			cmd.writeUInt8(parseInt(opt.val,16) & 0x0F, 7);
			self.sendVISCACommand(cmd);
			debug('cmd=',cmd);
			break;

		case 'irisU':
			cmd = '\x80\x01\x04\x0B\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'irisD':
			cmd = '\x80\x01\x04\x0B\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'irisS':
			var cmd = Buffer.from('\x80\x01\x04\x4B\x00\x00\x00\x00\xFF', 'binary');
			cmd.writeUInt8((parseInt(opt.val,16) & 0xF0) >> 4, 6);
			cmd.writeUInt8(parseInt(opt.val,16) & 0x0F, 7);
			self.sendVISCACommand(cmd);
			debug('cmd=',cmd);
			break;

		case 'shutU':
			cmd = '\x80\x01\x04\x0A\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'shutD':
			cmd = '\x80\x01\x04\x0A\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'shutS':
			var cmd = Buffer.from('\x80\x01\x04\x4A\x00\x00\x00\x00\xFF', 'binary');
			cmd.writeUInt8((parseInt(opt.val,16) & 0xF0) >> 4, 6);
			cmd.writeUInt8(parseInt(opt.val,16) & 0x0F, 7);
			self.sendVISCACommand(cmd);
			debug('cmd=',cmd);
			break;

		case 'savePset':
			cmd ='\x80\x01\x04\x3F\x01' + String.fromCharCode(parseInt(opt.val,16) & 0xFF) + '\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'recallPset':
			cmd ='\x80\x01\x04\x3F\x02' + String.fromCharCode(parseInt(opt.val,16) & 0xFF) + '\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'speedPset':
			cmd ='\x80\x01\x7E\x01\x0B' + String.fromCharCode(parseInt(opt.val,16) & 0xFF) + String.fromCharCode(parseInt(opt.speed,16) & 0xFF) + '\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'tally':
			if (opt.bol == 0){
				cmd = '\x80\x01\x7E\x01\x0A\x00\x03\xFF';
			}
			if (opt.bol == 1){
				cmd = '\x80\x01\x7E\x01\x0A\x00\x02\xFF';
			}
			self.sendVISCACommand(cmd);
			break;
	}
};

instance.module_info = {
	label: 'Sony Visca PTZ ',
	id: 'sony-visca',
	version: '0.0.1'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
