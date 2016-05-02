'use strict';

var getPictureElement = require('./get-picture-element');


var Photo = function(data, number, container) {
  this.data = data;
  this.number = number;
  this.element = getPictureElement(data, container);

  this.onPhotoClick = this.onPhotoClick.bind(this);

  this.remove = this.remove.bind(this);

  this.element.addEventListener('click', this.onPhotoClick);
  container.appendChild(this.element);
};

Photo.prototype.onPhotoClick = function(evt) {
  evt.preventDefault();
  location.hash = 'photo/' + this.data.url;
};

Photo.prototype.remove = function() {
  this.element.removeEventListener('click', this.onPhotoClick);
  this.element.parentNode.removeChild(this.element);
};

module.exports = Photo;
