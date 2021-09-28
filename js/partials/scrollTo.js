"use strict";

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