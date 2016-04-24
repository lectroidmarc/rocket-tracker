/*
 * GPS Transmitter
 *
 * Utilizes a Adafruit Feather M0. Creates Serial2 on pins 10 (TX) and 12 (RX)
 * and uses it for the GPS.  An XBee radio is on Serial1.
 */

#include <Arduino.h>        // required before wiring_private.h
#include "wiring_private.h" // pinPeripheral() function

#include <Adafruit_GPS.h>
#include <XBee.h>

#include "config.h"
#include "xbee_helpers.h"

// Set up Serial2 on pins 10 (TX) and 12 (RX)
// See: https://learn.adafruit.com/using-atsamd21-sercom-to-add-more-spi-i2c-serial-ports/creating-a-new-serial
Uart Serial2(&sercom1, 12, 10, SERCOM_RX_PAD_3, UART_TX_PAD_2);

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

Adafruit_GPS GPS(&Serial2);

// Interrupt handler for SERCOM1
void SERCOM1_Handler() {
  GPS.read();
  Serial2.IrqHandler();
}

boolean checkChecksum (char *nmea) {
  if (nmea[strlen(nmea)-4] == '*') {
    uint16_t sum = GPS.parseHex(nmea[strlen(nmea)-3]) * 16;
    sum += GPS.parseHex(nmea[strlen(nmea)-2]);

    // check checksum Note: nmea[0] == '\r' so we start at the 2nd character
    for (uint8_t i=2; i < (strlen(nmea)-4); i++) {
      sum ^= nmea[i];
    }

    return (sum != 0) ? false : true;
  } else {
    // a checksum is required
    return false;
  }
}

void setup() {
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

  // GPS.begin() doesn't do anything on !__AVR__
  Serial2.begin(9600);

  pinPeripheral(10, PIO_SERCOM);
  pinPeripheral(12, PIO_SERCOM);

  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCONLY);
  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);

  pinMode(13, OUTPUT);
}

void loop() {
  if (GPS.newNMEAreceived()) {
    if (!checkChecksum(GPS.lastNMEA())) {
      return;
    }
    if (!GPS.parse(GPS.lastNMEA())) {
      return;
    }

    // status bit 0 is fix status
    if (GPS.fix) {
      gps_status |= 1 << 0;
    } else {
      gps_status &= ~(1 << 0);
    }

    // status bits 1-3 are battery info
    float measuredvbat = analogRead(A7);
    measuredvbat *= 2;    // we divided by 2, so multiply back
    measuredvbat *= 3.3;  // Multiply by 3.3V, our reference voltage
    measuredvbat /= 1024; // convert to voltage

    gps_status &= ~(7 << 1);  // clear bits 1 - 3

    /*
     * Battery voltage chart that seems to best match reality.
     *
     * range                  bits
     * -----                  ----
     * 4.20 - 100% -- 4.14     7
     * 4.13 -- 90% -- 4.07     6
     * 4.06 -- 80% -- 4.00     5
     * 3.99 -- 70% -- 3.93     n/a
     * 3.92 -- 60% -- 3.86     4
     * 3.85 -- 50% -- 3.79     3
     * 3.78 -- 40% -- 3.72     n/a
     * 3.71 -- 30% -- 3.65     2
     * 3.64 -- 20% -- 3.58     1
     * 3.57 -- 10% -- 3.51     n/a
     * 3.50 --  0%             0
     */

    if (measuredvbat > 4.13) {
      gps_status |= 7 << 1;   // 100%
    } else if (measuredvbat > 4.06) {
      gps_status |= 6 << 1;   // 90%
    } else if (measuredvbat > 3.99) {
      gps_status |= 5 << 1;   // 80%
    } else if (measuredvbat > 3.85) {
      gps_status |= 4 << 1;   // 60%
    } else if (measuredvbat > 3.78) {
      gps_status |= 3 << 1;   // 50%
    } else if (measuredvbat > 3.64) {
      gps_status |= 2 << 1;   // 30%
    } else if (measuredvbat > 3.57) {
      gps_status |= 1 << 1;   // 20%
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
        uint8_t deliveryStatus = zbTxStatus.getDeliveryStatus();
#else
      if (xbee.getResponse().getApiId() == TX_STATUS_RESPONSE) {
        xbee.getResponse().getTxStatusResponse(txStatus);
        uint8_t deliveryStatus = txStatus.getStatus();
#endif
        if (deliveryStatus == SUCCESS) {
          digitalWrite(13, LOW);
        } else {
          digitalWrite(13, HIGH);

          Serial.print("Delivery Error: 0x");
          Serial.println(deliveryStatus, HEX);
        }
      }
    }
  }
}
