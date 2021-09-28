"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
  function documentReady() {
    /**
     * Версия для es5
     * Создает массив MediaQueryList и следит за его обновлением
     *
     * @param  {object} queriesList - Объект вида { default: foo, '(min-width: 760px)': bar }
     * @param  {function} func - коллбэк функция, первый параметр которой - текущее значение,
     * а второй - строка с текущим медиа запросом
     */
    function MediaHandler(queriesList, func) {
      if (typeof func !== 'function') {
        func = function func(f) {
          if (typeof f === 'function') {
            f();
          }
        };
      }

      var defaultQuery;
      var queryList;
      var defaultValue = queriesList.default;
      var queries = $.extend({}, queriesList);
      delete queries.default;
      defaultQuery = {
        query: 'default',
        value: defaultValue
      };
      queryList = Object.keys(queries).map(function (query) {
        var value = queries[query];
        return {
          list: window.matchMedia(query),
          value: value,
          query: query
        };
      });
      queryList.forEach(function (object) {
        object.list.addListener(setCurrentQuery);
      });
      setCurrentQuery();

      this.destroy = function () {
        queryList.forEach(function (object) {
          object.list.removeListener(setCurrentQuery);
        });
        queryList = null;
      };

      function setCurrentQuery() {
        var current = queryList.filter(function (object) {
          return object.list.matches;
        })[0] || defaultQuery;
        func(current.value, current.query);
      }
    }

    ;
    /**
     * Версия для es5
     * Следит за классами DOM-объекта и вызывает функцию при изменении набора классов.
     *
     * @param  {DOM-object} el - объект, за которым ведется наблюдение.
     * @param  {function} func - коллбэк функция, первый параметр которой - добавленные классы,
     * а второй - убранные классы
     */

    function ClassEvent(el, func) {
      var old;
      var mo = new MutationObserver(callback);
      mo.observe(el, {
        attributes: true,
        attributeOldValue: true
      });
      mo.old = old;
      return mo;

      function callback(mutationsList) {
        var newClass = $.makeArray(el.classList);
        var oldValue = mutationsList[0].oldValue;
        var oldClass = old || (oldValue ? oldValue.split(' ') : []);
        var added = newClass.filter(changed, oldClass);
        var removed = oldClass.filter(changed, newClass);
        func(added, removed, newClass, oldClass);
        old = newClass;
      }

      function changed(e) {
        return this.indexOf(e) < 0;
      }
    }

    function observeClasses(el, _class, show, reset) {
      var classArray = _class.split(' ');

      show = typeof show === 'function' ? show : function () {};
      reset = typeof reset === 'function' ? reset : function () {};
      return new ClassEvent(el, function (added, removed, all, old) {
        if (classArray.length > 1) {
          if (!test(old, classArray) && test(all, classArray)) {
            show();
          } else if (test(old, classArray) && !test(all, classArray)) {
            reset();
          }
        } else {
          if (test(added, classArray)) {
            show();
          } else if (test(removed, classArray)) {
            reset();
          }
        }
      });

      function test(arr, probe) {
        return probe.every(function (e) {
          return arr.indexOf(e) >= 0;
        });
      }
    }

    ;
    /**
     * Версия для es5
     * Устанавливает геттер и сеттер в объект
     */

    function defineSetter(obj, functions) {
      var shadow = {};
      Object.keys(functions).forEach(function (key) {
        if (key in obj) {
          return;
        }

        Object.defineProperty(obj, key, {
          get: function get() {
            return shadow[key];
          },
          set: function set(val) {
            var old = shadow[key];

            if (val !== old) {
              shadow[key] = val;
              functions[key](val, old);
            }
          }
        });
      });
    }

    ;
    /*
    {
        '10% - 20%': function(progress) {},
        '50%': function(progress) {},
    }
     animationstart
    animationend
    */

    function AnimationQueue(list, duration, throttle) {
      var IN_ACTION = 'action';
      var OUT = 'out;';
      var percentRe = new RegExp('([.0-9]+)%', 'gi');
      var secondRe = new RegExp('([.0-9]+)s', 'gi');
      var millisecondRe = new RegExp('([.0-9]+)ms', 'gi');
      var timeStart = null;
      var firedList = [];
      var self = this;
      var stopFlag;
      var frame = 0;
      throttle = throttle || 1;

      if (isNaN(duration)) {
        throw new TypeError('invalid arguments');
      }

      Object.defineProperty(this, 'begin', {
        get: function get() {
          return timeStart;
        }
      });
      Object.defineProperty(this, 'end', {
        get: function get() {
          return timeStart ? timeStart + duration : null;
        }
      });
      Object.defineProperty(this, 'inAction', {
        get: function get() {
          return Boolean(timeStart);
        }
      });

      this.start = function () {
        if (!self.inAction) {
          requestAnimationFrame(step);
        }
      };

      this.stop = function () {
        if (self.inAction) {
          stopFlag = true;
        }
      };

      this.list = Object.keys(list).map(function (key, id) {
        var start;
        var end;
        var timing = key.split('-');
        timing.forEach(function (e, i, arr) {
          var str = e.trim();
          var units = 1;
          units = /([.0-9]+)%/.test(str) ? 0.01 : units;
          units = /([.0-9]+)s/.test(str) ? 1000 / duration : units;
          units = /([.0-9]+)ms/.test(str) ? 1 / duration : units;
          arr[i] = parseFloat(str) * units;
        });
        return {
          id: id,
          start: isNaN(timing[0]) ? -1 : timing[0],
          end: isNaN(timing[1]) ? timing[0] : timing[1],
          func: typeof list[key] === 'function' ? list[key] : function () {}
        };
      });

      function step(timestamp) {
        var progress;
        frame++;

        if (!timeStart && typeof self.animationstart === 'function') {
          self.animationstart.call(self);
        }

        timeStart = timeStart || timestamp;

        if (timestamp <= self.end && !stopFlag) {
          requestAnimationFrame(step);
        } else {
          stopFlag = null;
          timeStart = null;
          firedList = [];
          frame = 0;

          if (typeof self.animationend === 'function') {
            self.animationend.call(self);
          }

          return;
        }

        if (frame % throttle) {
          return;
        }

        progress = map(timestamp, self.begin, self.end, 0, 1);
        self.list.filter(function (e) {
          var inAction = e.start <= progress && progress <= e.end; // одиночный вызов

          if (e.start === e.end && e.start <= progress && !firedList[e.id]) {
            firedList[e.id] = OUT;
            e.func.call(self, 0, 'once');
            return false;
          } // первый вызов


          if (inAction && !firedList[e.id]) {
            firedList[e.id] = IN_ACTION;
            e.func.call(self, 0, 'first');
            return false;
          } // последний вызов


          if (!inAction && firedList[e.id] === IN_ACTION) {
            firedList[e.id] = OUT;
            e.func.call(self, 1, 'last');
          }

          return inAction;
        }).forEach(function (e) {
          e.func.call(self, map(progress, e.start, e.end, 0, 1));
        });
      }
    }

    function map(x, inMin, inMax, outMin, outMax) {
      return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    ;
    var OFFSET = 0.98;
    var INSIDE_PATTERNS = ['bebe', 'beeb', 'ebeb', 'ebbe'];
    var ANIMATION_CLASS = '.js-on-visible'; // с точкой

    var HIDDEN_CLASS = 'animated'; // без точки

    var ANIMATION_HIDDEN_CLASS = ANIMATION_CLASS + '.' + HIDDEN_CLASS;
    var VIEWPORT_CLASS = '.js-is-visible'; // с точкой

    var IN_CLASS = 'in-viewport'; // без точки

    var HOLD_CLASS = 'hold-outside-viewport'; // без точки

    $(document).ready(function () {
      var thr_checkEdges = throttle(checkEdges, 200);
      var $elements = $(ANIMATION_CLASS + ',' + VIEWPORT_CLASS);

      if ($elements.length) {
        $('body').on('startAnimate', function () {
          $(window).off('scroll', thr_checkEdges);
          setTimeout(function () {
            $('.os-viewport').on('scroll', thr_checkEdges);
          }, 100);
          checkEdges();
          $elements.each(function () {
            observeClasses(this, HOLD_CLASS, checkEdges, checkEdges);
          });
        });
        $(window).on('resize checkEdgesRefresh', checkEdges);
      }

      function checkEdges(inside, outside) {
        var viewportHeight = window.innerHeight;
        var top = OFFSET * viewportHeight;
        var bottom = (1 - OFFSET) * viewportHeight;
        $(ANIMATION_HIDDEN_CLASS).each(function () {
          if (!this.classList.contains(HOLD_CLASS) && test(this)) {
            this.classList.remove(HIDDEN_CLASS);
          }
        });
        top = 0;
        bottom = viewportHeight;
        $(VIEWPORT_CLASS).each(function () {
          this.classList.toggle(IN_CLASS, !this.classList.contains(HOLD_CLASS) && test(this));
        });

        function test(el) {
          var box = el.getBoundingClientRect();
          var pattern = [['b', top], ['b', bottom], ['e', box.top], ['e', box.bottom]].sort(function (a, b) {
            return a[1] - b[1];
          }).map(function (e) {
            return e[0];
          }).join('');
          return INSIDE_PATTERNS.indexOf(pattern) >= 0;
        }
      }
    });

    function throttle(func, ms) {
      var isThrottled = false;
      var savedArgs;
      var savedThis;
      return function () {
        if (isThrottled) {
          savedArgs = arguments;
          savedThis = this;
          return;
        }

        isThrottled = true;
        setTimeout(function () {
          isThrottled = false;
          func.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }, ms);
      };
    }

    ; // ====================
    // project: scroll
    // ====================

    var overlayScrollbar;
    var overlayScrollbarY;
    var overlayScrollbarX;
    var scrollBlock = $('.js-scroll-block');
    var scrollMenu;
    var options = {
      overflowBehavior: {
        x: 'hidden',
        y: 'scroll'
      },
      callbacks: {
        onScroll: function onScroll() {
          $('body').trigger('onScroll');
        }
      }
    };
    $('body').on('scrollTop', function () {
      overlayScrollbar.scroll(0);
    });
    var optionsY = {
      className: 'os-theme-light',
      overflowBehavior: {
        x: 'hidden',
        y: 'scroll'
      }
    };
    var optionsX = {
      className: 'os-theme-light',
      overflowBehavior: {
        x: 'scroll',
        y: 'hidden'
      }
    };
    $(document).ready(function () {
      setTimeout(function () {
        overlayScrollbarY = OverlayScrollbars($('.js-scroll'), optionsY);
        overlayScrollbarX = OverlayScrollbars($('.js-horisontal-scroll'), optionsX);
        setTimeout(function () {
          $('body').trigger('startAnimate');
        }, 0);
      }, 0);
    });
    ; // ====================
    // popup.js
    // ---------------------
    // Открытие попАпа и запрет скрола на body
    // ====================

    $(document).ready(function () {
      var $page = $('.b-page-wrapper');
      var $popUp = $('.b-popup');
      var $popUpContent = $('.b-popup__content');
      var windowsOS = navigator.userAgent.toLowerCase().indexOf('windows') !== -1;
      $('.js-open-popup').on('popup.onClose', function (event) {
        closePopUp();
      }); // Закрытие попАпов

      function closePopUp() {
        // Проверяем открыт ли попАп
        if ($('.b-popup').hasClass('open')) {
          $('.js-gallery-view').attr('src', '');
          $('body').removeClass('no-scroll no-touch windows');
          $('.b-popup').removeClass('open');
          $('.b-popup').stop().fadeOut(300);
          overlayScrollbarY.update();
          $('.os-scrollbar-vertical').removeClass('disabled');
        }

        $('body').trigger('PopUpclosed');
      }

      $('body').on('closePopUp', closePopUp); // Проверка на наличие скролаа

      function getScroll(scroll, selector) {
        var doc = document;
        var body = doc.body;
        var element = doc.querySelector(selector);
        var client = 'client' + scroll;
        scroll = 'scroll' + scroll;
        return /CSS/.test(doc.compatMode) ? element[client] < element[scroll] : body[client] < body[scroll];
      } // Клик по ссылке открывающей попАп


      $(document).on('click', '.js-open-popup', function () {
        $(this).trigger('popup.onOpen');
      }); // Кастомное событие открытие попАп

      $('.js-open-popup').on('popup.onOpen', function () {
        openPopUp.call(this);
      });

      function openPopUp() {
        // Создаем типа callback
        $(this).trigger('popup.open', [$popUpDate]);
        var $popUpDate = $('.b-popup[data-popup=\'' + $(this).attr('data-popup') + '\']'); // Проверяем есть ли нам что открыть

        if ($popUpDate.length > 0) {
          // Проверяем операционную систему на Win и Скролл
          if (windowsOS && getScroll('Height', '.b-page-wrapper')) {
            $page.addClass('windows');
          } // Закрываем перед открытиме другие


          $popUp.removeClass('open');
          $popUp.fadeOut(300);

          if ($(this).hasClass('js-gallery-preview')) {
            var galleryImgSrc = $(this).children('img').attr('src');
            $('.js-gallery-view').attr('src', galleryImgSrc);
            objectFitImages('.js-image-wrapper');
          } // $page.addClass('no-scroll no-touch');


          $popUpDate.addClass('open');
          $popUpDate.css('display', 'flex').hide().fadeIn(300);
          overlayScrollbarY.sleep(); // console.log('a');

          $('body > .os-scrollbar-vertical').addClass('disabled');
          $('body').addClass('no-scroll'); // $('body').trigger('openPopUp.'+data);
        }
      } // Клик по Закрытию попАпов


      $(document).on('click', '.js-close-popup', function () {
        closePopUp();

        if ($('.js-menu-in-popup-back').length) {
          $('.js-menu-in-popup-back').trigger('click');
        }
      }); // Жмяк по Esc

      $(document).on('keydown', function (event) {
        if (event.keyCode === 27) {
          closePopUp();
        }
      }); // $(document).mouseup(function (e) {
      //     if ($popUp.hasClass('open')) {
      //         // Клик не по Контенту и не его дочкам
      //         if (!$popUpContent.is(e.target)&& $popUpContent.has(e.target).length === 0) {
      //             closePopUp();
      //         }
      //     }
      // });
    });
    ;

    function isIE() {
      var ua = window.navigator.userAgent; //Check the userAgent property of the window.navigator object

      var msie = ua.indexOf('MSIE '); // IE 10 or older

      var trident = ua.indexOf('Trident/'); //IE 11

      return msie > 0 || trident > 0;
    } //function to show alert if it's IE


    function ShowIEAlert() {
      if (isIE()) {
        $('html').addClass('no-object-fit');
      } else {
        $('html').addClass('object-fit');
      }
    }

    ShowIEAlert();
    var userAgent = window.navigator.userAgent;

    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
      $('html').addClass('ios');
    }

    ;
    $(document).ready(function () {
      $('.js-simple-select').each(function () {
        var $this = $(this);
        var selectPlaceholder = $this.attr('data-placeholder');
        var searchPlaceholder = $this.attr('data-search-placeholder');
        $this.select2({
          placeholder: selectPlaceholder,
          allowClear: true,
          dropdownAutoWidth: true,
          language: {
            noResults: function noResults() {
              return 'Ничего не найдено';
            },
            removeAllItems: function removeAllItems() {
              return 'Удалить все элементы';
            }
          }
        });
        $this.on('select2:open', function () {
          customizeDropdownScrollbar();
          checkInWindow();

          if ($this.parent().hasClass('b-select--search')) {
            $('.select2-dropdown').addClass('select2-searching');
            $('.select2-search__field').attr('placeholder', searchPlaceholder);
          }

          if ($this.parent().hasClass('b-select--with-label')) {
            $('.select2-dropdown').addClass('select2-with-label');
          }

          setTimeout(function () {
            $('.select2-results__option--selected').addClass('selected');
          }, 0);
        });
        $this.on('select2:closing', function () {
          $('.select2-dropdown').removeClass('select2-searching').removeClass('select2-with-label');
        });
        $this.on('select2:select', function () {
          $this.parent().addClass('filled');
        });
        $this.on('select2:unselect select2:clear', function () {
          $this.parent().removeClass('filled');
        });
      });
      var instance;
      $(document).on('keyup', '.select2-search__field', function () {
        customizeDropdownScrollbar();
        checkInWindow();
      });
      $('.js-multi-select').on('select2:open', function () {
        customizeDropdownScrollbar();
        checkInWindow();
      });

      function customizeDropdownScrollbar() {
        setTimeout(function () {
          var count = $('.select2-results__options').find('li').length;

          if (typeof instance !== 'undefined' && count > 1) {
            instance.destroy();
          }

          if (count > 1) {
            instance = $('.select2-results__options').overlayScrollbars({}).overlayScrollbars();
          } else {
            $('.select2-dropdown select2-dropdown--below').overlayScrollbars({}).overlayScrollbars();
          }
        }, 0);
      }

      function checkInWindow() {
        setTimeout(function () {
          var windowHeight = window.innerHeight;
          var selectResultPosition = void 0;
          var selectResultHeight = $('.select2-results__options').find('.os-content').innerHeight();

          if (selectResultHeight > 296) {
            selectResultHeight = 296;
          }

          if ($('.select2-results__options').length) {
            selectResultPosition = $('.select2-results__options').offset().top;
          }

          if (selectResultPosition + selectResultHeight > windowHeight) {
            var newSelectResultHeight = selectResultHeight - (selectResultPosition + selectResultHeight - windowHeight);
            $('.select2-results__options').css('maxHeight', newSelectResultHeight + 'px');
          } else {
            $('.select2-results__options').css('maxHeight', '296px');
          }
        }, 0);
      }

      $('.js-multi-select').each(function () {
        var $this = $(this);
        $this.select2({
          placeholder: '',
          width: '100%',
          multiple: true,
          allowClear: true,
          closeOnSelect: false,
          language: {
            noResults: function noResults() {
              return 'Ничего не найдено';
            },
            removeAllItems: function removeAllItems() {
              return 'Удалить все элементы';
            }
          }
        });
        $this.siblings('.js-select-label').on('click', function () {
          $this.select2('open');
        });
        $this.on('select2:open', function () {
          $('.select2-dropdown').addClass('select2-multiple');
          setTimeout(function () {
            $('.select2-results__option--selected').addClass('selected');
          }, 0);
        });
        $this.on('select2:closing', function () {
          $('.select2-dropdown').removeClass('select2-multiple');
        });
        $this.on('select2:select select2:unselect select2:clear', function () {
          checkSelect($this);
          setTimeout(function () {
            filterSelect($this);
          }, 0);
        });
      });

      function filterSelect($this) {
        var selectValue = $this.val();
        var $target = $($this.data('target'));

        if (selectValue.length) {
          $target.find('[data-type]').hide();
        }

        if (selectValue[0] == '0') $target.find('[data-type]').show();
        selectValue.forEach(function (item) {
          $target.find("[data-type=\"" + item + "\"]").show();
        });
      }

      var oldvalue = [];

      function checkSelect(select) {
        var selectValue = select.val();
        var selectFlag = false;
        var selectOptions = select.parent().find('.select2-selection__choice');
        selectOptions.each(function () {
          if ($(this).find('.select2-selection__choice__display').text().trim() == '') {
            $(this).addClass('empty');
          } else {
            $(this).removeClass('empty');
          }
        }); //если выбрали все специальности

        if (selectValue.indexOf('0') > -1 && oldvalue.indexOf('0') == -1) {
          select.find('[value="0"]').prop("selected", true);
          select.val('0').trigger('change').select2('close').select2('open');
        } else {
          //если выбрали любую специальность
          if (selectValue.length > 1 && selectValue.indexOf('0') > -1) {
            select.find('[value="0"]').prop("selected", false);
            select.val(select.val()).trigger('change').select2('close').select2('open');
          } //если вообще ничего не выбрано


          if (selectValue.length == 0) {
            select.find('[value="0"]').prop("selected", true);
            select.val(select.val()).trigger('change').select2('close').select2('open');
          }
        }

        selectValue = select.val();
        selectValue.forEach(function (item) {
          if (item != '') {
            selectFlag = true;
          }
        });

        if (selectFlag) {
          select.parent().addClass('filled');
        } else {
          select.parent().removeClass('filled');
        }

        var counter = select.siblings('.select2-container').find(".select2-selection__choice").length;

        if (counter == 1) {
          $('.counter').remove();
        } else {
          $('.counter').remove();
          $('.select2-selection__rendered').before('<div class="counter">(' + counter + ')&nbsp;</div>');
        }

        oldvalue = selectValue;
      }

      $('.js-multi-select').each(function () {
        var $select = $(this);
        checkSelect($select);
        $select.select2("close");
      });
      /**
       * работа фильтра отзывов
       */

      $('.js-quote-select').on('change', function () {
        var mobile = window.innerWidth < 768;
        var $wrapper = mobile ? $('[data-popup="review"]') : $('.b-review-wrap__select-desktop');
        var doc = $wrapper.find('[name="doc"]').val();
        var spec = $wrapper.find('[name="spec"]').val();
        var clinic = $('[name="clinic"]').val();
        var filter = '';

        if (doc && doc != '0') {
          filter += "[data-doc=\"" + doc + "\"]";
        }

        if (clinic != '0') {
          filter += "[data-clinic=\"" + clinic + "\"]";
        }

        if (spec && spec != '0') {
          if (Array.isArray(spec)) {
            var base = filter;
            filter = [];
            $(spec).each(function () {
              filter.push(base + ("[data-spec=\"" + this + "\"]"));
            });
            filter = filter.join(',');
          } else {
            filter += "[data-spec=\"" + spec + "\"]";
          }
        }

        $('.b-quote__item').hide();

        if (filter.length) {
          $(filter).show();
        } else {
          $('.b-quote__item').show();
        }

        $('body').trigger('checkEdgesRefresh');
      });
    });
    ;

    function closeBurger() {
      $('.js-burger').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
        $('.js-burger').removeClass('block-animated');
      }).addClass('block-animated');
      $('.b-burger__inner').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
        $('.b-burger__inner').removeClass('block-animated');
      }).addClass('block-animated');
      $('.js-open-burger').toggleClass('active');
      $('.js-open-inner').removeClass('active');
      $('.b-page-wrapper').toggleClass('no-scroll');
      $('body').toggleClass('flag-menu');
      $('.js-open-inner.active').removeClass('active').next('.b-menu__inner.active').removeClass('active');
    }

    $(document).ready(function () {
      var body = $(document.body);
      var menu = $('.js-open-burger');
      var openInner = $('.js-open-inner');
      var closeInner = $('.js-close-inner');
      var $page = $('.b-page-wrapper');
      menu.on('click', function () {
        var $this = $(this);
        var menuOpen = menu.hasClass('active');

        if (menuOpen) {
          $('.js-open-inner').removeClass('active').next('.b-menu__inner').removeClass('active');
          closeBurger();
        } else {
          body.removeClass('search-opened');
          body.toggleClass('flag-menu');
          menu.toggleClass('active');
          $('.b-page-wrapper').toggleClass('no-scroll');
          $('.js-burger').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
            $('.js-burger').removeClass('block-animated');
          }).addClass('block-animated');
          $('.js-open-inner.active').removeClass('active');
          $('.b-menu__inner.active').removeClass('active');
        }
      });
      openInner.on('click', function () {
        var $this = $(this);
        var menuInnerOpen = $this.hasClass('active'); // body.toggleClass('flag-menu-inner');
        // $this.toggleClass('active');

        $('.js-open-inner.active').removeClass('active');
        $('.b-menu__inner').removeClass('active');

        if (menuInnerOpen) {
          $('.js-open-inner.active').removeClass('active');
          $('.b-menu__inner').removeClass('active').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
            $('.b-menu__inner.active').removeClass('block-animated');
          }).addClass('block-animated');
        } else {
          $this.toggleClass('active');
          $this.next('.b-menu__inner').addClass('active block-animated');
        }
      });
      closeInner.on('click', function () {
        $('.js-open-inner.active').removeClass('active').next('.b-menu__inner.active').removeClass('active').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
          $('.b-menu__inner.active').removeClass('block-animated');
        }).addClass('block-animated');
      });
      $('.js-burger').on('click', function (e) {
        if (!$('.b-burger__inner').is(e.target) && $('.b-burger__inner').has(e.target).length === 0) {
          closeBurger();
        }
      });
    });
    ;
    $(document).ready(function () {
      $('.js-tab-trigger').click(function () {
        var tab = $(this).parents('.js-tab');
        var id = $(this).attr('data-tab');
        var content = $('.js-tab-content[data-tab="' + id + '"]');
        tab.find('.js-tab-trigger.active').removeClass('active');
        $(this).addClass('active');
        tab.find('.js-tab-content.active').removeClass('active');
        content.addClass('active');
      });
    });
    ;
    $(function () {
      $('#datepicker').datepicker({
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        dayNamesMin: ['Пн', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
        altFormat: 'dd.mm.yy',
        prevText: '',
        nextText: '',
        gotoCurrent: true,
        showAnim: 'fold',
        altField: '#datepicker',
        minDate: 0,
        showOn: 'both',
        buttonImageOnly: true,
        buttonImage: '/images/inhtml/datepicker.svg',
        onClose: function onClose() {
          $('.hasDatepicker.focus').removeClass('focus');
        }
      });
    });
    $(document).ready(function () {
      $('#datepicker').click(function (event) {
        $('.b-date-input__label, .hasDatepicker').addClass('focus');
      });
      $('[data-popup="appointment"]').on('scroll', function () {
        $('#datepicker').datepicker('hide').trigger('blur');
      });
      $('#datepicker').on('input change clear', function (event) {
        setTimeout(function () {
          var val = $('#datepicker').val();
          var $close = $('#datepicker').siblings('.js-clean-input');

          if (val) {
            var temp = val.split('.');
            var date = temp[1] + '/' + temp[0] + '/' + temp[2];
            $('#datepicker').datepicker('option', 'defaultDate', date).datepicker("setDate", date).datepicker("refresh");
            $close.show();
          } else {
            $('#datepicker').datepicker("setDate", '').datepicker("refresh");
            $close.hide();
          }
        }, 0);
      });
      $('#clear-dates').on('click', function () {
        $dates.datepicker('setDate', null);
      });
    });
    $(window).on('resize', function () {
      setTimeout(function () {
        var windowHeight = window.innerHeight;
        var datepickerModalPosition = $('#ui-datepicker-div').offset().top;
        var datepickerModalHeight = $('#ui-datepicker-div').innerHeight();

        if (datepickerModalPosition + datepickerModalHeight > windowHeight) {
          $('#ui-datepicker-div').css('top', 'auto').css('bottom', '0px');
        }
      }, 200);
    });
    $(document).ready(function () {
      var body = $(document.body);
      var link = $('.js-show-search');
      link.on('click', function () {
        var $this = $(this);
        body.toggleClass('search-opened');

        if (body.hasClass('search-opened')) {
          $('.js-input--header').focus();
        }

        if (body.hasClass('flag-menu')) {
          closeBurger();
        }

        if (body.hasClass('search-opened')) {
          overlayScrollbarY.sleep();
          $('body > .os-scrollbar-vertical').addClass('disabled');
        } else {
          overlayScrollbarY.update();
          $('.os-scrollbar-vertical').removeClass('disabled');
        }
      });
    });
    ;
    $(document).ready(function () {
      var header = $('.js-header'),
          lastScrollTop = 0;
      new MediaHandler({
        default: function _default() {
          header.removeClass('sticky with-search menu-hover');
        },
        '(min-width: 1024px)': function minWidth1024px() {
          $('.os-viewport').on('scroll', function (e) {
            var scrollTop = e.target.scrollTop;

            if (scrollTop > lastScrollTop) {
              if (scrollTop >= 40) {
                header.addClass('sticky');
              }

              if (scrollTop >= 117) {
                header.addClass('with-search').removeClass('init');
              }
            } else {
              if (scrollTop <= 40) {
                header.removeClass('sticky').addClass('init');
              }

              if (scrollTop <= 140) {
                header.removeClass('with-search menu-hover');

                if (scrollMenu) {
                  scrollMenu.destroy();
                }
              }
            }

            lastScrollTop = scrollTop;
          });
        }
      });

      function closeBurger() {
        scrollMenu.destroy();
        $('.b-header__menu--secondary').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
          $('.b-header__menu--secondary').removeClass('block-animated');
        }).addClass('block-animated');
      }

      $(document).mouseup(function (e) {
        if (!$('.b-header__menu--secondary').is(e.target) && !$('.js-burger-sticky').is(e.target) && $('.js-burger-sticky').has(e.target).length === 0 && $('.b-header__menu--secondary').has(e.target).length === 0) {
          if (header.hasClass('menu-hover')) {
            closeBurger();
            header.toggleClass('menu-hover');
          }
        }
      });
      $('.js-burger-sticky').on('click', function () {
        if (header.hasClass('menu-hover')) {
          closeBurger();
        } else {
          scrollMenu = OverlayScrollbars(scrollBlock, options);
        }

        header.toggleClass('menu-hover');
      });
    });
    ;
    $(document).ready(function () {
      var $slickNav = $('.js-slider-article');
      $slickNav.each(function () {
        var _$this$slick;

        var $this = $(this);
        $this.slick((_$this$slick = {
          infinite: false,
          swipe: true,
          slidesToScroll: 1,
          dots: false
        }, _defineProperty(_$this$slick, "slidesToScroll", 1), _defineProperty(_$this$slick, "slidesToShow", 1), _defineProperty(_$this$slick, "rows", 1), _defineProperty(_$this$slick, "mobileFirst", true), _defineProperty(_$this$slick, "appendArrows", $('.b-slider-article__wrap-switch')), _defineProperty(_$this$slick, "prevArrow", '<span class="b-button b-button--prev b-button--arrow"><i class="b-icon icon-arrow-prev"></i></span>'), _defineProperty(_$this$slick, "nextArrow", '<span class="b-button b-button--next b-button--arrow js-next"><i class="b-icon icon-arrow-next"></i></span>'), _defineProperty(_$this$slick, "responsive", [{
          breakpoint: 767,
          settings: {
            slidesToScroll: 3,
            slidesToShow: 3
          }
        }, {
          breakpoint: 1279,
          settings: {
            slidesToScroll: 3,
            slidesToShow: 3
          }
        }]), _$this$slick));
      });
    });
    ;
    $(document).ready(function () {
      var $slickReview = $('.js-review-wrapper');
      var slickFlag;
      new MediaHandler({
        default: function _default() {
          $slickReview.slick({
            infinite: false,
            swipe: true,
            slidesToScroll: 1,
            dots: false,
            slidesToShow: 1,
            rows: 1,
            mobileFirst: true,
            arrows: false,
            variableWidth: true
          });
          slickFlag = true;
        },
        '(min-width: 768px)': function minWidth768px() {
          if (slickFlag) {
            $slickReview.slick('unslick');
          }
        }
      });
    });
    ;
    $(document).ready(function () {
      var $slickMain = $('.js-main-slider');
      $slickMain.slick({
        infinite: true,
        swipe: true,
        slidesToScroll: 1,
        dots: true,
        slidesToShow: 1,
        rows: 1,
        mobileFirst: true,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [{
          breakpoint: 1024,
          settings: {
            arrows: true,
            prevArrow: '<span class="b-button b-button--prev b-button--arrow b-button--main-arrow js-prev"><i class="b-icon icon-arrow-prev"></i></span>',
            nextArrow: '<span class="b-button b-button--next b-button--arrow b-button--main-arrow js-next"><i class="b-icon icon-arrow-next"></i></span>'
          }
        }]
      });
    });
    ;
    $(document).ready(function () {
      var catalogLoad = function catalogLoad($this) {
        var url = $this.data('url');
        var link = $this.data('link');
        var $target = $($this.data('target'));
        var title = $this.attr('title'); // var scrollTop = $('.b-news').offset().top + window.overlayScrollbar.scroll().position.y;
        // window.overlayScrollbar.scroll({y: scrollTop});

        $.get(url, {}, function (data) {
          $($target).replaceWith(data);
        });
      };

      $(document).on('click', '.js-nav', function () {
        var $this = $(this);
        catalogLoad($this);
      });
      $('.js-ajax-load').each(function () {
        var $this = $(this);
        var url = $this.data('url');
        var event = $this.data('event');
        $.ajax({
          url: url,
          success: function success(data) {
            $('body').trigger(event, {
              data: data,
              $this: $this
            });
          }
        });
      });
      $('.js-ajax-more').on('click', function () {
        var $this = $(this);
        var url = $this.data('url');
        var event = $this.data('event');
        $.ajax({
          url: url,
          success: function success(data) {
            $('body').trigger(event, {
              data: data,
              $this: $this
            });
          }
        });
      });
    });
    ;
    $(document).ready(function () {
      $('.b-tel-input__input').click(function (event) {
        $('.b-tel-input__tel-focus, .b-tel-input__input').toggleClass('focus');
      });
    });

    $.fn.setCursorPosition = function (pos) {
      if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
      } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    }; // $('#datepicker').mask('дд.мм.гггг', {placeholder: 'дд.мм.гггг'});


    $('.js-tel-input').click(function () {
      if ($(this).val().trim() == '+7') {
        $(this).setCursorPosition(3);
      } else if ($(this).val().trim() == '+') {
        $(this).mask('+7 999 999 99 99', {
          placeholder: ' ',
          autoclear: false
        });
        $(this).val('+7');
      } else {
        $(this).setCursorPosition($(this).val().trim().length);
      }
    }).mask('+7 999 999 99 99', {
      placeholder: ' ',
      autoclear: false
    });
    $('body').on('inputChange', function (e, customEvent) {
      var ua = navigator.userAgent,
          iPhone = /iphone/i.test(ua);

      if (customEvent.oldVal.trim() == '+7' && (customEvent.keyCode === 8 || customEvent.keyCode === 46 || iPhone && customEvent.keyCode === 127)) {
        $(customEvent.input).val('');
        $(customEvent.input).mask('+9 999 999 99 99', {
          placeholder: ' ',
          autoclear: false
        });
        $(customEvent.input).val('+');
      }
    });
    $(document).ready(function () {
      var maskList = $.masksSort($.masksLoad("/json/phone-codes.json"), ['#'], /[0-9]|#/, "mask");
      var maskOpts = {
        inputmask: {
          definitions: {
            '#': {
              validator: "[0-9]",
              cardinality: 1
            }
          },
          //clearIncomplete: true,
          showMaskOnHover: false,
          autoUnmask: true
        },
        match: /[0-9]/,
        replace: '#',
        list: maskList,
        listKey: "mask",
        onMaskChange: function onMaskChange(maskObj, completed) {
          if (completed) {
            var hint = maskObj.name_ru;

            if (maskObj.desc_ru && maskObj.desc_ru != "") {
              hint += " (" + maskObj.desc_ru + ")";
            }

            $("#descr").html(hint);
          } else {
            $("#descr").html("Маска ввода");
          }

          $(this).attr("placeholder", $(this).inputmask("getemptymask"));
        }
      };
      $('input.js-mask-tel').each(function () {
        var $this = $(this);
        $this.on('change keyup', function () {
          //$this.inputmask("remove");
          $this.inputmasks(maskOpts);
        });
        $this.on('focus', function () {
          var val = $this.val() || 7;
          $this.val(val).trigger('change');
        });
        $this.val(7).trigger('change');
      });
    });
    ;
    $(document).ready(function () {
      $('.js-clean-input').on('click', function () {
        $(this).siblings('.js-input').val('').trigger('clear');
        $(this).parent().removeClass('b-input--filled');
      });
      $('.js-input').on('input', function () {
        if (!$(this).val() == '') {
          $(this).parent().addClass('b-input--filled');
        } else {
          $(this).parent().removeClass('b-input--filled');
        }
      });
      $('input.js-tel-input').on('keydown', function () {
        var newVal;
        var $this = $(this);
        setTimeout(function () {
          newVal = $this.val();

          if (newVal.trim().length > 2) {
            $this.parent().addClass('b-input--filled');
          } else {
            $this.parent().removeClass('b-input--filled');
          }
        }, 100);
      });
    });
    $(document).ready(function () {
      objectFitImages('.js-image-wrapper');
    });
    ;
    $(function () {
      var instance = $('#map');

      if (instance.length > 0) {
        var init = function init() {
          var myMap = new ymaps.Map("map", {
            center: [55.790762, 49.117680],
            zoom: 14
          }, {
            minZoom: 8,
            maxZoom: 18
          });
          var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'СКАНДИНАВИЯ'
          }, {
            iconLayout: 'default#image',
            iconImageHref: '/images/inhtml/pin.png',
            iconImageSize: [70, 80],
            iconImageOffset: [-5, -38]
          });
          myMap.geoObjects.add(myPlacemark);
          myMap.behaviors.disable('scrollZoom');
          myMap.controls.remove('rulerControl');
          myMap.controls.remove('typeSelector');
          myMap.controls.remove('searchControl');
        };

        ymaps.ready(init);
      }
    });
    $(document).ready(function () {
      var $slickReview = $('.js-clinic-slider-wrapper');
      var slickFlag;
      new MediaHandler({
        default: function _default() {
          $slickReview.slick({
            infinite: false,
            swipe: true,
            slidesToScroll: 1,
            dots: false,
            slidesToShow: 1,
            rows: 1,
            mobileFirst: true,
            arrows: false,
            variableWidth: true
          });
          slickFlag = true;
        },
        '(min-width: 768px)': function minWidth768px() {
          if (slickFlag) {
            $slickReview.slick('unslick');
          }

          $('.js-clinic-slider-wrapper').twentytwenty();
        }
      });
    });
    ;
    $(document).ready(function () {
      $('.js-dropdown-trigger').on('click', function () {
        if ($(this).parent().hasClass('shown')) {
          $(this).next().css('display', 'none').parent().removeClass('shown');
        } else {
          $(this).next().css('display', 'block').parent().addClass('shown');
        }
      });
      $('.js-anesthesia-more').on('click', function () {
        $(this).parents('.js-anesthesia').removeClass('hide');
        $(this).hide();
      });
      new MediaHandler({
        default: function _default() {},
        '(max-width: 767px)': function maxWidth767px() {
          showReviewMob();
        },
        '(max-width: 1023px)': function maxWidth1023px() {
          showReview();
        }
      });

      function showReviewMob() {
        $('.js-review-more').on('click', function () {
          $(this).prev('.js-review').addClass('fulled');
          $(this).hide();
        });
      }

      function showReview() {
        $('.js-review').on('click', function () {
          $(this).addClass('fulled');
        });
      }
    });
    ;
    $(document).ready(function () {
      var SETTINGS = {
        ignore: '.ignore, [type="hidden"]'
      };
      $.validator.setDefaults({
        debug: true
      });
      $.extend($.validator.messages, {
        required: "Это обязательное поле",
        email: "Неверный формат данных",
        tel: "Неверный формат данных",
        // url: 'Пожалуйста, введите корректный URL.',
        date: "Пожалуйста, введите корректную дату.",
        number: "Пожалуйста, введите число.",
        // digits: 'Пожалуйста, вводите только цифры.',
        // creditcard: 'Пожалуйста, введите правильный номер кредитной карты.',
        equalTo: "Пароли не совпадают" //maxlength: $.validator.format('Пожалуйста, введите не больше {0} символов.'),
        // minlength: $.validator.format('Пожалуйста, введите не меньше {0} символов.'),
        // rangelength: $.validator.format('Пожалуйста, введите значение длиной от {0} до {1} символов.'),
        // range: $.validator.format('Пожалуйста, введите число от {0} до {1}.'),
        // max: $.validator.format('Пожалуйста, введите число, меньшее или равное {0}.'),
        // min: $.validator.format('Пожалуйста, введите число, большее или равное {0}.')

      });
      $.validator.addMethod("max-length", function (value, element, params) {
        return value.length <= params;
      }, "Введите не более 140 символов");
      $.validator.addMethod("js-tel-input", function (value, element) {
        if (value.trim().length == 16) {
          return true;
        }
      }, "Пожалуйста, введите не менее 12 символов");
      $.validator.addMethod("js-mask-tel", function (value, element, params) {
        return value.indexOf('_') == -1;
      }, "Неверный формат данных");
      $.validator.addMethod("js-valid-text", function (value, element) {
        if (value.trim() != '') {
          return true;
        }
      }, "Неверный формат данных");
      $.validator.addMethod("js-regex", function (value, element) {
        if (value.trim() != '') {
          return this.optional(element) || /^[a-zA-Zа-яА-ЯЁё ]+$/.test(value);
        }
      }, "Только буквы");
      $.validator.addMethod("js-valid-date", function (value, element) {
        var now = new Date();
        var nowDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
        var $result;
        var d_arr = value.split('.');
        var d = new Date(d_arr[2] + '/' + d_arr[1] + '/' + d_arr[0] + ''); // дата в формате 2014/12/31

        if (d_arr[2] != d.getFullYear() || d_arr[1] != d.getMonth() + 1 || d_arr[0] != d.getDate()) {
          $result = false; // неккоректная дата
        } else if (Date.parse(nowDate) <= Date.parse(d)) {
          $result = true;
        } else {
          $result = false; // неккоректная дата
        }

        return this.optional(element) || $result;
      }, "Некорректная дата");
      var checking;
      $.validator.addMethod("js-remote-email", function (value, element) {
        var isSuccess = false;
        $.ajax({
          url: $("[data-remote-email]").data("remote-email"),
          data: {
            value: value
          },
          async: false,
          success: function success(msg) {
            isSuccess = msg;
          }
        });
        return isSuccess;
      }, "E-mail уже занят");
      $.validator.addMethod("js-remote-phone", function (value, element) {
        var isSuccess = false;
        $.ajax({
          url: $(element).data("remote-phone"),
          data: {
            value: value
          },
          async: false,
          success: function success(msg) {
            isSuccess = msg;
          }
        });
        return isSuccess;
      }, "Телефон уже занят");
      $.validator.addMethod("max-message", function (value, element) {
        return this.optional(element) || /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/i.test(value);
      }, "Пароль должен содержать не менее 6 символов, в том числе цифры и буквы латинского алфавита");
      $.validator.addMethod("js-remote-subscribe", function (value, element) {
        var isSuccess = false;
        $.ajax({
          url: $(element).data("remote-subscribe"),
          data: {
            value: value
          },
          async: false,
          success: function success(msg) {
            isSuccess = msg;
          }
        });
        return isSuccess;
      }, "Данный E-mail уже участвует в рассылке");
      $.validator.addMethod("filereqired", function (value, element, params) {
        return $(element).attr("type") === "file" && element.files && element.files.length;
      }, "Файл не добавлен");
      $.validator.addMethod("extension", function (value, element, param) {
        param = typeof param === "string" ? param.replace(/,/g, "|") : "png|jpe?g|gif";

        if ($(element).attr("type") === "file" && element.files && element.files.length) {
          for (var i = 0; i < element.files.length; i++) {
            return this.optional(element) || element.files[i].name.match(new RegExp("\\.(" + param + ")$", "i"));
          }
        }

        return true;
      }, $.validator.format(""));
      $.validator.addMethod("maxsize", function (value, element, param) {
        if (this.optional(element)) {
          return true;
        }

        param = param * 1024;

        if ($(element).attr("type") === "file" && element.files && element.files.length) {
          for (var i = 0; i < element.files.length; i++) {
            return element.files[i].size <= param;
          }
        }

        return true;
      }, "");
      $.validator.addMethod("enter-email", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value) || /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(value);
      }, "Неверный формат данных");
      $("body").on("initValidation", function () {
        $(".js-form-validate").each(function () {
          var $this = $(this);
          var localSettings = {};

          if ($this.hasClass("js-order-unregistered-form")) {
            localSettings = {
              focusInvalid: true,
              errorPlacement: function errorPlacement(error, element) {
                if (element.attr("name") == "simple_order_form[DELIVERY]") {
                  error.insertAfter(".b-ordering__delivery-inner");
                } else {
                  error.insertAfter(element);
                }
              }
            };
          }

          var settings = $.extend(localSettings, SETTINGS);

          if ($this.data("error-selector")) {
            settings.errorLabelContainer = $this.data("error-selector");
          }

          var validator = $this.validate(settings);
          var $remote = $this.find("input.js-remote-subscribe, input.js-remote-user, input.js-remote-phone, input.js-remote-email");
          $remote.on("keydown", function () {
            var $this = $(this);
            $this.addClass("ignore");
          }).on("keyup", function () {
            clearTimeout(checking);

            var _this = this;

            checking = setTimeout(function () {
              $remote.removeClass("ignore");
              validator.element(_this);
            }, 1000);
          });

          if ($this.hasClass("js-order-unregistered-form")) {
            setTimeout(function () {
              validator = $this.validate(settings);
            }, 5000);
          }

          $this.on("reset", function (event) {
            validator.resetForm();
          });
          $this.on("submit", function (event) {
            if (validator.numberOfInvalids() > 0) {
              event.stopImmediatePropagation();
            } else {
              var $form = $this;
              var url = $form.attr("action") || location.href;
              var method = $form.attr("method");
              var event = $form.data("event");
              var formData = new FormData($this[0]);
              $.ajax({
                url: url,
                method: method,
                processData: false,
                contentType: false,
                data: formData,
                success: function success() {
                  var popup = $("div[data-popup~='success']");
                  popup.addClass('open');
                  $this[0].reset();
                },
                error: function error() {
                  var popup = $("div[data-popup~='error']");
                  popup.addClass('open');
                  $this[0].reset();
                }
              });
            }
          });
          $this.find(".js-licence-accept").on("change", function (e) {
            var $button = $this.find('button[type="submit"]');

            if (e.target.checked) {
              $button.removeClass("disabled");
            } else {
              $button.addClass("disabled");
            }
          });
          $this.find(".js-check-form").on("click", function (event) {
            var $that = $(this);

            if (validator.numberOfInvalids()) {
              return;
            }

            validator.form();
            $this.valid();
            setTimeout(function () {
              if (validator.numberOfInvalids() == 0) {
                $that.trigger("popup.onOpen");
              }
            }, 1000);
          });
          $('.js-simple-select').on('select2:select', function () {
            validator.element(this);
          });
        });
      });
      $("body").trigger("initValidation");
    });
    ;
    $(document).ready(function () {
      $(document).on('click', '.js-play-video', function () {
        var $this = $(this);
        var $video = $this.siblings('.b-clinic-video__iframe');
        var src = $video.attr('src');
        $video.attr('src', src + '?autoplay=1').css("z-index", "1");
        $this.css("visibility", "hidden");
      });
    });
    ;
    $(document).ready(function () {
      $('.js-read-more').each(function () {
        var $this = $(this);
        var $content = $this.siblings('.js-content');
        var $title = $this.siblings('.b-ideology__title');
        var titleHeight = $title.length ? $title[0].offsetHeight : 0;
        var offset = titleHeight + $('.b-header__inner').height() + 15;
        var height = $content.height();
        var low = $content.hasClass('b-clinic') ? $content.find('div:first').height() : $content.find('p:first').height();
        $content.css({
          overflow: 'hidden',
          height: low
        });
        $this.on('click', function () {
          $this.toggleClass('hide');

          if ($this.hasClass('hide')) {
            $this.html('Скрыть');
            $content.animate({
              height: height
            });
          } else {
            $this.html('Читать полностью');
            $('.os-viewport').scrollTo($content, 300, {
              offset: -offset
            });
            $content.animate({
              height: low
            });
          }

          return false;
        });
      });
      $('.js-show-more').each(function () {
        var $this = $(this);
        var $content = $this.parent('.js-content');
        var hide = $content.hasClass('hide');

        if (!$content.hasClass('hide')) {
          $content.addClass('hide');
        }

        $this.on('click', function () {
          $content.toggleClass('hide');

          if ($content.hasClass('hide')) {
            $this.html('Показать полностью');
          } else {
            $this.html('Скрыть');
          }

          return false;
        });
      });
    });
    ;
    $(document).ready(function () {
      var offset = $('.b-container').height() + 15;
      $('.js-scroll-to').on('click', function (e) {
        var target = $(this).attr('href');
        e.preventDefault();
        $('.os-viewport').scrollTo(target, 500, {
          offset: 0
        });
      });
    });
    ;
    $(document).ready(function () {
      $('body').on('directions-loaded', function (e, datas) {
        var data = datas.data,
            $this = datas.$this;
        var letters = {};
        $this.empty();
        $(data).each(function () {
          var link = this.link,
              title = this.title;
          var letter = title[0];
          letters[letter] = letter;
          $this.append("\n                        <li class=\"b-directions__item\" data-letter=\"" + letter + "\">\n                            <a class=\"b-directions__link\" href=\"" + link + "\">" + title + "</a>\n                        </li>");
        });
        var $alphabet = $('.js-directions-letters ul.b-tab__head').empty();
        $alphabet.append("\n        <li class=\"b-tab__head-item\"><a class=\"b-tab__link js-tab-trigger active\" href=\"javascript:void(0);\" data-tab=\"all\">\u0412\u0441\u0435</a>\n                        </li>\n                    ");
        $(Object.values(letters)).each(function () {
          var key = this;
          $alphabet.append("\n                        <li class=\"b-tab__head-item\">\n                            <a class=\"b-tab__link js-tab-trigger\" href=\"javascript:void(0);\" data-tab=\"" + key + "\">" + key + "</a>\n                        </li>\n                    ");
        });
        var $triggers = $('.js-directions-letters .js-tab-trigger');
        $triggers.off('click').on('click', function () {
          var $this = $(this);
          var char = $this.data('tab');
          var $directions = $('.js-directions-content').find("[data-letter=\"" + char + "\"]");
          $('.js-directions-content').find("[data-letter]").toggle($directions.length == 0);

          if ($directions.length) {
            $directions.show();
          }

          $triggers.removeClass('active');
          $this.addClass('active');
        });
      });
      $('body').on('management-load-more', function (e, datas) {
        var data = datas.data;
        $('.js-employee').append(data);
      });
      $('body').on('specialists-load-more', function (e, datas) {
        var data = datas.data;
        $('.js-specialists').append(data);
      });
      $('body').on('quote-load', function (e, datas) {
        $('.js-quote-content').html(datas.data);
      });
    });
    ;
    $(document).ready(function () {
      $('.b-menu--innertop').each(function () {
        var $this = $(this);
        var count = $this.children().length; //console.log(count);

        if (count > 18) {
          $this.width(1179);
        } else if (count > 9) {
          $this.width(786);
        } else {
          $this.width(393);
        }
      });
    });
    ;
    $(document).ready(function () {
      var $slickDoctors = $('.js-doctors-slider');
      $slickDoctors.slick({
        infinite: false,
        swipe: true,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        slidesToShow: 4,
        rows: 1,
        slidesPerRow: 1,
        mobileFirst: false,
        prevArrow: '<span class="b-button b-button--prev b-button--arrow b-button--main-arrow js-prev"><i class="b-icon icon-arrow-prev"></i></span>',
        nextArrow: '<span class="b-button b-button--next b-button--arrow b-button--main-arrow js-next"><i class="b-icon icon-arrow-next"></i></span>',
        responsive: [{
          breakpoint: 1280,
          settings: {
            dots: true,
            arrows: false,
            slidesToShow: 3
          }
        }, {
          breakpoint: 768,
          settings: {
            rows: 2,
            slidesPerRow: 1,
            slidesToShow: 1,
            dots: true,
            arrows: false
          }
        }]
      });
    });
    ;
    $(document).ready(function () {
      var $slickReviews = $('.js-direction-review-slider');
      $slickReviews.slick({
        infinite: false,
        swipe: true,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        slidesToShow: 3,
        mobileFirst: false,
        prevArrow: '<span class="b-button b-button--prev b-button--arrow b-button--main-arrow js-prev"><i class="b-icon icon-arrow-prev"></i></span>',
        nextArrow: '<span class="b-button b-button--next b-button--arrow b-button--main-arrow js-next"><i class="b-icon icon-arrow-next"></i></span>',
        responsive: [{
          breakpoint: 1280,
          settings: {
            dots: true,
            arrows: false,
            slidesToShow: 2
          }
        }, {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            dots: true,
            arrows: false
          }
        }]
      });
    });
    ;
  }

  ;
  document.addEventListener("DOMContentLoaded", documentReady);
})();