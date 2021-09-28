"use strict";

/**
 * Версия для es5
 * Создает массив MediaQueryList и следит за его обновлением
 *
 * @param  {object} queriesList - Объект вида { default: foo, '(min-width: 760px)': bar }
 * @param  {function} func - коллбэк функция, первый параметр которой - текущее значение,
 * а второй - строка с текущим медиа запросом
 */
function MediaHandler(queriesList, func) {
  if (typeof func !== 'function') {
    func = function func(f) {
      if (typeof f === 'function') {
        f();
      }
    };
  }

  var defaultQuery;
  var queryList;
  var defaultValue = queriesList.default;
  var queries = $.extend({}, queriesList);
  delete queries.default;
  defaultQuery = {
    query: 'default',
    value: defaultValue
  };
  queryList = Object.keys(queries).map(function (query) {
    var value = queries[query];
    return {
      list: window.matchMedia(query),
      value: value,
      query: query
    };
  });
  queryList.forEach(function (object) {
    object.list.addListener(setCurrentQuery);
  });
  setCurrentQuery();

  this.destroy = function () {
    queryList.forEach(function (object) {
      object.list.removeListener(setCurrentQuery);
    });
    queryList = null;
  };

  function setCurrentQuery() {
    var current = queryList.filter(function (object) {
      return object.list.matches;
    })[0] || defaultQuery;
    func(current.value, current.query);
  }
}