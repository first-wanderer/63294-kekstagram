'use strict';

var PAGE_SIZE = 12;
var pageNumber = 0;

var templateElement = document.getElementById('picture-template');
var elementToClone;

/* Проверка наличия шаблона */
if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

/* Запалнение шаблона информацией о фото и изображением для рендеринга */
var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  var imageInElement = element.querySelector('img');

  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  var contentImage = new Image();

  contentImage.onload = function(evt) {
    imageInElement.src = evt.target.src;
    imageInElement.width = 182;
    imageInElement.height = 182;
    imageInElement.alt = data.date;
  };

  contentImage.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  contentImage.src = data.url;

  container.appendChild(element);

  return element;
};

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
    getPictureElement(picture, container);
  });

  containerGeted.appendChild(container);
};

module.exports = function(picturesGeted, containerGeted, reset) {
  if (reset) {
    pageNumber = 0;
    containerGeted.innerHTML = '';
  }

  while (isBottomReached(containerGeted) && isNextPageAvaible(picturesGeted, pageNumber, PAGE_SIZE)) {
    renderPictures(picturesGeted, containerGeted, pageNumber++);
  }
};
