// jshint esversion: 6

/**
 *
 */

firebase.database().ref('rockets').on('child_added', function(snapshot) {
  var grid = document.querySelector('main .rockets');

  var cell = document.createElement('div');
  cell.className = 'mdl-cell mdl-cell--4-col';
  grid.appendChild(cell);

  var rocket = snapshot.val();
  var updatedDate = new Date(rocket.time);

  var card = document.createElement('div');
  card.id = snapshot.key;
  card.className = 'mdl-card mdl-shadow--2dp rocket';
  cell.appendChild(card);

  var cardContent = document.querySelector('#rocket-card').content;
  card.appendChild(document.importNode(cardContent, true));

  card.querySelector('.fix').textContent = (rocket.fix) ? 'gps_fixed' : 'gps_not_fixed';
  card.querySelector('.location').textContent = 'Location: ' + rocket.location.latitude.toFixed(4) + ', ' + rocket.location.longitude.toFixed(4);
  card.querySelector('.updated').textContent = 'Last Updated: ' + updatedDate.toLocaleString();

  card.querySelector('h2').oninput = function (e) {
    firebase.database().ref().child('metadata/' + snapshot.key).update({
      name: e.target.textContent
    });
  };
  card.querySelector('geo-distance').location = rocket.location;
  card.querySelector('.show-map').onclick = function () {
    document.querySelector('.mdl-layout__tab-bar a:nth-child(2)').click();
    RocketMap.highlightRocket(snapshot.key);
  };
  card.querySelector('.hide').onclick = function () {
    cell.classList.add('hidden');
    RocketMap.hideRocket(snapshot.key);
  };

  var upgradableButtons = card.querySelectorAll('button.mdl-js-button');
  for (var button of upgradableButtons) {
    componentHandler.upgradeElement(button);
  }
});

firebase.database().ref('rockets').on('child_changed', function(snapshot) {
  var rocket = snapshot.val();
  var card = document.getElementById(snapshot.key);
  var updatedDate = new Date(rocket.time);
  card.querySelector('.fix').textContent = (rocket.fix) ? 'gps_fixed' : 'gps_not_fixed';
  card.querySelector('.location').textContent = 'Location: ' + rocket.location.latitude.toFixed(4) + ', ' + rocket.location.longitude.toFixed(4);
  card.querySelector('.updated').textContent = 'Last Updated: ' + updatedDate.toLocaleString();
});

firebase.database().ref('rockets').on('child_removed', function(snapshot) {
  var card = document.getElementById(snapshot.key);
  card.parentNode().parentNode().remove();
});


firebase.database().ref('metadata').on('child_added', function(snapshot) {
  var card = document.getElementById(snapshot.key);
  card.querySelector('.mdl-card__title-text').textContent = snapshot.val().name;
});

firebase.database().ref('metadata').on('child_changed', function(snapshot) {
  var card = document.getElementById(snapshot.key);
  card.querySelector('.mdl-card__title-text').textContent = snapshot.val().name;
});

firebase.database().ref('metadata').on('child_removed', function(snapshot) {
  var card = document.getElementById(snapshot.key);
  card.querySelector('.mdl-card__title-text').textContent = snapshot.key;
});
