'use strict';

var getMessage = function(a, b) {
  var sum = function(arr) {
    return arr.reduce(function(sum, item) {
      return sum + item;
    });
  };

  var square = function(arr1, arr2) {
    return arr1.reduce(function(sum, item, index) {
      return sum + item * arr2[index];
    }, 0);
  };

  if (typeof a === 'boolean') {
    return a ? 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров' : 'Переданное GIF-изображение не анимировано';
  }

  if (typeof a === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
  }

  if (Array.isArray(a)) {
    return Array.isArray(b) ? 'Общая площадь артефактов сжатия: ' + square(a, b) + ' пикселей' : 'Количество красных точек во всех строчках изображения: ' + sum(a);
  }
};
