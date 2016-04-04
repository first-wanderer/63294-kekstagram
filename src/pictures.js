'use strict';

(function() {
  var blockFilters = document.querySelector('.filters');
  blockFilters.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var templateElement = document.getElementById('picture-template');
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    var imageInElement = element.querySelector('img');

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    container.appendChild(element);

    var contentImage = new Image();

    contentImage.onload = function(evt) {
      imageInElement.src = evt.target.src;
      imageInElement.width = 182;
      imageInElement.height = 182;
    };

    contentImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    contentImage.src = data.url;

    return element;
  };


  window.pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });

  blockFilters.classList.remove('hidden');
})();
