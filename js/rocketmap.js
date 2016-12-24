/**
 *
 */

var RocketMap = {
  _markers: {},

  init: function (dom_element) {
    var self = this;

    this._map = new google.maps.Map(dom_element, {
      zoom: 20,
      center: {lat: 38.699838, lng: -120.999026}
    });

    google.maps.event.addDomListener(window, 'resize', function() {
      self.resize();
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

    navigator.geolocation.getCurrentPosition(function(position) {
      self._selfMarker.setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      self._bounds.extend({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });

    navigator.geolocation.watchPosition(function (position) {
      self._selfMarker.setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  },

  resize: function () {
    var center = this._map.getCenter();
    google.maps.event.trigger(this._map, 'resize');
    this._map.setCenter(center);
  },

  recenter: function () {
    this._map.fitBounds(this._bounds);
  },

  addRocket: function (id, location) {
    var self = this;

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

    marker.addListener('click', function() {
      self._infowindow.setContent(this.getTitle());
      self._infowindow.open(self._map, this);
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

  removeRocket: function (id) {
    if (id in this._markers) {
      this._markers[id].setMap(null);
      delete this._markers[id];
    }
  }
};
