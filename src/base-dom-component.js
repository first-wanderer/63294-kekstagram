'use strict';

var BaseDOMComponent = function(data, container) {
  this.data = data;
  this.element = this.getElement(this.data);

  this.onClick = this.onClick.bind(this);

  this.remove = this.remove.bind(this);

  this.element.addEventListener('click', this.onClick);
  container.appendChild(this.element);
};

BaseDOMComponent.prototype.getElement = function(data) {
  return data.element;
};

BaseDOMComponent.prototype.onClick = function(evt) {
  evt.preventDefault();
  location.hash = this.address || 'origin';
};

BaseDOMComponent.prototype.remove = function() {
  this.element.removeEventListener('click', this.onClick);
  this.element.parentNode.removeChild(this.element);
};

module.exports = BaseDOMComponent;
