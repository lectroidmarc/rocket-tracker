/**
 *
 */

document.registerElement('geo-distance', {
  prototype: Object.create(HTMLElement.prototype, {
    location: {
      get: function () { return this._location; },
      set: function (val) {
        this._location = val;
        this.update();
      }
    },
    haversine: {
     value: function (source, dest) {
        var R = 20903520; // Earth radius, feet

        var φ1 = source.latitude.toRadians();
        var φ2 = dest.latitude.toRadians();
        var Δφ = (dest.latitude - source.latitude).toRadians();
        var Δλ = (dest.longitude - source.longitude).toRadians();

        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
      }
    },
    update: {
     value: function () {
        if (this.source && this.location) {
          var distance = this.haversine(this.source, this.location);
          this.textContent = Math.round(distance).toLocaleString('en-US') + 'ft';
        }
      }
    },
    createdCallback: {
      value: function () {
        this.textContent = '---';
      }
    },
    attachedCallback: {
      value: function () {
        var self = this;
        navigator.geolocation.watchPosition(function (position) {
          self.source = position.coords;
          self.update();
        });
      }
    }
  })
});

if (Number.prototype.toRadians === undefined) {
  Number.prototype.toRadians = function() { return this * Math.PI / 180; };
}
