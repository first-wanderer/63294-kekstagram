'use strict';

module.exports = function(picturesGeted, filtration) {
  var picturesToFiltration = picturesGeted.slice(0);

  switch (filtration) {
    case 'filter-discussed':
      picturesToFiltration.sort(function(a, b) {
        return b.getComments() - a.getComments();
      });
      break;

    case 'filter-new':
      picturesToFiltration.sort(function(a, b) {
        return b.getDate().replace(/-/g, '') - a.getDate().replace(/-/g, '');
      });

      var periodTwoWeek = +new Date(picturesToFiltration[0].getDate()) - 14 * 24 * 60 * 60 * 1000;

      picturesToFiltration = picturesToFiltration.filter(function(item) {
        return +new Date(item.getDate()) > periodTwoWeek;
      });
      break;
  }

  return picturesToFiltration;
};
