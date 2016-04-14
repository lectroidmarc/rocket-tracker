/*
 *
 */

var config = {
  firebase: {
    url: 'https://<YOUR-FIREBASE-APP>.firebaseio.com',
    secret: '<YOUR-FIREBASE-SECRET>'
  },
  xbee: {
    serial_port: '/dev/ttyMFD1'           // Edison Serial1: /dev/ttyMFD1
  }
};

// XBee Series 1 (802.15.4)
config.xbee.pan_id = [ 0x33, 0x32 ];      // Default: 0x3332
config.xbee.channel = [ 0x0c ];           // Default: 0x0c

// XBee-PRO 900
config.xbee.pan_id = [ 0x7f, 0xff ];      // Default: 0x7fff
config.xbee.hopping_channel = [ 0x00 ];   // Default: 0x00

// XBee ZB only
config.xbee.pan_id = [ '0x01', '0x23', '0x45', '0x67', '0x89', '0xab', '0xcd', '0xef' ];

module.exports = config;
