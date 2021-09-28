"use strict";

$(document).ready(function () {
  var catalogLoad = function catalogLoad($this) {
    var url = $this.data('url');
    var link = $this.data('link');
    var $target = $($this.data('target'));
    var title = $this.attr('title'); // var scrollTop = $('.b-news').offset().top + window.overlayScrollbar.scroll().position.y;
    // window.overlayScrollbar.scroll({y: scrollTop});

    $.get(url, {}, function (data) {
      $($target).replaceWith(data);
    });
  };

  $(document).on('click', '.js-nav', function () {
    var $this = $(this);
    catalogLoad($this);
  });
  $('.js-ajax-load').each(function () {
    var $this = $(this);
    var url = $this.data('url');
    var event = $this.data('event');
    $.ajax({
      url: url,
      success: function success(data) {
        $('body').trigger(event, {
          data: data,
          $this: $this
        });
      }
    });
  });
  $('.js-ajax-more').on('click', function () {
    var $this = $(this);
    var url = $this.data('url');
    var event = $this.data('event');
    $.ajax({
      url: url,
      success: function success(data) {
        $('body').trigger(event, {
          data: data,
          $this: $this
        });
      }
    });
  });
});