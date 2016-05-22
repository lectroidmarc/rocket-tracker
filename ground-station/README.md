# Ground Station

This is a [NodeJS](https://nodejs.org) app to handle incoming location data from an XBee radio and output it to [Firebase](https://firebase.google.com).  This assumes a working network connection of course ;).

### Configuration

Rename the `config.sample.js` file to `config.js` and edit what needs to be edited.  Basically this means setting the name of your Firebase DB and what setting the serial port your XBee radio is attached to.

There are different blocks for each supported XBee radio type, XBee Series 1, XBee-PRO 900 and XBee Zigbee modules.  Many options are duplicated for so only uncomment one set at a time.

To talk to Firebase, the node app assumes you have a valid [Service Account key file](https://firebase.google.com/docs/server/setup#prerequisites) saved to `firebase-credentials.json`.

Start the listener with:

    # node node/app

### Auto Starting (systemd)

If using systemd, install the `ground-station.service.txt` file into `/etc/systemd/system/ground-station.service`.  Then enable it with the following:

    # systemctl enable ground-station
    # systemctl start ground-station

Of course the opposite is:

    # systemctl stop ground-station
    # systemctl disable ground-station

Status checks can be done with:

    # systemctl status ground-station

And log checks with:

    # journalctl -u ground-station

### Network Reset

When using ZigBee radios the channel is automatically chosen by the Coordinator when the PAN is first configured.  If for some reason you need to move to a different channel, you can force a rescan of the available channels by triggering a network reset (`ATNR1`) with the following command:

    # node network-reset

This will also send a network reset broadcast to all associated nodes causing them to update as well.

_Very Important: Any nodes that are not actively associated (i.e. those currently lost) will not get the message to reset their network settings so they will lose connectivity._

-30-
