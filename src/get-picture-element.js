'use strict';

var templateElement = document.getElementById('picture-template');
var elementToClone;

/* Проверка наличия шаблона */
if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

/* Запалнение шаблона информацией о фото и изображением для рендеринга */
var getPictureElement = function(data) {
  var element = elementToClone.cloneNode(true);
  var imageInElement = element.querySelector('img');

  element.querySelector('.picture-comments').textContent = data.getComments();
  element.querySelector('.picture-likes').textContent = data.getLikes();

  var contentImage = new Image();

  contentImage.onload = function(evt) {
    imageInElement.src = evt.target.src;
    imageInElement.width = 182;
    imageInElement.height = 182;
    imageInElement.alt = data.getDate();
  };

  contentImage.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  contentImage.src = data.getUrl();

  return element;
};

module.exports = getPictureElement;
