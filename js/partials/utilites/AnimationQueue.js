"use strict";

/*
{
    '10% - 20%': function(progress) {},
    '50%': function(progress) {},
}

animationstart
animationend
*/
function AnimationQueue(list, duration, throttle) {
  var IN_ACTION = 'action';
  var OUT = 'out;';
  var percentRe = new RegExp('([.0-9]+)%', 'gi');
  var secondRe = new RegExp('([.0-9]+)s', 'gi');
  var millisecondRe = new RegExp('([.0-9]+)ms', 'gi');
  var timeStart = null;
  var firedList = [];
  var self = this;
  var stopFlag;
  var frame = 0;
  throttle = throttle || 1;

  if (isNaN(duration)) {
    throw new TypeError('invalid arguments');
  }

  Object.defineProperty(this, 'begin', {
    get: function get() {
      return timeStart;
    }
  });
  Object.defineProperty(this, 'end', {
    get: function get() {
      return timeStart ? timeStart + duration : null;
    }
  });
  Object.defineProperty(this, 'inAction', {
    get: function get() {
      return Boolean(timeStart);
    }
  });

  this.start = function () {
    if (!self.inAction) {
      requestAnimationFrame(step);
    }
  };

  this.stop = function () {
    if (self.inAction) {
      stopFlag = true;
    }
  };

  this.list = Object.keys(list).map(function (key, id) {
    var start;
    var end;
    var timing = key.split('-');
    timing.forEach(function (e, i, arr) {
      var str = e.trim();
      var units = 1;
      units = /([.0-9]+)%/.test(str) ? 0.01 : units;
      units = /([.0-9]+)s/.test(str) ? 1000 / duration : units;
      units = /([.0-9]+)ms/.test(str) ? 1 / duration : units;
      arr[i] = parseFloat(str) * units;
    });
    return {
      id: id,
      start: isNaN(timing[0]) ? -1 : timing[0],
      end: isNaN(timing[1]) ? timing[0] : timing[1],
      func: typeof list[key] === 'function' ? list[key] : function () {}
    };
  });

  function step(timestamp) {
    var progress;
    frame++;

    if (!timeStart && typeof self.animationstart === 'function') {
      self.animationstart.call(self);
    }

    timeStart = timeStart || timestamp;

    if (timestamp <= self.end && !stopFlag) {
      requestAnimationFrame(step);
    } else {
      stopFlag = null;
      timeStart = null;
      firedList = [];
      frame = 0;

      if (typeof self.animationend === 'function') {
        self.animationend.call(self);
      }

      return;
    }

    if (frame % throttle) {
      return;
    }

    progress = map(timestamp, self.begin, self.end, 0, 1);
    self.list.filter(function (e) {
      var inAction = e.start <= progress && progress <= e.end; // одиночный вызов

      if (e.start === e.end && e.start <= progress && !firedList[e.id]) {
        firedList[e.id] = OUT;
        e.func.call(self, 0, 'once');
        return false;
      } // первый вызов


      if (inAction && !firedList[e.id]) {
        firedList[e.id] = IN_ACTION;
        e.func.call(self, 0, 'first');
        return false;
      } // последний вызов


      if (!inAction && firedList[e.id] === IN_ACTION) {
        firedList[e.id] = OUT;
        e.func.call(self, 1, 'last');
      }

      return inAction;
    }).forEach(function (e) {
      e.func.call(self, map(progress, e.start, e.end, 0, 1));
    });
  }
}

function map(x, inMin, inMax, outMin, outMax) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}