'use strict';

var galleryContainer = document.querySelector('.gallery-overlay');
var image = galleryContainer.querySelector('.gallery-overlay-image');
var cross = galleryContainer.querySelector('.gallery-overlay-close');
var likes = galleryContainer.querySelector('.likes-count');
var comments = galleryContainer.querySelector('.comments-count');

var photos = [];
var numberChosenPhoto = 0;

/* Закрытие галлереи */
var closeGallery = function() {
  galleryContainer.classList.add('invisible');
};

/* Показ галлереи */
var showPhoto = function(numberPhoto) {
  var chosenPhoto = photos[numberPhoto];
  var contentImage = new Image();

  contentImage.onload = function(evt) {
    image.src = evt.target.src;
    image.alt = chosenPhoto.date;
    likes.textContent = chosenPhoto.likes;
    comments.textContent = chosenPhoto.comments;
  };

  contentImage.onerror = function() {
    showPhoto(++numberPhoto);
  };

  contentImage.src = chosenPhoto.url;
};

/* Переключение фото по клику */
image.addEventListener('click', function() {
  showPhoto(++numberChosenPhoto);
});

/* Закрытие галлереи по нажатию на крестик */
cross.addEventListener('click', function() {
  closeGallery();
});


/* Закрытие галлереи на ESC */
window.addEventListener('keydown', function(evt) {
  if (!galleryContainer.classList.contains('invisible') && evt.keyCode === 27) {
    evt.preventDefault();
    closeGallery();
  }
});

module.exports = {
  showGallery: function(numberPhoto) {
    galleryContainer.classList.remove('invisible');
    numberChosenPhoto = numberPhoto;
    showPhoto(numberChosenPhoto);
  },
  photoForGallery: function(pictures) {
    photos = pictures;
  }
};
