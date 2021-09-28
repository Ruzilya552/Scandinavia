"use strict";

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