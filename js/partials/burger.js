"use strict";

function closeBurger() {
  $('.js-burger').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
    $('.js-burger').removeClass('block-animated');
  }).addClass('block-animated');
  $('.b-burger__inner').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
    $('.b-burger__inner').removeClass('block-animated');
  }).addClass('block-animated');
  $('.js-open-burger').toggleClass('active');
  $('.js-open-inner').removeClass('active');
  $('.b-page-wrapper').toggleClass('no-scroll');
  $('body').toggleClass('flag-menu');
  $('.js-open-inner.active').removeClass('active').next('.b-menu__inner.active').removeClass('active');
}

$(document).ready(function () {
  var body = $(document.body);
  var menu = $('.js-open-burger');
  var openInner = $('.js-open-inner');
  var closeInner = $('.js-close-inner');
  var $page = $('.b-page-wrapper');
  menu.on('click', function () {
    var $this = $(this);
    var menuOpen = menu.hasClass('active');

    if (menuOpen) {
      $('.js-open-inner').removeClass('active').next('.b-menu__inner').removeClass('active');
      closeBurger();
    } else {
      body.removeClass('search-opened');
      body.toggleClass('flag-menu');
      menu.toggleClass('active');
      $('.b-page-wrapper').toggleClass('no-scroll');
      $('.js-burger').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
        $('.js-burger').removeClass('block-animated');
      }).addClass('block-animated');
      $('.js-open-inner.active').removeClass('active');
      $('.b-menu__inner.active').removeClass('active');
    }
  });
  openInner.on('click', function () {
    var $this = $(this);
    var menuInnerOpen = $this.hasClass('active'); // body.toggleClass('flag-menu-inner');
    // $this.toggleClass('active');

    $('.js-open-inner.active').removeClass('active');
    $('.b-menu__inner').removeClass('active');

    if (menuInnerOpen) {
      $('.js-open-inner.active').removeClass('active');
      $('.b-menu__inner').removeClass('active').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
        $('.b-menu__inner.active').removeClass('block-animated');
      }).addClass('block-animated');
    } else {
      $this.toggleClass('active');
      $this.next('.b-menu__inner').addClass('active block-animated');
    }
  });
  closeInner.on('click', function () {
    $('.js-open-inner.active').removeClass('active').next('.b-menu__inner.active').removeClass('active').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
      $('.b-menu__inner.active').removeClass('block-animated');
    }).addClass('block-animated');
  });
  $('.js-burger').on('click', function (e) {
    if (!$('.b-burger__inner').is(e.target) && $('.b-burger__inner').has(e.target).length === 0) {
      closeBurger();
    }
  });
});