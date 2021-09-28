"use strict";

$(document).ready(function () {
  var $slickReview = $('.js-clinic-slider-wrapper');
  var slickFlag;
  new MediaHandler({
    default: function _default() {
      $slickReview.slick({
        infinite: false,
        swipe: true,
        slidesToScroll: 1,
        dots: false,
        slidesToShow: 1,
        rows: 1,
        mobileFirst: true,
        arrows: false,
        variableWidth: true
      });
      slickFlag = true;
    },
    '(min-width: 768px)': function minWidth768px() {
      if (slickFlag) {
        $slickReview.slick('unslick');
      }

      $('.js-clinic-slider-wrapper').twentytwenty();
    }
  });
});