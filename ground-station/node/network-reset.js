/*
 *
 */

var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');

var config = require('./config');

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});

// Intel Edison needs the UART pins "enabled"
try {
  var mraa = require('mraa');
  var uart = new mraa.Uart(config.xbee.serial_port);
} catch (err) {
}

var serialport = new SerialPort(config.xbee.serial_port, {
  baudrate: 9600,
  parser: xbeeAPI.rawParser()
});

// Set XBee defaults on port connection
serialport.on('open', function() {
  if (config.xbee.pan_id) {
    // Set the PAN/Network ID
    serialport.write(xbeeAPI.buildFrame({
      type: C.FRAME_TYPE.AT_COMMAND,
      command: 'ID',
      commandParameter: config.xbee.pan_id,
    }));
  }

  // Network reset (ZigBee only)
  serialport.write(xbeeAPI.buildFrame({
    type: C.FRAME_TYPE.AT_COMMAND,
    command: 'NR',
    commandParameter: [ 0x01 ],
  }));
});

xbeeAPI.on('frame_object', function(frame) {
  //console.log(">>", frame);

  if (frame.type === C.FRAME_TYPE.AT_COMMAND_RESPONSE) {
    if (frame.commandStatus !== C.COMMAND_STATUS.OK) {
      console.log('>>', frame);
    }
  } else if (frame.type === C.FRAME_TYPE.MODEM_STATUS && frame.modemStatus === C.MODEM_STATUS.COORDINATOR_STARTED) {
    console.log('Coordinator Started.');
  } else if (frame.type === C.FRAME_TYPE.MODEM_STATUS && frame.modemStatus === C.MODEM_STATUS.DISASSOCIATED) {
    console.log('Disassociated.');
  } else {
    console.log('>>', frame);
  }
});
