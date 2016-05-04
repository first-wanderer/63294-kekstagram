'use strict';

var getPictureElement = require('./get-picture-element');
var inherit = require('./utilities').inherit;
var BaseDOMComponent = require('./base-dom-component');

var Photo = function(data, container) {
  BaseDOMComponent.call(this, data, container);

  this.address = 'photo/' + this.data.getUrl();

  this.updateLike = this.updateLike.bind(this);
};

inherit(BaseDOMComponent, Photo);

Photo.prototype.getElement = function(data) {
  return getPictureElement(data);
};

Photo.prototype.updateLike = function() {
  this.element.querySelector('.picture-likes').textContent = this.data.getLikes();
};


module.exports = Photo;
