# GPS Transmitter

There are currently two GPS Transmitter prototypes, a [Sparkfun Fio v3](https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide) or an [Adafruit Feather M0](https://www.adafruit.com/products/2772).  Each are set up to use an [Adafruit Ultimate GPS](https://learn.adafruit.com/adafruit-ultimate-gps).

It can handle different types of "Pro" series XBee radios including: [Series 1](https://www.sparkfun.com/products/11216), [900mhz XBee-PRO](https://www.sparkfun.com/products/11634) or [Zigbee modules (S2B or S2C)](https://www.adafruit.com/products/967).  Zigbee moduels are preferred as they offer mesh capabilities.  The radio is always on `Serial1`.

The M0 is the preferred platform as it can report battery level as well as provides backup power to the GPS.

### Configuration

Configuration is handled in `config.h`.  Uncomment the block that matches the XBee radio type you have.  There are different blocks for each supported XBee radio type so only uncomment one set at a time.

For the Fio v3, set the GPS pins you wish to use (remember on the Fio, only certain pins can be used for recieving under SoftwareSerial). On the M0 pins 10 and 12 are mapped to `Serial2`, and the GPS is hardcoded to use that.

-30-
