// jshint esversion: 6

/**
 *
 */

document.querySelector('.show-hidden').onclick = function () {
  var hiddenCells = document.querySelectorAll('main .rockets .mdl-cell.hidden');
  for (var cell of hiddenCells) {
    cell.classList.remove('hidden');
  }

  RocketMap.showAllRockets();
  RocketMap.recenter();
};
