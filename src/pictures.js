'use strict';

(function() {
  var blockFilters = document.querySelector('.filters');
  blockFilters.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var templateElement = document.getElementById('picture-template');
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    var imageInElement = element.querySelector('img');

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    container.appendChild(element);

    var contentImage = new Image();

    contentImage.onload = function(evt) {
      imageInElement.src = evt.target.src;
      imageInElement.width = 182;
      imageInElement.height = 182;
      imageInElement.alt = data.date;
    };

    contentImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    contentImage.src = data.url;

    return element;
  };

  var PICTURE_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
  var pictures = [];

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

  var renderPictures = function(getPictures) {
    picturesContainer.innerHTML = '';

    getPictures.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };

  var getFiltrationPictures = function(getPictures, filtration) {
    var picturesToFiltration = getPictures.slice(0);

    switch (filtration) {
      case 'filter-discussed':
        picturesToFiltration.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;

      case 'filter-new':
        picturesToFiltration.sort(function(a, b) {
          if (a.date < b.date) {
            return 1;
          }
          if (a.date > b.date) {
            return -1;
          }
          return 0;
        });

        var periodTwoWeek = +new Date(picturesToFiltration[0]['date']) - 14 * 24 * 60 * 60 * 1000;

        picturesToFiltration = picturesToFiltration.filter(function(item) {
          return +new Date(item.date) > periodTwoWeek;
        });
        break;
    }

    return picturesToFiltration;
  };

  var setFiltration = function(filtration) {
    var filtrationPictures = getFiltrationPictures(pictures, filtration);
    renderPictures(filtrationPictures);
  };

  getPicture(function(loadedPictures) {
    pictures = loadedPictures;
    renderPictures(pictures);

    blockFilters.onchange = function() {
      var selectedFiltration = [].filter.call(blockFilters['filter'], function(item) {
        return item.checked;
      })[0].id;

      setFiltration(selectedFiltration);
    };
  });

  blockFilters.classList.remove('hidden');
})();
