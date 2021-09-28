"use strict";

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