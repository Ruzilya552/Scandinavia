"use strict";

$(document).ready(function () {
  $(document).on('click', '.js-play-video', function () {
    var $this = $(this);
    var $video = $this.siblings('.b-clinic-video__iframe');
    var src = $video.attr('src');
    $video.attr('src', src + '?autoplay=1').css("z-index", "1");
    $this.css("visibility", "hidden");
  });
});