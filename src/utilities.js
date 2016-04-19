'use strict';

var DAP = 100;
var windowHeight = window.innerHeight;

module.exports = {
  daysFromBirth: function(day, month) {
    var dateNow = Date.now();
    var birthDay = (new Date()).setMonth(month - 1, day);
    var amountDays = (dateNow - birthDay) / (24 * 60 * 60 * 1000);

    return amountDays < 0 ? amountDays += 365 : amountDays;
  },
  isBottomReached: function(containerGeted) {
    var picturesContainerPosition = containerGeted.getBoundingClientRect();
    return picturesContainerPosition.bottom - windowHeight <= DAP;
  },
  isNextPageAvaible: function(picturesGeted, page, pageSize) {
    return page < Math.floor(picturesGeted.length / pageSize);
  }
};
