"use strict";

/**
 * Версия для es5
 * Генерирует хлебные крошки.
 *
 * @param  {number} cur - текущая страница
 * @param  {number} end - последняя страница
 */
function generateBreadcrumbs(cur, end) {
  var arr = [1, 2, 3, cur - 1, cur, cur + 1, end - 2, end - 1, end].filter(function (e, i, a) {
    return e > 0 && e <= end && a.indexOf(e) === i;
  }).sort(function (a, b) {
    return a - b;
  });
  var i = -1;
  var diff;
  var ph;

  while (arr[i++ + 1]) {
    diff = arr[i + 1] - arr[i];

    if (diff > 1) {
      ph = diff === 2 ? arr[i] + 1 : '...';
      arr.splice(++i, 0, ph);
    }
  }

  return arr;
}