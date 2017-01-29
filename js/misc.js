/**
 *
 */

var showToastAlert = function (message) {
  var notification = document.querySelector('.mdl-js-snackbar');
  notification.MaterialSnackbar.showSnackbar({
    message: message
  });
};

var closeDrawer = function () {
  document.querySelector('.mdl-layout__obfuscator.is-visible').click();
};

var sortRockets = function () {
  var rockets = document.querySelector('.rockets');

  Array.prototype.slice.call(rockets.children)
    .map(function (rocket) {
      return rockets.removeChild(rocket);
    })
    .sort(function (a, b) {
      return a.querySelector('.mdl-card__title-text').textContent.localeCompare(b.querySelector('.mdl-card__title-text').textContent);
    })
    .forEach(function (rocket) {
      rockets.appendChild(rocket);
    });
};

var hideRocket = function (rocketId) {
  // Hide the card
  document.getElementById(rocketId).parentNode.classList.add('hidden');
  // Hide the map marker
  RocketMap.hideRocket(rocketId);
  // Show the button to show the hidden things
  document.querySelector('.show-hidden').classList.remove('disabled');
  // Save the fact we're hiding this rocket
  localSetting.pushItem('hiddenItems', rocketId);
};

document.querySelector('.show-hidden').onclick = function () {
  if (!this.classList.contains('disabled')) {
    localSetting.removeItem('hiddenItems');

    var hiddenCells = document.querySelectorAll('main .rockets .mdl-cell.hidden');
    Array.prototype.forEach.call(hiddenCells, function (cell) {
      cell.classList.remove('hidden');
    });

    RocketMap.showAllRockets();
    RocketMap.recenter();

    closeDrawer();
    this.classList.add('disabled');
  }
};
