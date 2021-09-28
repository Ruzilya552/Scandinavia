"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

$(document).ready(function () {
  var $slickNav = $('.js-slider-article');
  $slickNav.each(function () {
    var _$this$slick;

    var $this = $(this);
    $this.slick((_$this$slick = {
      infinite: false,
      swipe: true,
      slidesToScroll: 1,
      dots: false
    }, _defineProperty(_$this$slick, "slidesToScroll", 1), _defineProperty(_$this$slick, "slidesToShow", 1), _defineProperty(_$this$slick, "rows", 1), _defineProperty(_$this$slick, "mobileFirst", true), _defineProperty(_$this$slick, "appendArrows", $('.b-slider-article__wrap-switch')), _defineProperty(_$this$slick, "prevArrow", '<span class="b-button b-button--prev b-button--arrow"><i class="b-icon icon-arrow-prev"></i></span>'), _defineProperty(_$this$slick, "nextArrow", '<span class="b-button b-button--next b-button--arrow js-next"><i class="b-icon icon-arrow-next"></i></span>'), _defineProperty(_$this$slick, "responsive", [{
      breakpoint: 767,
      settings: {
        slidesToScroll: 3,
        slidesToShow: 3
      }
    }, {
      breakpoint: 1279,
      settings: {
        slidesToScroll: 3,
        slidesToShow: 3
      }
    }]), _$this$slick));
  });
});