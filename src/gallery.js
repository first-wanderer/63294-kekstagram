'use strict';

var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  var image = this.galleryContainer.querySelector('.gallery-overlay-image');
  var cross = this.galleryContainer.querySelector('.gallery-overlay-close');
  var likes = this.galleryContainer.querySelector('.likes-count');
  var comments = this.galleryContainer.querySelector('.comments-count');

  var self = this;
  this.photos = [];
  this.numberChosenPhoto = 0;

  this.photoForGallery = function(pictures) {
    self.photos = pictures;
  };

  this.showPhoto = function(numberPhoto) {
    var chosenPhoto = self.photos[numberPhoto];
    var contentImage = new Image();

    contentImage.onload = function(evt) {
      image.src = evt.target.src;
      image.alt = chosenPhoto.date;
      likes.textContent = chosenPhoto.likes;
      comments.textContent = chosenPhoto.comments;
    };

    contentImage.onerror = function() {
      self.showPhoto(++numberPhoto);
    };

    contentImage.src = chosenPhoto.url;
  };

  this.onCloseClickHandler = function() {
    self.closeGallery();
  };

  this.onImageClickHandler = function() {
    self.showPhoto(++self.numberChosenPhoto);
  };

  this.onWindowKeydownHandler = function(evt) {
    if (!self.galleryContainer.classList.contains('invisible') && evt.keyCode === 27) {
      evt.preventDefault();
      self.closeGallery();
    }
  };

  this.showGallery = function(numberPhoto) {
    self.numberChosenPhoto = numberPhoto;

    self.galleryContainer.classList.remove('invisible');
    self.showPhoto(self.numberChosenPhoto);

    cross.addEventListener('click', self.onCloseClickHandler);
    image.addEventListener('click', self.onImageClickHandler);
    window.addEventListener('keydown', self.onWindowKeydownHandler);
  };

  this.closeGallery = function() {
    self.galleryContainer.classList.add('invisible');

    cross.removeEventListener('click', self.onCloseClickHandler);
    image.removeEventListener('click', self.onImageClickHandler);
    window.removeEventListener('keydown', self.onWindowKeydownHandler);
  };
};

module.exports = new Gallery();

