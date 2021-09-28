"use strict";

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