/**
 *
 */

var mapElement = document.getElementById('map-view');

RocketMap.init(mapElement);

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    RocketMap.resize();
    RocketMap.recenter();
  });
});

observer.observe(mapElement, {
  attributes: true
});

firebase.database().ref('rockets').on('child_added', function(snapshot) {
  var rocket = snapshot.val();

  if (rocket.location) {
    RocketMap.addRocket(snapshot.key, rocket.location);
  }
});

firebase.database().ref('rockets').on('child_changed', function(snapshot) {
  var rocket = snapshot.val();

  if (rocket.location) {
    RocketMap.updateRocket(snapshot.key, rocket.location);
  }
});

firebase.database().ref('rockets').on('child_removed', function(snapshot) {
  RocketMap.removeRocket(snapshot.key);
});


firebase.database().ref('metadata').on('child_added', function(snapshot) {
  RocketMap.updateRocketName(snapshot.key, snapshot.val().name);
});

firebase.database().ref('metadata').on('child_changed', function(snapshot) {
  RocketMap.updateRocketName(snapshot.key, snapshot.val().name);
});

firebase.database().ref('metadata').on('child_removed', function(snapshot) {
  RocketMap.updateRocketName(snapshot.key);
});


