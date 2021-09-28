"use strict";

$(document).ready(function () {
  $('.js-dropdown-trigger').on('click', function () {
    if ($(this).parent().hasClass('shown')) {
      $(this).next().css('display', 'none').parent().removeClass('shown');
    } else {
      $(this).next().css('display', 'block').parent().addClass('shown');
    }
  });
  $('.js-anesthesia-more').on('click', function () {
    $(this).parents('.js-anesthesia').removeClass('hide');
    $(this).hide();
  });
  new MediaHandler({
    default: function _default() {},
    '(max-width: 767px)': function maxWidth767px() {
      showReviewMob();
    },
    '(max-width: 1023px)': function maxWidth1023px() {
      showReview();
    }
  });

  function showReviewMob() {
    $('.js-review-more').on('click', function () {
      $(this).prev('.js-review').addClass('fulled');
      $(this).hide();
    });
  }

  function showReview() {
    $('.js-review').on('click', function () {
      $(this).addClass('fulled');
    });
  }
});