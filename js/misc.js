/**
 *
 */

document.querySelector('.show-hidden').onclick = function () {
  var hiddenCells = document.querySelectorAll('main .rockets .mdl-cell.hidden');
  Array.prototype.forEach.call(hiddenCells, function (cell) {
    cell.classList.remove('hidden');
  });

  RocketMap.showAllRockets();
  RocketMap.recenter();
};
