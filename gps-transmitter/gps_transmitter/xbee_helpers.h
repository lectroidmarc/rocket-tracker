/*
 *
 */

typedef union {
  float floatingPoint;
  byte binary[4];
} binaryFloat;

uint8_t setXBeePanId (uint16_t addr);
uint8_t setXBeeMyAddress (uint16_t addr);
uint8_t setXBeeChannel (uint8_t channel);
uint8_t setXBeeHoppingChannel (uint8_t channel);
uint8_t setXBeeChannelVerification (uint8_t mode);
uint8_t setXBeeNetworkWatchdogTimeout (uint16_t timeout);
uint8_t resetXBeeNetwork (uint8_t mode);

void setPayload (float lat, float lng, uint8_t* payload);

