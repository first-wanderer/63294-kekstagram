'use strict';

var PAGE_SIZE = 12;
var pageNumber = 0;
var renderedPhotos = [];

/* Конструктор изображений */
var Photo = require('./photo.js');

/* Проверка на достижения нижнего края контейнера */
var isBottomReached = require('./utilities').isBottomReached;

/* Проверка на наличие неотрисованных изображений */
var isNextPageAvaible = require('./utilities').isNextPageAvaible;

/* Рендеринг группы (12 шт.) изображений */
var renderPictures = function(picturesGeted, containerGeted, page) {
  var start = page * PAGE_SIZE;
  var end = start + PAGE_SIZE;

  var container = document.createDocumentFragment();

  picturesGeted.slice(start, end).forEach(function(picture, number) {
    renderedPhotos.push(new Photo(picture, number, container));
  });

  containerGeted.appendChild(container);
};

module.exports = function(picturesGeted, containerGeted, reset) {
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
};
