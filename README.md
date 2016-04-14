# Rocket Tracker

This is the code for a *Rocket Tracking System*, that is a system for tracking (lost) model rockets via GPS.

The idea is that a GPS transmitter will live in a rocket and transmit data to a ground station via radio.  That ground station will then update a "cloud" based data store with the location(s) of the rocket(s).  A user (or users) can then access that data with an internel connected device (phone, tablet, laptop etc) to see the locations of their rockets.

This system can be used by individuals for tracking one or more rockets, or by large groups for tracking larger numbers of rockets.

The system is made up of the following components:

##### The GPS Transmitter

Transmission from the rocket to the ground is done via [XBee radio](http://www.digi.com/lp/xbee).  The working prototype is based on a [Sparkfun Fio v3](https://learn.sparkfun.com/tutorials/pro-micro--fio-v3-hookup-guide) with an [XBee-Pro 900mhz](https://www.sparkfun.com/products/9097) radio and an [Adafruit Ultimate GPS](https://learn.adafruit.com/adafruit-ultimate-gps).

Transmissions are 9 byte packets made up of a status byte then 4 bytes for latitude and 4 bytes for longitude (each are 4 byte floats).

##### The Ground Station

The ground station's job is to listen for location broadcasts on the XBee network and forward the location info -- as well as the transmitter's source address -- to a [Firebase](https://www.firebase.com/) based database.

The ground station code is a simple [NodeJS](https://nodejs.org/) app and can run on anything that can run Node and has a serial port to host an XBee radio.  Currently the prototype is an [Intel Edison](https://www-ssl.intel.com/content/www/us/en/do-it-yourself/edison.html).

##### The Client App

The client app in this case is a web app.  Based on [Polymer](https://www.polymer-project.org/1.0/) and hosted on GitHub Pages, it connects to Firebase and displays the location data in near real time, allowing the user to open the rocket's location in a mapping app.

##### Optional Relay Nodes

If ZigBee radios are used, optional relay nodes can be added to extend range or enhance coverage.  These are simple ZigBee "routers" that have no other logic to them, just powered pre-configured radios.

### Configuration

Configuration is done via config files.  The transmitter code uses a `config.h` file and the ground station a `config.js` file.  These are covered in more detail in each project.

##### XBee Radio Setup

Generally speaking the only thing that needs to be changed from a factory default XBee radio is that they need to be placed into [API Mode 2](http://knowledge.digi.com/articles/Knowledge_Base_Article/What-is-API-Application-Programming-Interface-Mode-and-how-does-it-work).  Everything else can be handled in software.

For [ZigBee](https://en.wikipedia.org/wiki/ZigBee) radios, the proper ZigBee firmware (Coordinator, Router or End Device) will have to be installed.  For our purposes there's no advantage to the "End Device" firmware, so it's just one Coordinator and multiple Routers.

Note: Alternatively, settings (such as the PAN ID) can be pre-configured in each module.  In these cases, comment out the matching settings in the configuration file so they're not overwritten.

##### Relay Nodes

Relay nodes however should be configured in firmware with the PAN ID (`ATID`) and with Channel Verification turned on (`ATJV1`).

### To Do

* The XBee protocols support status packets so the transmitter can use the lack of a successful status packet as a signal to enable some alternate means of discovery -- like enabling a loud buzzer after a certain timeout.

* Include some sort of built-in internet connectivity in the ground station.

* Expose the location data via a custom Bluetooth LE GATT profile on the ground station and allow the clients in range to use the [Web Bluetooth API](https://webbluetoothcg.github.io/web-bluetooth/) to fetch and display the data.  Note, with Bluetooth, _only one client can connect at a time_.

-30-
