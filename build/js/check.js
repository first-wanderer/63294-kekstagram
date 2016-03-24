'use strict';

var getMessage = function(a, b) {
  var sum = function(arr) {
    var sumArr = 0;
    for (var i=0; i<arr.length; i++) {
      sumArr += arr[i];
    };
    return sumArr;
  };

  var square = function(arr1, arr2) {
    var squareArr = 0;
    for (var i=0; i<arr1.length; i++) {
      squareArr += arr1[i] * arr2[i];
    };
    return squareArr;
  };

  if (typeof a === 'boolean') {
    if (a) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      return 'Переданное GIF-изображение не анимировано';
    };
  };

  if (typeof a === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
  };

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return 'Общая площадь артефактов сжатия: ' + square(a, b) + ' пикселей';
    } else {
      return 'Количество красных точек во всех строчках изображения: ' + sum(a);
    };
  };
};
