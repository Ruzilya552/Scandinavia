"use strict";

// ====================
// popup.js
// ---------------------
// Открытие попАпа и запрет скрола на body
// ====================
$(document).ready(function () {
  var $page = $('.b-page-wrapper');
  var $popUp = $('.b-popup');
  var $popUpContent = $('.b-popup__content');
  var windowsOS = navigator.userAgent.toLowerCase().indexOf('windows') !== -1;
  $('.js-open-popup').on('popup.onClose', function (event) {
    closePopUp();
  }); // Закрытие попАпов

  function closePopUp() {
    // Проверяем открыт ли попАп
    if ($('.b-popup').hasClass('open')) {
      $('.js-gallery-view').attr('src', '');
      $('body').removeClass('no-scroll no-touch windows');
      $('.b-popup').removeClass('open');
      $('.b-popup').stop().fadeOut(300);
      overlayScrollbarY.update();
      $('.os-scrollbar-vertical').removeClass('disabled');
    }

    $('body').trigger('PopUpclosed');
  }

  $('body').on('closePopUp', closePopUp); // Проверка на наличие скролаа

  function getScroll(scroll, selector) {
    var doc = document;
    var body = doc.body;
    var element = doc.querySelector(selector);
    var client = 'client' + scroll;
    scroll = 'scroll' + scroll;
    return /CSS/.test(doc.compatMode) ? element[client] < element[scroll] : body[client] < body[scroll];
  } // Клик по ссылке открывающей попАп


  $(document).on('click', '.js-open-popup', function () {
    $(this).trigger('popup.onOpen');
  }); // Кастомное событие открытие попАп

  $('.js-open-popup').on('popup.onOpen', function () {
    openPopUp.call(this);
  });

  function openPopUp() {
    // Создаем типа callback
    $(this).trigger('popup.open', [$popUpDate]);
    var $popUpDate = $('.b-popup[data-popup=\'' + $(this).attr('data-popup') + '\']'); // Проверяем есть ли нам что открыть

    if ($popUpDate.length > 0) {
      // Проверяем операционную систему на Win и Скролл
      if (windowsOS && getScroll('Height', '.b-page-wrapper')) {
        $page.addClass('windows');
      } // Закрываем перед открытиме другие


      $popUp.removeClass('open');
      $popUp.fadeOut(300);

      if ($(this).hasClass('js-gallery-preview')) {
        var galleryImgSrc = $(this).children('img').attr('src');
        $('.js-gallery-view').attr('src', galleryImgSrc);
        objectFitImages('.js-image-wrapper');
      } // $page.addClass('no-scroll no-touch');


      $popUpDate.addClass('open');
      $popUpDate.css('display', 'flex').hide().fadeIn(300);
      overlayScrollbarY.sleep(); // console.log('a');

      $('body > .os-scrollbar-vertical').addClass('disabled');
      $('body').addClass('no-scroll'); // $('body').trigger('openPopUp.'+data);
    }
  } // Клик по Закрытию попАпов


  $(document).on('click', '.js-close-popup', function () {
    closePopUp();

    if ($('.js-menu-in-popup-back').length) {
      $('.js-menu-in-popup-back').trigger('click');
    }
  }); // Жмяк по Esc

  $(document).on('keydown', function (event) {
    if (event.keyCode === 27) {
      closePopUp();
    }
  }); // $(document).mouseup(function (e) {
  //     if ($popUp.hasClass('open')) {
  //         // Клик не по Контенту и не его дочкам
  //         if (!$popUpContent.is(e.target)&& $popUpContent.has(e.target).length === 0) {
  //             closePopUp();
  //         }
  //     }
  // });
});