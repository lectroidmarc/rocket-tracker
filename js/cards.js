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
  card.className = 'mdl-card rocket';
  cell.appendChild(card);

  var cardContent = document.querySelector('#rocket-card').content;
  card.appendChild(document.importNode(cardContent, true));

  var titleText = card.querySelector('.mdl-card__title-text');
  titleText.textContent = snapshot.key;
  titleText.oninput = function (e) {
    if (e.target.textContent !== '') {
      firebase.database().ref().child('metadata/' + snapshot.key).update({
        name: e.target.textContent
      }).catch(function (error) {
        showToastAlert(error.message);
      });
    } else {
      firebase.database().ref().child('metadata/' + snapshot.key).remove().catch(function (error) {
        showToastAlert(error.message);
      });
    }
  };
  titleText.onfocus = function () {
    this.dataOriginalTextContent = this.textContent;
  };
  titleText.onblur = function () {
    if (this.dataOriginalTextContent !== this.textContent) {
      sortRockets();
    }
  };
  titleText.contentEditable = (firebase.auth().currentUser) ? true : false;

  card.querySelector('.fix').textContent = (rocket.fix) ? 'gps_fixed' : 'gps_not_fixed';
  card.querySelector('battery-icon').power_level = rocket.battery;
  if (rocket.location) {
    card.querySelector('.location').textContent = 'Location: ' + rocket.location.latitude.toFixed(5) + ', ' + rocket.location.longitude.toFixed(5);
  }
  card.querySelector('geo-distance').location = rocket.location;
  card.querySelector('.updated').textContent = 'Last Updated: ' + updatedDate.toLocaleString();

  card.querySelector('.show-map').onclick = function () {
    document.querySelector('.mdl-layout__tab-bar a:nth-child(2)').click();
    RocketMap.highlightRocket(snapshot.key);
  };

  card.querySelector('.hide').onclick = function () {
    // Hide the card
    document.getElementById(snapshot.key).parentNode.classList.add('hidden');
    // Hide the map marker
    RocketMap.hideRocket(snapshot.key);
    // Enable the button to re-show the hidden things
    document.querySelector('.show-hidden').classList.remove('disabled');
    // Save the fact we're hiding this rocket
    localSetting.pushItem('hiddenItems', snapshot.key);
  };

  var upgradableButtons = card.querySelectorAll('button.mdl-js-button');
  Array.prototype.forEach.call(upgradableButtons, function (button) {
    componentHandler.upgradeElement(button);
  });

  if (localSetting.containsItem('hiddenItems', snapshot.key)) {
    card.classList.add('hidden');
    document.querySelector('.show-hidden').classList.remove('disabled');
  }
});

firebase.database().ref('rockets').on('child_changed', function(snapshot) {
  var rocket = snapshot.val();
  var card = document.getElementById(snapshot.key);
  var updatedDate = new Date(rocket.time);

  card.querySelector('.fix').textContent = (rocket.fix) ? 'gps_fixed' : 'gps_not_fixed';
  card.querySelector('battery-icon').power_level = rocket.battery;
  if (rocket.location) {
    card.querySelector('.location').textContent = 'Location: ' + rocket.location.latitude.toFixed(5) + ', ' + rocket.location.longitude.toFixed(5);
  }
  card.querySelector('geo-distance').location = rocket.location;
  card.querySelector('.updated').textContent = 'Last Updated: ' + updatedDate.toLocaleString();

  clearTimeout(card.timeout);
  card.classList.add('active', 'mdl-shadow--6dp');
  card.timeout = setTimeout(function () {
    card.classList.remove('active', 'mdl-shadow--6dp');
  }, 6000);
});

firebase.database().ref('rockets').on('child_removed', function(snapshot) {
  var card = document.getElementById(snapshot.key);
  card.parentNode().parentNode().remove();
});


firebase.database().ref('metadata').on('child_added', function(snapshot) {
  var card = document.getElementById(snapshot.key);
  card.querySelector('.mdl-card__title-text').textContent = snapshot.val().name;
  sortRockets();
});

firebase.database().ref('metadata').on('child_changed', function(snapshot) {
  var card = document.getElementById(snapshot.key);
  var titleElement = card.querySelector('.mdl-card__title-text');

  titleElement.textContent = snapshot.val().name;

  if (!titleElement.isSameNode(document.activeElement)) {
    sortRockets();
  }
});

firebase.database().ref('metadata').on('child_removed', function(snapshot) {
  var card = document.getElementById(snapshot.key);
  card.querySelector('.mdl-card__title-text').textContent = snapshot.key;
});
