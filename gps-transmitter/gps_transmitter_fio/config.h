/**
 *
 */

// The Fio v3 is a Leonardo.
// Only the following can be used for RX:
// 8, 9, 10, 11, 14 (MISO), 15 (SCK), 16 (MOSI).
#define GPS_TX_PIN 8
#define GPS_RX_PIN 7

// XBee 802.15.4 (Series 1) Options
//#define XBEE_PAN_ID 0x3332
//#define XBEE_CHANNEL 0x0c
//#define GROUND_STATION_ADDR_HI 0x0013a200
//#define GROUND_STATION_ADDR_LO 0x408b1d22

// XBee-PRO 900 Options
//#define XBEE_ZB
//#define XBEE_PAN_ID 0x7fff
//#define XBEE_HOPPING_CHANNEL 0x01
//#define GROUND_STATION_ADDR_HI 0x0013a200
//#define GROUND_STATION_ADDR_LO 0x408b1d22

// XBee ZB (Series 2) Options
#define XBEE_ZB
#define XBEE_PAN_ID 0xfedcba9876543210
#define XBEE_VERIFY_CHANNEL 1
#define GROUND_STATION_ADDR_HI 0x00000000
#define GROUND_STATION_ADDR_LO 0x00000000
