"use strict";

$(document).ready(function () {
  var $slickDoctors = $('.js-doctors-slider');
  $slickDoctors.slick({
    infinite: false,
    swipe: true,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    slidesToShow: 4,
    rows: 1,
    slidesPerRow: 1,
    mobileFirst: false,
    prevArrow: '<span class="b-button b-button--prev b-button--arrow b-button--main-arrow js-prev"><i class="b-icon icon-arrow-prev"></i></span>',
    nextArrow: '<span class="b-button b-button--next b-button--arrow b-button--main-arrow js-next"><i class="b-icon icon-arrow-next"></i></span>',
    responsive: [{
      breakpoint: 1280,
      settings: {
        dots: true,
        arrows: false,
        slidesToShow: 3
      }
    }, {
      breakpoint: 768,
      settings: {
        rows: 2,
        slidesPerRow: 1,
        slidesToShow: 1,
        dots: true,
        arrows: false
      }
    }]
  });
});