'use strict';

angular.module('nextgearWebApp')
  .filter('nxgCurrency', function () {
    return function(n) {
      if (!angular.isNumber(n)) {
        return '';
      }
      return '$' + (n / 1000).toFixed(0) + 'k';
    };
  });
