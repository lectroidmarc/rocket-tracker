/*
 *
 */

uint8_t setXBeePanId (uint16_t addr) {
  uint8_t cmd[] = {  'I', 'D' };
  uint8_t value[2];

  value[0] = (addr >> 8) & 0xff;
  value[1] = addr & 0xff;

  AtCommandRequest atRequest = AtCommandRequest(cmd, value, sizeof(value));
  xbee.send(atRequest);
  return getAtResponse();
}

uint8_t setXBeeMyAddress (uint16_t addr) {
  uint8_t cmd[] = {  'M', 'Y' };
  uint8_t value[2];

  value[0] = (addr >> 8) & 0xff;
  value[1] = addr & 0xff;

  AtCommandRequest atRequest = AtCommandRequest(cmd, value, sizeof(value));
  xbee.send(atRequest);
  return getAtResponse();
}

uint8_t setXBeeChannel (uint8_t channel) {
  uint8_t cmd[] = {  'C', 'H' };
  uint8_t value[] = { channel };

  AtCommandRequest atRequest = AtCommandRequest(cmd, value, sizeof(value));
  xbee.send(atRequest);
  return getAtResponse();
}

uint8_t setXBeeHoppingChannel (uint8_t channel) {
  uint8_t cmd[] = {  'H', 'P' };
  uint8_t value[] = { channel };

  AtCommandRequest atRequest = AtCommandRequest(cmd, value, sizeof(value));
  xbee.send(atRequest);
  return getAtResponse();
}

uint8_t setXBeeChannelVerification (uint8_t mode) {
  uint8_t cmd[] = {  'J', 'V' };
  uint8_t value[] = { mode };

  AtCommandRequest atRequest = AtCommandRequest(cmd, value, sizeof(value));
  xbee.send(atRequest);
  return getAtResponse();
}

uint8_t setXBeeNetworkWatchdogTimeout (uint16_t timeout) {
  uint8_t cmd[] = {  'N', 'W' };
  uint8_t value[2];

  value[0] = (timeout >> 8) & 0xff;
  value[1] = timeout & 0xff;

  AtCommandRequest atRequest = AtCommandRequest(cmd, value, sizeof(value));
  xbee.send(atRequest);
  return getAtResponse();
}

uint8_t resetXBeeNetwork (uint8_t mode) {
  uint8_t cmd[] = {  'N', 'R' };
  uint8_t value[] = { mode };

  AtCommandRequest atRequest = AtCommandRequest(cmd, value, sizeof(value));
  xbee.send(atRequest);
  return getAtResponse();
}

uint8_t getAtResponse () {
  AtCommandResponse atResponse = AtCommandResponse();

  if (xbee.readPacket(1000)) {
    if (xbee.getResponse().getApiId() == AT_COMMAND_RESPONSE) {
      xbee.getResponse().getAtCommandResponse(atResponse);
      if (atResponse.isOk()) {
        return 0;
      } else {
        return atResponse.getStatus();
      }
    }
  }
}

void setPayload (byte status, float lat, float lng, uint8_t* payload) {
  binaryFloat latitude;
  binaryFloat longitude;

  latitude.floatingPoint = lat;
  longitude.floatingPoint = lng;

  payload[0] = status;

  payload[1] = latitude.binary[0];
  payload[2] = latitude.binary[1];
  payload[3] = latitude.binary[2];
  payload[4] = latitude.binary[3];

  payload[5] = longitude.binary[0];
  payload[6] = longitude.binary[1];
  payload[7] = longitude.binary[2];
  payload[8] = longitude.binary[3];
}

