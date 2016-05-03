'use strict';

var getPictureElement = require('./get-picture-element');
var inherit = require('./utilities').inherit;
var BaseDOMComponent = require('./base-dom-component');

var Photo = function(data, container) {
  BaseDOMComponent.call(this, data, container);

  this.address = 'photo/' + this.data.getUrl();
};

inherit(BaseDOMComponent, Photo);

Photo.prototype.getElement = function(data) {
  return getPictureElement(data);
};


module.exports = Photo;
