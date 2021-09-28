"use strict";

$(document).ready(function () {
  var $slickMain = $('.js-main-slider');
  $slickMain.slick({
    infinite: true,
    swipe: true,
    slidesToScroll: 1,
    dots: true,
    slidesToShow: 1,
    rows: 1,
    mobileFirst: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [{
      breakpoint: 1024,
      settings: {
        arrows: true,
        prevArrow: '<span class="b-button b-button--prev b-button--arrow b-button--main-arrow js-prev"><i class="b-icon icon-arrow-prev"></i></span>',
        nextArrow: '<span class="b-button b-button--next b-button--arrow b-button--main-arrow js-next"><i class="b-icon icon-arrow-next"></i></span>'
      }
    }]
  });
});