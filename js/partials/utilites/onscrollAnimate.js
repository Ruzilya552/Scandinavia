"use strict";

var OFFSET = 0.98;
var INSIDE_PATTERNS = ['bebe', 'beeb', 'ebeb', 'ebbe'];
var ANIMATION_CLASS = '.js-on-visible'; // с точкой

var HIDDEN_CLASS = 'animated'; // без точки

var ANIMATION_HIDDEN_CLASS = ANIMATION_CLASS + '.' + HIDDEN_CLASS;
var VIEWPORT_CLASS = '.js-is-visible'; // с точкой

var IN_CLASS = 'in-viewport'; // без точки

var HOLD_CLASS = 'hold-outside-viewport'; // без точки

$(document).ready(function () {
  var thr_checkEdges = throttle(checkEdges, 200);
  var $elements = $(ANIMATION_CLASS + ',' + VIEWPORT_CLASS);

  if ($elements.length) {
    $('body').on('startAnimate', function () {
      $(window).off('scroll', thr_checkEdges);
      setTimeout(function () {
        $('.os-viewport').on('scroll', thr_checkEdges);
      }, 100);
      checkEdges();
      $elements.each(function () {
        observeClasses(this, HOLD_CLASS, checkEdges, checkEdges);
      });
    });
    $(window).on('resize checkEdgesRefresh', checkEdges);
  }

  function checkEdges(inside, outside) {
    var viewportHeight = window.innerHeight;
    var top = OFFSET * viewportHeight;
    var bottom = (1 - OFFSET) * viewportHeight;
    $(ANIMATION_HIDDEN_CLASS).each(function () {
      if (!this.classList.contains(HOLD_CLASS) && test(this)) {
        this.classList.remove(HIDDEN_CLASS);
      }
    });
    top = 0;
    bottom = viewportHeight;
    $(VIEWPORT_CLASS).each(function () {
      this.classList.toggle(IN_CLASS, !this.classList.contains(HOLD_CLASS) && test(this));
    });

    function test(el) {
      var box = el.getBoundingClientRect();
      var pattern = [['b', top], ['b', bottom], ['e', box.top], ['e', box.bottom]].sort(function (a, b) {
        return a[1] - b[1];
      }).map(function (e) {
        return e[0];
      }).join('');
      return INSIDE_PATTERNS.indexOf(pattern) >= 0;
    }
  }
});

function throttle(func, ms) {
  var isThrottled = false;
  var savedArgs;
  var savedThis;
  return function () {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    isThrottled = true;
    setTimeout(function () {
      isThrottled = false;
      func.apply(savedThis, savedArgs);
      savedArgs = savedThis = null;
    }, ms);
  };
}