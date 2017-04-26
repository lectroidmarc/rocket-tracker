/**
 *
 */

window.customElements.define('geo-distance', class extends HTMLElement {
  get location () {
    return this._location;
  }

  set location (val) {
    this._location = val;
    this.update();
  }

  constructor () {
    super();
    this.textContent = '---';
  }

  connectedCallback () {
    this.watchId = navigator.geolocation.watchPosition(position => {
      this.source = position.coords;
      this.update();
    }, function () {}, {enableHighAccuracy: true});
  }

  disconnectedCallback () {
    navigator.geolocation.clearWatch(this.watchId);
  }

  haversine (source, dest) {
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

  update () {
    if (this.source && this.location) {
      var distance = this.haversine(this.source, this.location);
      if (distance > 10000) {
        this.textContent = (Math.round(distance / 528.0) / 10).toLocaleString('en-US') + ' mi';
      } else {
        this.textContent = Math.round(distance).toLocaleString('en-US') + ' ft';
      }
    }
  }
});

if (Number.prototype.toRadians === undefined) {
  Number.prototype.toRadians = function () { return this * Math.PI / 180; };
}
