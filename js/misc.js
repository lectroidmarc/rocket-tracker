/**
 *
 */

var showToastAlert = function (message) {
  var notification = document.querySelector('.mdl-js-snackbar');
  notification.MaterialSnackbar.showSnackbar({
    message: message
  });
};

document.querySelector('.show-hidden').onclick = function () {
  var hiddenCells = document.querySelectorAll('main .rockets .mdl-cell.hidden');
  Array.prototype.forEach.call(hiddenCells, function (cell) {
    cell.classList.remove('hidden');
  });

  RocketMap.showAllRockets();
  RocketMap.recenter();

  document.body.querySelector('.mdl-layout__obfuscator.is-visible').click();
};
