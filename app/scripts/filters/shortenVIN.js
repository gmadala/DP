'use strict';

angular.module('nextgearWebApp')
  .filter('shortenVIN', function () {
    return function (input) {
      return '...' + input.slice(-6);
    };
  });
