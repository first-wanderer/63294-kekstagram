'use strict';

var Gallery = function() {
  this.galleryContainer = document.querySelector('.gallery-overlay');
  this.image = this.galleryContainer.querySelector('.gallery-overlay-image');
  this.cross = this.galleryContainer.querySelector('.gallery-overlay-close');
  this.likes = this.galleryContainer.querySelector('.likes-count');
  this.comments = this.galleryContainer.querySelector('.comments-count');

  this.photos = [];
  this.addressChosenPhoto = '';
  this.numberNextPhoto = 0;
  this.amountPhoto = 0;

  this.photoForGallery = this.photoForGallery.bind(this);

  this.showPhoto = this.showPhoto.bind(this);

  this.onImageClickHandler = this.onImageClickHandler.bind(this);

  this.onWindowKeydownHandler = this.onWindowKeydownHandler.bind(this);

  this.onHashChange = this.onHashChange.bind(this);

  this.restoreFromHash = this.restoreFromHash.bind(this);

  this.showGallery = this.showGallery.bind(this);

  this.closeGallery = this.closeGallery.bind(this);

  window.addEventListener('hashchange', this.onHashChange);
};

Gallery.prototype.photoForGallery = function(pictures) {
  this.photos = pictures;
  this.amountPhoto = pictures.length;
};

Gallery.prototype.showPhoto = function(parametrPhoto) {
  var chosenPhoto;
  var contentImage = new Image();

  if (typeof parametrPhoto === 'string') {
    this.photos.some(function(item, i) {
      if (item.url === parametrPhoto) {
        parametrPhoto = i;
      }
      return (typeof parametrPhoto === 'number');
    });
  }

  this.numberNextPhoto = parametrPhoto + 1 < this.amountPhoto - 1 ? parametrPhoto + 1 : 0;
  chosenPhoto = this.photos[parametrPhoto];

  contentImage.onload = (function(evt) {
    this.image.src = evt.target.src;
    this.image.alt = chosenPhoto.date;
    this.likes.textContent = chosenPhoto.likes;
    this.comments.textContent = chosenPhoto.comments;
  }).bind(this);

  contentImage.onerror = (function() {
    location.hash = 'photo/' + this.photos[this.numberNextPhoto].url;
  }).bind(this);

  contentImage.src = chosenPhoto.url;
};

Gallery.prototype.onCloseClickHandler = function() {
  location.hash = 'origin';
};

Gallery.prototype.onImageClickHandler = function() {
  location.hash = 'photo/' + this.photos[this.numberNextPhoto].url;
};

Gallery.prototype.onWindowKeydownHandler = function(evt) {
  if (!this.galleryContainer.classList.contains('invisible') && evt.keyCode === 27) {
    evt.preventDefault();
    location.hash = 'origin';
  }
};

Gallery.prototype.onHashChange = function() {
  this.restoreFromHash();
};

Gallery.prototype.restoreFromHash = function() {
  var regPhoto = /#photo\/(\S+)/;
  var photoInAddress = location.hash.match(regPhoto);
  if (photoInAddress) {
    this.showGallery(photoInAddress[1]);
  } else {
    this.closeGallery();
  }
};

Gallery.prototype.showGallery = function(addressPhoto) {
  this.addressChosenPhoto = addressPhoto;

  this.galleryContainer.classList.remove('invisible');
  this.showPhoto(this.addressChosenPhoto);

  this.cross.addEventListener('click', this.onCloseClickHandler);
  this.image.addEventListener('click', this.onImageClickHandler);
  window.addEventListener('keydown', this.onWindowKeydownHandler);
};

Gallery.prototype.closeGallery = function() {
  this.galleryContainer.classList.add('invisible');

  this.cross.removeEventListener('click', this.onCloseClickHandler);
  this.image.removeEventListener('click', this.onImageClickHandler);
  window.removeEventListener('keydown', this.onWindowKeydownHandler);
};

module.exports = new Gallery();

