'use strict';

var LoadedPicture = (function() {
  var data = {};

  var LoadPicture = function() {
    this.name = null;
  };

  LoadPicture.prototype.record = function(photoObj, name) {
    this.name = name;
    if (!data[name]) {
      data[name] = photoObj;
    }
    return this;
  };

  LoadPicture.prototype.getUrl = function() {
    return data[this.name].url;
  };

  LoadPicture.prototype.getComments = function() {
    return data[this.name].comments;
  };

  LoadPicture.prototype.getDate = function() {
    return data[this.name].date;
  };

  LoadPicture.prototype.getLikes = function() {
    return data[this.name].likes;
  };

  LoadPicture.prototype.setLikes = function() {
    data[this.name].likes++;
  };

  return LoadPicture;
})();

module.exports = LoadedPicture;
