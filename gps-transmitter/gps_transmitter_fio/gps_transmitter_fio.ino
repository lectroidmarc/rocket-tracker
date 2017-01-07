/*
 * GPS Transmitter
 *
 * Utilizes a Sparkfun Fio v3 and a GPS module over Software Serial.
 */

#include <Adafruit_GPS.h>
#include <SoftwareSerial.h>
#include <XBee.h>

#include "config.h"
#include "xbee_helpers.h"

XBee xbee = XBee();

byte payload[9];
byte gps_status = 0x00;

XBeeAddress64 ground_station = XBeeAddress64(GROUND_STATION_ADDR_HI, GROUND_STATION_ADDR_LO);

#ifdef XBEE_ZB
  ZBTxRequest zbTx = ZBTxRequest(ground_station, payload, sizeof(payload));
  ZBTxStatusResponse zbTxStatus = ZBTxStatusResponse();
#else
  Tx64Request tx = Tx64Request(ground_station, payload, sizeof(payload));
  TxStatusResponse txStatus = TxStatusResponse();
#endif

SoftwareSerial gpsSerial(GPS_TX_PIN, GPS_RX_PIN); // RX, TX
Adafruit_GPS GPS(&gpsSerial);

SIGNAL(TIMER0_COMPA_vect) {
  char c = GPS.read();
}

void setup() {
  RXLED1;   // Turn off the blue RX light. Turned on when there's a GPS fix
  TXLED1;   // Turn off the yellow TX light. Turned on for XBee packet failures

  Serial.begin(9600);

  Serial1.begin(9600);
  xbee.setSerial(Serial1);

#ifdef XBEE_PAN_ID
  setXBeePanId(XBEE_PAN_ID);
#endif

#ifdef XBEE_CHANNEL
  setXBeeMyAddress(0xffff);     // Set to force 64 bit addressing
  setXBeeChannel(XBEE_CHANNEL);
#endif

#ifdef XBEE_HOPPING_CHANNEL
  setXBeeHoppingChannel(XBEE_HOPPING_CHANNEL);
#endif

#ifdef XBEE_VERIFY_CHANNEL
  setXBeeChannelVerification(XBEE_VERIFY_CHANNEL);
#endif

  GPS.begin(9600);
  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCONLY);
  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);

  // Timer0 is already used for millis() - we'll just interrupt somewhere
  // in the middle and call the "Compare A" function above
  OCR0A = 0xAF;
  TIMSK0 |= _BV(OCIE0A);
}

void loop() {
  if (GPS.newNMEAreceived()) {
    if (!GPS.parse(GPS.lastNMEA())) {
      return;
    }

    // status bit 0 is fix status
    if (GPS.fix) {
      RXLED0;
      gps_status |= 1 << 0;
    } else {
      RXLED1;
      gps_status &= ~(1 << 0);
    }

    setPayload(gps_status, GPS.latitudeDegrees, GPS.longitudeDegrees, payload);

#ifdef XBEE_ZB
    xbee.send(zbTx);
#else
    xbee.send(tx);
#endif

    if (xbee.readPacket(1000)) {
#ifdef XBEE_ZB
      if (xbee.getResponse().getApiId() == ZB_TX_STATUS_RESPONSE) {
        xbee.getResponse().getZBTxStatusResponse(zbTxStatus);
        if (zbTxStatus.getDeliveryStatus() == SUCCESS) {
#else
      if (xbee.getResponse().getApiId() == TX_STATUS_RESPONSE) {
        xbee.getResponse().getTxStatusResponse(txStatus);
        if (txStatus.getStatus() == SUCCESS) {
#endif
          TXLED1;
        } else {
          TXLED0;
        }
      }
    }
  }
}
