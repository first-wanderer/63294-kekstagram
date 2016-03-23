'use strict';
var getMessage = function(a, b) {
  var typeA = typeof a,
      typeB = typeof b,
      message = 'undefined case';

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

  switch (typeA) {
    case 'boolean':
      if (a) {
        message = 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
      } else {
        message = 'Переданное GIF-изображение не анимировано';
      };
      break;
    case 'number':
      message = 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
      break;
    case 'object':
      if (typeB === 'object') {
        message = 'Общая площадь артефактов сжатия: ' + square(a, b) + ' пикселей';
      } else {
        message = 'Количество красных точек во всех строчках изображения: ' + sum(a);
      };
      break;
    default:
      message = 'Некорректное значение статистики';
  };

  return message;
};
