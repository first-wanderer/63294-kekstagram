'use strict';

(function() {
  var blockFilters = document.querySelector('.filters');
  blockFilters.classList.add('hidden');

  var PICTURE_LOAD_URL = '//o0.github.io/assets/json/pictures.json';
  var pictures = [];
  var filtrationPictures = [];
  var PAGE_SIZE = 12;
  var pageNumber = 0;
  var DAP = 100;
  var windowHeight = window.innerHeight;

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

    container.appendChild(element);

    return element;
  };

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

  var isBottomReached = function() {
    var picturesContainerPosition = picturesContainer.getBoundingClientRect();
    return picturesContainerPosition.bottom - windowHeight <= DAP;
  };

  var isNextPageAvaible = function(picturesGeted, page, pageSize) {
    return page < Math.floor(picturesGeted.length / pageSize);
  };

  var renderPictures = function(picturesGeted, page) {
    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    var container = document.createDocumentFragment();

    picturesGeted.slice(from, to).forEach(function(picture) {
      getPictureElement(picture, container);
    });

    picturesContainer.appendChild(container);
  };

  var renderNextPages = function(picturesGeted, reset) {
    if (reset) {
      pageNumber = 0;
      picturesContainer.innerHTML = '';
    }

    while (isBottomReached() && isNextPageAvaible(picturesGeted, pageNumber, PAGE_SIZE)) {
      renderPictures(picturesGeted, pageNumber++);
    }
  };

  var getFiltrationPictures = function(picturesGeted, filtration) {
    var picturesToFiltration = picturesGeted.slice(0);

    switch (filtration) {
      case 'filter-discussed':
        picturesToFiltration.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;

      case 'filter-new':
        picturesToFiltration.sort(function(a, b) {
          return b.date.replace(/-/g, '') - a.date.replace(/-/g, '');
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
    filtrationPictures = getFiltrationPictures(pictures, filtration);
    renderNextPages(filtrationPictures, true);
  };

  var setFiltrations = function() {
    blockFilters.onchange = function() {
      var selectedFiltration = [].filter.call(blockFilters['filter'], function(item) {
        return item.checked;
      })[0].id;
      setFiltration(selectedFiltration);
    };
  };

  var setScroll = function() {
    var scrollTimeout;

    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(function() {
        renderNextPages(filtrationPictures);
      }, 100);
    });
  };

  getPicture(function(loadedPictures) {
    pictures = loadedPictures;

    setFiltrations();
    setFiltration('filter-popular');

    setScroll();
  });

  blockFilters.classList.remove('hidden');
})();
