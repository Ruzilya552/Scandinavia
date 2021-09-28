"use strict";

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