"use strict";

// ====================
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