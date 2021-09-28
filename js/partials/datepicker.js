"use strict";

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