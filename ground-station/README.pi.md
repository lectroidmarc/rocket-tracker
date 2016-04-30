# Raspberry Pi Setup

Install and setup [Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/).

Install NodeJS ([see also](https://learn.adafruit.com/node-embedded-development/installing-node-dot-js)):

    curl -sLS https://apt.adafruit.com/add | sudo bash
    sudo apt-get install node

Install git:

    sudo apt-get install git

Clone this repo.

    git clone https://github.com/lectroidmarc/rocket-tracker.git

Build the node modules:

    cd rocket-tracker/ground-station/node
    npm install

(Optional) Install the systemd system file

    cd ..
    sudo cp ground-station.service.txt /etc/systemd/system

-30-
