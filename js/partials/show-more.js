"use strict";

$(document).ready(function () {
  $('.js-read-more').each(function () {
    var $this = $(this);
    var $content = $this.siblings('.js-content');
    var $title = $this.siblings('.b-ideology__title');
    var titleHeight = $title.length ? $title[0].offsetHeight : 0;
    var offset = titleHeight + $('.b-header__inner').height() + 15;
    var height = $content.height();
    var low = $content.hasClass('b-clinic') ? $content.find('div:first').height() : $content.find('p:first').height();
    $content.css({
      overflow: 'hidden',
      height: low
    });
    $this.on('click', function () {
      $this.toggleClass('hide');

      if ($this.hasClass('hide')) {
        $this.html('Скрыть');
        $content.animate({
          height: height
        });
      } else {
        $this.html('Читать полностью');
        $('.os-viewport').scrollTo($content, 300, {
          offset: -offset
        });
        $content.animate({
          height: low
        });
      }

      return false;
    });
  });
  $('.js-show-more').each(function () {
    var $this = $(this);
    var $content = $this.parent('.js-content');
    var hide = $content.hasClass('hide');

    if (!$content.hasClass('hide')) {
      $content.addClass('hide');
    }

    $this.on('click', function () {
      $content.toggleClass('hide');

      if ($content.hasClass('hide')) {
        $this.html('Показать полностью');
      } else {
        $this.html('Скрыть');
      }

      return false;
    });
  });
});