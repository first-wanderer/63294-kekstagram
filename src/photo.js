'use strict';

var showGallery = require('./gallery').showGallery;
var getPictureElement = require('./get-picture-element');


var Photo = function(data, number, container) {
  this.data = data;
  this.number = number;
  this.element = getPictureElement(data, container);

  this.onPhotoClick = (function(evt) {
    evt.preventDefault();
    showGallery(this.number);
  }).bind(this);

  this.remove = function() {
    this.element.removeEventListener('click', this.onPhotoClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onPhotoClick);
  container.appendChild(this.element);
};

module.exports = Photo;
