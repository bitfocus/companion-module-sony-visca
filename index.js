var instance_skel = require('../../instance_skel');
var udp           = require('../../udp');
var debug;
var log;
var packet_counter = 0;

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

		packet_counter = (packet_counter + 1) % 0xFFFFFFFF;

		buf.writeUInt16BE(payload.length, 2);
		buf.writeUInt32BE(packet_counter, 4);

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

		self.udp.on('status_change', function (status, message) {
			self.status(status, message);
		});
	debug(self.udp.host,':52381');
	}
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

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
		self.udp = new udp(self.config.host, 7000);

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
		'ptSlow':         { label: 'P/T Slow Mode' },
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
						{ id: '0', label: 'Full autoload' },
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
		'savePset':       { label: 'Save Preset' },
		'recallPset':     { label: 'Recall Preset' },
		'speedPset':      { label: 'Preset Drive Speed' },
		'tally':          { label: 'Tally on/off' }


	});
}

instance.prototype.action = function(action) {
	var self = this;
	var opt = action.options;
	var cmd = ''

	switch (action.action) {

		case 'left':
			cmd = '\x80\x01\x06\x01\x09\x09\x01\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'right':
			cmd = '\x80\x01\x06\x01\x09\x09\x02\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'up':
			cmd = '\x80\x01\x06\x01\x09\x09\x03\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'down':
			cmd = '\x80\x01\x06\x01\x09\x09\x03\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'upLeft':
			cmd = '\x80\x01\x06\x01\x09\x09\x01\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'upRight':
			cmd = '\x80\x01\x06\x01\x09\x09\x01\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'downLeft':
			cmd = '\x80\x01\x06\x01\x09\x09\x01\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'downRight':
			cmd = '\x80\x01\x06\x01\x09\x09\x02\x02\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'stop':
			cmd = '\x80\x01\x06\x01\x09\x09\x03\x03\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'home':
			cmd = '\x80\x01\x06\x04\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'ptSlow':

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
			};
			if (opt.bol == 1){
				cmd = '\x80\x01\x04\x06\x04\xFF';
			};
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
				};
				if (opt.bol == 1){
					cmd = '\x80\x01\x04\x38\x03\xFF';
				};
				self.sendVISCACommand(cmd);
			break;

		case 'focusOpaf':
			cmd = '\x80\x01\x04\x18\x01\xFF';
			self.sendVISCACommand(cmd);
			break;

		case 'expM':
			if (opt.val == 0){
				cmd = '\x80\x01\x04\x39\x00\xFF';
			};
			if (opt.val == 1){
				cmd = '\x80\x01\x04\x39\x03\xFF';
			};
			if (opt.val == 2){
				cmd = '\x80\x01\x04\x39\x0A\xFF';
			};
			if (opt.val == 3){
				cmd = '\x80\x01\x04\x39\x0B\xFF';
			};
			if (opt.val == 4){
				cmd = '\x80\x01\x04\x39\x0E\xFF';
			};
			self.sendVISCACommand(cmd);
		break;
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

			break;

		case 'savePset':

			break;

		case 'recallPset':

			break;

		case 'speedPset':

			break;

		case 'tally':

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
