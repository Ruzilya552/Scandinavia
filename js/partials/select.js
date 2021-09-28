"use strict";

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