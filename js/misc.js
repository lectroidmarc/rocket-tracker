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
  var visibleObfuscator = document.querySelector('.mdl-layout__obfuscator.is-visible');
  if (visibleObfuscator) {
    visibleObfuscator.click();
  }
};

var sortRockets = function () {
  var rockets = document.querySelector('.rockets');

  Array.prototype.slice.call(rockets.children)
    .sort(function (a, b) {
      return a.querySelector('.mdl-card__title-text').textContent.localeCompare(b.querySelector('.mdl-card__title-text').textContent);
    })
    .forEach(function (rocket) {
      rockets.appendChild(rocket);
    });
};

document.querySelector('.show-hidden').onclick = function (e) {
  if (!e.currentTarget.classList.contains('disabled')) {
    localSetting.removeItem('hiddenItems');

    var hiddenCells = document.querySelectorAll('main .rockets .mdl-cell.hidden');
    Array.prototype.forEach.call(hiddenCells, function (cell) {
      cell.classList.remove('hidden');
    });

    RocketMap.showAllRockets();
    RocketMap.recenter();

    closeDrawer();
    e.currentTarget.classList.add('disabled');
  }
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('service-worker.js').then(function (registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
