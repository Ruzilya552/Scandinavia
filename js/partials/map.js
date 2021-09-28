"use strict";

$(function () {
  var instance = $('#map');

  if (instance.length > 0) {
    var init = function init() {
      var myMap = new ymaps.Map("map", {
        center: [55.790762, 49.117680],
        zoom: 14
      }, {
        minZoom: 8,
        maxZoom: 18
      });
      var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
        hintContent: 'СКАНДИНАВИЯ'
      }, {
        iconLayout: 'default#image',
        iconImageHref: '/images/inhtml/pin.png',
        iconImageSize: [70, 80],
        iconImageOffset: [-5, -38]
      });
      myMap.geoObjects.add(myPlacemark);
      myMap.behaviors.disable('scrollZoom');
      myMap.controls.remove('rulerControl');
      myMap.controls.remove('typeSelector');
      myMap.controls.remove('searchControl');
    };

    ymaps.ready(init);
  }
});