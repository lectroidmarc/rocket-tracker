/*
 *
 */

var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var firebase = require('firebase');

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

  if (config.xbee.channel) {
    // Set Channel (XBee 802.15.4 only)
    serialport.write(xbeeAPI.buildFrame({
      type: C.FRAME_TYPE.AT_COMMAND,
      command: 'CH',
      commandParameter: config.xbee.channel,
    }));
  }

  if (config.xbee.hopping_channel) {
    // Set Hopping Channel (XBee-PRO 900 only)
    serialport.write(xbeeAPI.buildFrame({
      type: C.FRAME_TYPE.AT_COMMAND,
      command: 'HP',
      commandParameter: config.xbee.hopping_channel,
    }));
  }

  // Check every so often to make sure the serial port hasn't gone away
  setInterval(function () {
    if (!serialport.isOpen()) {
      console.error('Serial port has closed');
      process.exit(1);
    }
  }, 5000);
});

serialport.on('error', function (e) {
  console.error(e.message);
  process.exit(1);
});

firebase.initializeApp({
  serviceAccount: __dirname + '/firebase-credentials.json',
  databaseURL: 'https://amber-torch-2600.firebaseio.com/'
});

xbeeAPI.on('frame_object', function(frame) {
  //console.log(">>", frame);

  if (frame.type === C.FRAME_TYPE.RX_PACKET_64 || frame.type === C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET) {
    var statusByte = frame.data.readUInt8(0);

    var data = {
      time: firebase.database.ServerValue.TIMESTAMP,
      fix: (statusByte & 0x01) ? true : false
    };

    switch (statusByte >> 1 & 7) {
      case 7:
        data.battery = 100;
        break;
      case 6:
        data.battery = 90;
        break;
      case 5:
        data.battery = 80;
        break;
      case 4:
        data.battery = 60;
        break;
      case 3:
        data.battery = 50;
        break;
      case 2:
        data.battery = 30;
        break;
      case 1:
        data.battery = 20;
        break;
      case 0:
        data.battery = 0;
        break;
    }

    if (data.fix) {
      data.location = {
        latitude: Number(frame.data.readFloatLE(1).toFixed(5)),
        longitude: Number(frame.data.readFloatLE(5).toFixed(5))
      };
    }

    firebase.database().ref('rockets/' + frame.remote64).update(data);
  } else if (frame.type === C.FRAME_TYPE.AT_COMMAND_RESPONSE) {
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
