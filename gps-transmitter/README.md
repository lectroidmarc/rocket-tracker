# GPS Transmitter

The GPS transmitter is a [Sparkfun Fio v3](https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide) with an XBee radio and an [Adafruit Ultimate GPS](https://learn.adafruit.com/adafruit-ultimate-gps).

It can handle different types of XBee radios including: Series 1, 900mhz XBee-PRO and Zigbee modules.

### Configuration

Configuration is handled in `config.h`.  Set the GPS pins and uncomment the block that matches the XBee radio type you have.  There are different blocks for each supported XBee radio type so only uncomment one set at a time.

-30-
