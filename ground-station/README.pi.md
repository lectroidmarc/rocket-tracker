# Raspberry Pi Setup

Install and setup [Raspbian Lite](https://www.raspberrypi.org/downloads/raspbian/).

Install NodeJS _(assumes Node 6.10.0 on a Pi A, B, B+ or Zero (armv6))_:

    wget https://nodejs.org/dist/latest-v6.x/node-v6.10.0-linux-armv6l.tar.xz
    sudo tar -xf node-v6.10.0-linux-armv6l.tar.xz -C /usr/local --strip-components=1

Install git:

    sudo apt-get install git

Clone this repo.

    git clone https://github.com/lectroidmarc/rocket-tracker.git

Build the node modules (this will take a very long time on a slow Pi):

    cd rocket-tracker/ground-station/node
    npm install

(Optional) Install the systemd system file

    cd ..
    sudo cp ground-station.service.txt /etc/systemd/system/ground-station.service

-30-
