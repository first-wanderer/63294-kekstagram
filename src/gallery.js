'use strict';

var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  var image = this.galleryContainer.querySelector('.gallery-overlay-image');
  var cross = this.galleryContainer.querySelector('.gallery-overlay-close');
  var likes = this.galleryContainer.querySelector('.likes-count');
  var comments = this.galleryContainer.querySelector('.comments-count');

  var self = this;
  this.photos = [];
  this.addressChosenPhoto = '';
  this.numberNextPhoto = 0;

  this.photoForGallery = function(pictures) {
    self.photos = pictures;
  };

  this.showPhoto = function(parametrPhoto) {
    var chosenPhoto;
    var contentImage = new Image();

    if (typeof parametrPhoto === 'string') {
      self.photos.some(function(item, i) {
        // parametrPhoto = (item.url === parametrPhoto) ? i;
        if (item.url === parametrPhoto) {
          parametrPhoto = i;
        }
        return (typeof parametrPhoto === 'number');
      });
    }

    this.numberNextPhoto = parametrPhoto + 1;
    chosenPhoto = self.photos[parametrPhoto];

    contentImage.onload = function(evt) {
      image.src = evt.target.src;
      image.alt = chosenPhoto.date;
      likes.textContent = chosenPhoto.likes;
      comments.textContent = chosenPhoto.comments;
    };

    contentImage.onerror = function() {
      location.hash = 'photo/' + self.photos[self.numberNextPhoto].url;
    };

    contentImage.src = chosenPhoto.url;
  };

  this.onCloseClickHandler = function() {
    location.hash = '';
  };

  this.onImageClickHandler = function() {
    location.hash = 'photo/' + self.photos[self.numberNextPhoto].url;
  };

  this.onWindowKeydownHandler = function(evt) {
    if (!self.galleryContainer.classList.contains('invisible') && evt.keyCode === 27) {
      evt.preventDefault();
      location.hash = '';
    }
  };

  this.onHashChange = function() {
    self.restoreFromHash();
  };

  this.restoreFromHash = function() {
    var regPhoto = /#photo\/(\S+)/;
    var photoInAddress = location.hash.match(regPhoto);
    if (photoInAddress) {
      self.showGallery(photoInAddress[1]);
    } else {
      self.closeGallery();
    }
  };

  this.showGallery = function(addressPhoto) {
    self.addressChosenPhoto = addressPhoto;

    self.galleryContainer.classList.remove('invisible');
    self.showPhoto(self.addressChosenPhoto);

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

  window.addEventListener('hashchange', self.onHashChange);
};

module.exports = new Gallery();

