/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

var browserCookies = require('browser-cookies');

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    var x = +resizeX.value;
    var y = +resizeY.value;
    var side = +resizeSize.value;
    var imageWidth = currentResizer._image.naturalWidth;
    var imageHeight = currentResizer._image.naturalHeight;

    if (x + side <= imageWidth && y + side <= imageHeight) {
      resizeFwd.disabled = false;
      resizeMessage.classList.add('invisible');
      return true;
    }

    resizeFwd.disabled = true;
    resizeMessage.classList.remove('invisible');
    return false;
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Поля формы кадрирования изображения.
   * @type {HTMLElement}
   */
  var resizeX = document.getElementById('resize-x');
  var resizeY = document.getElementById('resize-y');
  var resizeSize = document.getElementById('resize-size');
  var resizeFwd = document.getElementById('resize-fwd');
  var resizeMessage = resizeForm.querySelector('.upload-resize-message');

  /**
   * Минимальные значения полей формы кадрирования изображения.
   */
  resizeX.min = 0;
  resizeY.min = 0;
  resizeSize.min = 1;

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Вычисление количества дней прошедшего с последнего дня рождения.
   * @param {number} day
   * @param {number} month
   * @return {number}
   */
  function daysFromBirth(day, month) {
    var dateNow = Date.now();
    var birthDay = (new Date()).setMonth(month - 1, day);
    var amountDays = (dateNow - birthDay) / (24 * 60 * 60 * 1000);

    return amountDays < 0 ? amountDays += 365 : amountDays;
  }

  /**
   * Получение из полей формы выбранного фильтра.
   * @return {string}
   */
  function selectedFilter() {
    return [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.onchange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          resizeX.max = currentResizer._image.naturalWidth;
          resizeY.max = currentResizer._image.naturalHeight;
          resizeSize.max = Math.min(
          currentResizer._image.naturalWidth,
          currentResizer._image.naturalHeight);

          hideMessage();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  };

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.onreset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Валидация формы при изменении введенных значений.
   */
  resizeForm.onchange = function() {
    resizeFormIsValid();
  };

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * Если в куки есть фильтр - показывает ранее использовавшийся фильтр.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var filterCookies = browserCookies.get('filter');

      filterImage.src = currentResizer.exportImage().src;

      if (filterCookies) {
        [].filter.call(filterForm['upload-filter'], function(item) {
          return item.value === filterCookies;
        })[0].checked = true;
      }

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  };

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.onreset = function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    browserCookies.set('filter', selectedFilter(), {
      expires: daysFromBirth(18, 2)
    });

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.onchange = function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter()];
  };

  cleanupResizer();
  updateBackground();
})();
