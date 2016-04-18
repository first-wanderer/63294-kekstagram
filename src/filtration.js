'use strict';

module.exports = function(picturesGeted, filtration) {
  var picturesToFiltration = picturesGeted.slice(0);

  switch (filtration) {
    case 'filter-discussed':
      picturesToFiltration.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;

    case 'filter-new':
      picturesToFiltration.sort(function(a, b) {
        return b.date.replace(/-/g, '') - a.date.replace(/-/g, '');
      });

      var periodTwoWeek = +new Date(picturesToFiltration[0]['date']) - 14 * 24 * 60 * 60 * 1000;

      picturesToFiltration = picturesToFiltration.filter(function(item) {
        return +new Date(item.date) > periodTwoWeek;
      });
      break;
  }

  return picturesToFiltration;
};
