# Rocket Tracker

This is the code for a *Rocket Tracking System*, that is a system for tracking (lost) model rockets via GPS.

The idea is that a GPS transmitter will live in a rocket and transmit data to a ground station via radio.  That ground station will then update a "cloud" based data store with the location(s) of the rocket(s).  A user (or users) can then access that data with an internel connected device (phone, tablet, laptop etc) to see the locations of their rockets.

This system should be able to be used by individuals for tracking one or more rockets or by large groups for tracking larger numbers of rockets.

The system is made up of the following components:

* ##### The GPS Transmitter

  The GPS transmitter is a small microcontroller that connects to a GPS and some kind of [XBee radio](http://www.digi.com/lp/xbee).  The micorcontroller parses the NMEA data from the GPS and transmits location data once per second over the radio.

  Transmission packets are 9 byte packets made up of a status byte then 4 bytes for latitude and 4 bytes for longitude (each are 4 byte floats).

* ##### The Ground Station

  The ground station listens for location messages from the transmitters and then forwards their location to a [Firebase](https://firebase.google.com) based database.

  If ZigBee radios are used, the ground station is also the network coordinator.

  The ground station code itself is a simple [NodeJS](https://nodejs.org/) app and so can run on anything that can run NodeJS and has a serial port to talk to an XBee radio.  And has internet access.

* ##### The Client App

  The client app is what the user uses to see the location of their rocket.  It connects to Firebase and displays the location data in (near) real time and allows the user to open the rocket's location in a mapping app.  Client web app code is located in the [gh-pages branch](../../tree/gh-pages) and can be seen at https://lectroidmarc.github.io/rocket-tracker/.

* ##### Dumb Relays (optional)

  If using ZigBee radios, every GPS transmitter is already a "router" but dedicated routers could also be added to extend range or enhance coverage.  These are simple ZigBee routers node that have no other logic to them, just powered pre-configured radios.

#### XBee Radio Setup

Generally speaking the only thing that needs to be changed from a factory default XBee radio is that they need to be placed into [API Mode 2](http://knowledge.digi.com/articles/Knowledge_Base_Article/What-is-API-Application-Programming-Interface-Mode-and-how-does-it-work).  Everything else can be handled in software.

For [ZigBee](https://en.wikipedia.org/wiki/ZigBee) radios, the proper ZigBee firmware (Coordinator, Router or End Device) will have to be installed.  For our purposes there's no advantage to the "End Device" firmware, so it's just one Coordinator and multiple Routers.

Note: Alternatively, settings (such as the PAN ID) can be pre-configured in each module.  In these cases, comment out the matching settings in the configuration file so they're not overwritten.

##### Dumb Relay nodes

Dumb relay nodes however should be configured in firmware with the PAN ID (`ATID`) and with Channel Verification turned on (`ATJV1`).

#### To Do

* The XBee protocols support status packets so the transmitter can use the lack of a successful status packet as a signal to enable some alternate means of discovery -- like enabling a loud buzzer after a certain timeout.

* Include some sort of built-in internet connectivity in the ground station.

* Expose the location data via a custom Bluetooth LE GATT profile on the ground station and allow the clients in range to use the [Web Bluetooth API](https://webbluetoothcg.github.io/web-bluetooth/) to fetch and display the data.  Note, with Bluetooth, _only one client can connect at a time_.

-30-
