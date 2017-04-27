/**
 *
 */

var RocketMap = {
  _markers: {},

  init: function (dom_element) {
    this._map = new google.maps.Map(dom_element, {
      zoom: 18,
      center: {
        lat: 37.949528,
        lng: -120.797179
      },
      streetViewControl: false
    });

    google.maps.event.addDomListener(window, 'resize', () => {
      this.resize();
    });

    this._bounds = new google.maps.LatLngBounds();
    this._infowindow = new google.maps.InfoWindow();

    this._selfMarker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      map: this._map,
      icon: {
        anchor: new google.maps.Point(12, 24),
        fillColor: 'rgb(96,125,139)',
        fillOpacity: 0.9,
        strokeWeight: 1,
        scale: 1.6,
        path: 'M19 2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 3.3c1.49 0 2.7 1.21 2.7 2.7 0 1.49-1.21 2.7-2.7 2.7-1.49 0-2.7-1.21-2.7-2.7 0-1.49 1.21-2.7 2.7-2.7zM18 16H6v-.9c0-2 4-3.1 6-3.1s6 1.1 6 3.1v.9z'
      },
      title: 'You are Here'
    });

    this._headingMarker = new google.maps.Marker({
      icon: {
        fillColor: 'rgb(96,125,139)',
        fillOpacity: 0.9,
        strokeWeight: 1,
        scale: 3,
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
      }
    });

    navigator.geolocation.getCurrentPosition(position => {
      this._bounds.extend({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      this.recenter();
    }, () => {}, {enableHighAccuracy: true});

    navigator.geolocation.watchPosition(position => {
      this._selfMarker.setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

      if (position.coords.heading !== null && !isNaN(position.coords.heading)) {
        if (!this._headingMarker.getMap()) {
          this._headingMarker.setMap(this._map);
        }

        this._headingMarker.setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });

        let headingIcon = this._headingMarker.getIcon();
        headingIcon.rotation = position.coords.heading;
        headingIcon.anchor = new google.maps.Point(
          6 * Math.sin(position.coords.heading * (Math.PI / 180)),
          6 * Math.cos(position.coords.heading * (Math.PI / 180)) + 12
        );

        this._headingMarker.setIcon(headingIcon);
      } else {
        this._headingMarker.setMap();
      }
    }, () => {}, {enableHighAccuracy: true});
  },

  resize: function () {
    var center = this._map.getCenter();
    google.maps.event.trigger(this._map, 'resize');
    this._map.setCenter(center);
  },

  recenter: function () {
    this._map.fitBounds(this._bounds);
  },

  rebound: function () {
    this._bounds = new google.maps.LatLngBounds();
    for (let id in this._markers) {
      if (this._markers[id].getMap()) {
        this._bounds.extend(this._markers[id].getPosition());
      }
    }
    var selfPosition = this._selfMarker.getPosition();
    if (selfPosition) {
      this._bounds.extend(selfPosition);
    }
  },

  addRocket: function (id, location) {
    var marker = new google.maps.Marker({
      position: {
        lat: location.latitude,
        lng: location.longitude
      },
      title: id,
      map: this._map,
      icon: {
        anchor: new google.maps.Point(12, 24),
        fillColor: 'rgb(255,82,82)',
        fillOpacity: 0.9,
        strokeWeight: 1,
        scale: 1.8,
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
      }
    });

    marker.addListener('click', () => {
      this._infowindow.setContent(this.getTitle());
      this._infowindow.open(this._map, this);
    });

    this._bounds.extend(marker.getPosition());

    this._markers[id] = marker;
  },

  updateRocket: function (id, location) {
    var marker = this._markers[id];

    marker.setPosition({
      lat: location.latitude,
      lng: location.longitude
    });

    this._bounds.extend(marker.getPosition());
  },

  updateRocketName: function (id, name) {
    if (id in this._markers) {
      this._markers[id].setTitle(name || id);
    }
  },

  highlightRocket: function (id) {
    var marker = this._markers[id];
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation();
    }, 3000);
  },

  hideRocket: function (id) {
    if (id in this._markers) {
      this._markers[id].setMap();
      this.rebound();
    }
  },

  showRocket: function (id) {
    if (id in this._markers) {
      this._markers[id].setMap(this._map);
      this._bounds.extend(this._markers[id].getPosition());
    }
  },

  showAllRockets: function () {
    for (let id in this._markers) {
      if (!this._markers[id].getMap()) {
        this.showRocket(id);
      }
    }
  },

  removeRocket: function (id) {
    if (id in this._markers) {
      this.hideRocket(id);
      delete this._markers[id];
    }
  }
};
