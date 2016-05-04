'use strict';

var PAGE_SIZE = 12;
var pageNumber = 0;
var renderedPhotos = [];

/* Конструктор изображений */
var Photo = require('./photo');

/* Проверка на достижения нижнего края контейнера */
var isBottomReached = require('./utilities').isBottomReached;

/* Проверка на наличие неотрисованных изображений */
var isNextPageAvaible = require('./utilities').isNextPageAvaible;

/* Рендеринг группы (12 шт.) изображений */
var renderPictures = function(picturesGeted, containerGeted, page) {
  var start = page * PAGE_SIZE;
  var end = start + PAGE_SIZE;

  var container = document.createDocumentFragment();

  picturesGeted.slice(start, end).forEach(function(picture) {
    renderedPhotos.push(new Photo(picture, container));
  });

  containerGeted.appendChild(container);
};

module.exports = {
  render: function(picturesGeted, containerGeted, reset) {
    if (reset) {
      pageNumber = 0;

      renderedPhotos.forEach(function(picture) {
        picture.remove();
      });

      renderedPhotos = [];
    }

    while (isBottomReached(containerGeted) && isNextPageAvaible(picturesGeted, pageNumber, PAGE_SIZE)) {
      renderPictures(picturesGeted, containerGeted, pageNumber++);
    }
  },
  update: function(index) {
    renderedPhotos[index].updateLike();
  }
};
