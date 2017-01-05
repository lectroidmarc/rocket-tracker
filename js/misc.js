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

document.querySelector('.show-hidden').onclick = function () {
  if (!this.classList.contains('disabled')) {
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
