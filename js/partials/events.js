"use strict";

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
      $this.append("\n                <li class=\"b-directions__item\" data-letter=\"" + letter + "\">\n                    <a class=\"b-directions__link\" href=\"" + link + "\">" + title + "</a>\n                </li>");
    });
    var $alphabet = $('.js-directions-letters ul.b-tab__head').empty();
    $alphabet.append("\n<li class=\"b-tab__head-item\"><a class=\"b-tab__link js-tab-trigger active\" href=\"javascript:void(0);\" data-tab=\"all\">\u0412\u0441\u0435</a>\n                </li>\n            ");
    $(Object.values(letters)).each(function () {
      var key = this;
      $alphabet.append("\n                <li class=\"b-tab__head-item\">\n                    <a class=\"b-tab__link js-tab-trigger\" href=\"javascript:void(0);\" data-tab=\"" + key + "\">" + key + "</a>\n                </li>\n            ");
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