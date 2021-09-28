"use strict";

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