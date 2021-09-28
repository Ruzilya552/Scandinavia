"use strict";

$(document).ready(function () {
  var header = $('.js-header'),
      lastScrollTop = 0;
  new MediaHandler({
    default: function _default() {
      header.removeClass('sticky with-search menu-hover');
    },
    '(min-width: 1024px)': function minWidth1024px() {
      $('.os-viewport').on('scroll', function (e) {
        var scrollTop = e.target.scrollTop;

        if (scrollTop > lastScrollTop) {
          if (scrollTop >= 40) {
            header.addClass('sticky');
          }

          if (scrollTop >= 117) {
            header.addClass('with-search').removeClass('init');
          }
        } else {
          if (scrollTop <= 40) {
            header.removeClass('sticky').addClass('init');
          }

          if (scrollTop <= 140) {
            header.removeClass('with-search menu-hover');

            if (scrollMenu) {
              scrollMenu.destroy();
            }
          }
        }

        lastScrollTop = scrollTop;
      });
    }
  });

  function closeBurger() {
    scrollMenu.destroy();
    $('.b-header__menu--secondary').bind('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
      $('.b-header__menu--secondary').removeClass('block-animated');
    }).addClass('block-animated');
  }

  $(document).mouseup(function (e) {
    if (!$('.b-header__menu--secondary').is(e.target) && !$('.js-burger-sticky').is(e.target) && $('.js-burger-sticky').has(e.target).length === 0 && $('.b-header__menu--secondary').has(e.target).length === 0) {
      if (header.hasClass('menu-hover')) {
        closeBurger();
        header.toggleClass('menu-hover');
      }
    }
  });
  $('.js-burger-sticky').on('click', function () {
    if (header.hasClass('menu-hover')) {
      closeBurger();
    } else {
      scrollMenu = OverlayScrollbars(scrollBlock, options);
    }

    header.toggleClass('menu-hover');
  });
});