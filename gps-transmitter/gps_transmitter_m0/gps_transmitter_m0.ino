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
  //char c = GPS.read();
  //if (c) Serial.print(c);
  Serial2.IrqHandler();
}

void setup() {
  //Serial.begin(9600);

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

  // GPS.begin() doesn't quite work with the SERCOM stuff...
  Serial2.begin(9600);

  pinPeripheral(10, PIO_SERCOM);
  pinPeripheral(12, PIO_SERCOM);

  GPS.sendCommand(PMTK_SET_NMEA_OUTPUT_RMCONLY);
  GPS.sendCommand(PMTK_SET_NMEA_UPDATE_1HZ);

  pinMode(13, OUTPUT);  // Use the onboard LED as an error light for XBee packet failures
}

void loop() {
  if (GPS.newNMEAreceived()) {
    if (!GPS.parse(GPS.lastNMEA())) {
      return;
    }

    //Serial.print(GPS.lastNMEA());

    // status bit 0 is fix status
    if (GPS.fix) {
      gps_status |= 1 << 0;
    } else {
      gps_status &= ~(1 << 0);
    }

    // status bit 1 says we have battery info
    gps_status |= 1 << 1; // bit 1 says we have battery info

    // status bits 2 - 4 are battery info
    float measuredvbat = analogRead(A7);
    measuredvbat *= 2;    // we divided by 2, so multiply back
    measuredvbat *= 3.3;  // Multiply by 3.3V, our reference voltage
    measuredvbat /= 1024; // convert to voltage

    gps_status &= ~(7 << 2);  // clear bits 2 - 4

    /*
     * Battery status based on the following:
     *
     * 4.14 volts or more is "full".
     * 3.60 volts is the lowest usable voltage.
     *
     * So 4.14 volts works out to 95% so it shows as "full" while
     * 3.60 volts works out to just above 15% which is the cutoff
     * for "!".  Everything else just falls in the middle.
     */
    float batteryPercentage = (10 - (4.17 - measuredvbat) / 0.0672) * 10;
    if (batteryPercentage > 95) {
      gps_status |= 7 << 2;   // 100%
    } else if (batteryPercentage > 85) {
      gps_status |= 6 << 2;   // 90%
    } else if (batteryPercentage > 75) {
      gps_status |= 5 << 2;   // 80%
    } else if (batteryPercentage > 65) {
      gps_status |= 5 << 2;   // 70% but stay at 80%
    } else if (batteryPercentage > 55) {
      gps_status |= 4 << 2;   // 60%
    } else if (batteryPercentage > 45) {
      gps_status |= 3 << 2;   // 50%
    } else if (batteryPercentage > 35) {
      gps_status |= 2 << 2;   // 40% but stay at 50%
    } else if (batteryPercentage > 25) {
      gps_status |= 2 << 2;   // 30%
    } else if (batteryPercentage > 15) {
      gps_status |= 1 << 2;   // 20%
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

          //Serial.print("Delivery Error: 0x");
          //Serial.println(deliveryStatus, HEX);
        }
      }
    }
  }
}
