'use strict';

var showGallery = require('./gallery').showGallery;
var getPictureElement = require('./get-picture-element');

var Photo = function(data, number, container) {
  this.data = data;
  this.number = number;
  this.element = getPictureElement(data, container);

  this.element.addEventListener('click', this.onPhotoClick.bind(this));
  container.appendChild(this.element);
};

Photo.prototype.onPhotoClick = function(evt) {
  evt.preventDefault();
  showGallery(this.number);
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPhotoClick.bind(this));
  this.element.parentNode.removeChild(this.element);
};

module.exports = Photo;
