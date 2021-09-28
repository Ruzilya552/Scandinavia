"use strict";

$(document).ready(function () {
  $('.b-menu--innertop').each(function () {
    var $this = $(this);
    var count = $this.children().length; //console.log(count);

    if (count > 18) {
      $this.width(1179);
    } else if (count > 9) {
      $this.width(786);
    } else {
      $this.width(393);
    }
  });
});