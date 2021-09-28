"use strict";

/**
 * Версия для es5
 * Следит за классами DOM-объекта и вызывает функцию при изменении набора классов.
 *
 * @param  {DOM-object} el - объект, за которым ведется наблюдение.
 * @param  {function} func - коллбэк функция, первый параметр которой - добавленные классы,
 * а второй - убранные классы
 */
function ClassEvent(el, func) {
  var old;
  var mo = new MutationObserver(callback);
  mo.observe(el, {
    attributes: true,
    attributeOldValue: true
  });
  mo.old = old;
  return mo;

  function callback(mutationsList) {
    var newClass = $.makeArray(el.classList);
    var oldValue = mutationsList[0].oldValue;
    var oldClass = old || (oldValue ? oldValue.split(' ') : []);
    var added = newClass.filter(changed, oldClass);
    var removed = oldClass.filter(changed, newClass);
    func(added, removed, newClass, oldClass);
    old = newClass;
  }

  function changed(e) {
    return this.indexOf(e) < 0;
  }
}

function observeClasses(el, _class, show, reset) {
  var classArray = _class.split(' ');

  show = typeof show === 'function' ? show : function () {};
  reset = typeof reset === 'function' ? reset : function () {};
  return new ClassEvent(el, function (added, removed, all, old) {
    if (classArray.length > 1) {
      if (!test(old, classArray) && test(all, classArray)) {
        show();
      } else if (test(old, classArray) && !test(all, classArray)) {
        reset();
      }
    } else {
      if (test(added, classArray)) {
        show();
      } else if (test(removed, classArray)) {
        reset();
      }
    }
  });

  function test(arr, probe) {
    return probe.every(function (e) {
      return arr.indexOf(e) >= 0;
    });
  }
}