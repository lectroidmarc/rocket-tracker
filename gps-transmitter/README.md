# GPS Transmitter

There are currently two GPS Transmitter prototypes, a [Sparkfun Fio v3](https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide) or an [Adafruit Feather M0](https://www.adafruit.com/products/2772).  Each are set up to use an [Adafruit Ultimate GPS](https://learn.adafruit.com/adafruit-ultimate-gps).

It can handle different types of XBee radios including: Series 1, 900mhz XBee-PRO and Zigbee modules.  The radio is always on `Serial1`.

The M0 is the preferred platform as it can report battery level as well as provides backup power to the GPS.

### Configuration

Configuration is handled in `config.h`.  Uncomment the block that matches the XBee radio type you have.  There are different blocks for each supported XBee radio type so only uncomment one set at a time.

For the Fio v3, set the GPS pins you wish to use (remember on the Fio, only certain pins can be used to SoftwareSerial) but on the M0 pins 10 and 12 are mapped to `Seriall2`, and the GPS is set to use that.

-30-
