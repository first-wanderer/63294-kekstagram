'use strict';

module.exports = (function() {
  var blockFilters = document.querySelector('.filters');
  blockFilters.classList.add('hidden');

  var PICTURE_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
  var pictures = [];
  var filtrationPictures = [];

  var picturesContainer = document.querySelector('.pictures');

  /* Ajax-запрос данных о фото */
  var getPicture = function(callback) {
    var xhr = new XMLHttpRequest();

    picturesContainer.classList.add('pictures-loading');

    xhr.onload = function(evt) {
      picturesContainer.classList.remove('pictures-loading');

      if (xhr.status !== 200) {
        picturesContainer.classList.add('pictures-failure');
      } else {
        var loadedData = JSON.parse(evt.target.response);
        callback(loadedData);
      }
    };

    xhr.onerror = function() {
      picturesContainer.classList.remove('pictures-loading');
      picturesContainer.classList.add('pictures-failure');
    };

    xhr.timeout = 1000;
    xhr.ontimeout = function() {
      picturesContainer.classList.remove('pictures-loading');
      picturesContainer.classList.add('pictures-failure');
    };

    xhr.open('GET', PICTURE_LOAD_URL);
    xhr.send();
  };

  /* Рендеринга изображений по 12 штук */
  var renderNextPages = require('./render');

  /* Фильтрация массива изображений по заданному фильтру */
  var getFiltrationPictures = require('./filtration');

  var photoForGallery = require('./gallery').photoForGallery;

  /* Ререндеринг массива в соответствии с выбранным фильтром */
  var setFiltration = function(filtration) {
    filtrationPictures = getFiltrationPictures(pictures, filtration);
    renderNextPages(filtrationPictures, picturesContainer, true);
    photoForGallery(filtrationPictures);
  };

  /* Установка обработчика событий на контролы управления фильтрацией */
  var setFiltrations = function() {
    blockFilters.addEventListener('change', function() {
      var selectedFiltration = [].filter.call(blockFilters['filter'], function(item) {
        return item.checked;
      })[0].id;
      setFiltration(selectedFiltration);
    });
  };

  /* Установка обработчика скролла для рендеринга изображений при прокрутке */
  var setScroll = function() {
    var scrollTimeout;

    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(function() {
        renderNextPages(filtrationPictures, picturesContainer);
      }, 100);
    });
  };

  /* Исполнение ajax-запроса, первоначальный рендеринг фото,
  * установка необходимых обработчиков событий
  */
  getPicture(function(loadedPictures) {
    pictures = loadedPictures;

    setFiltrations();
    setFiltration('filter-popular');

    setScroll();
  });

  blockFilters.classList.remove('hidden');
})();
