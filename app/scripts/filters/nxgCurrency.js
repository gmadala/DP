'use strict';

angular.module('nextgearWebApp')
  .filter('nxgCurrency', function () {
    return function(num) {
      if (!angular.isNumber(num)) {
        return '';
      }
      if (num > 999) {
        num = (num / 1000).toFixed(0) + 'k';
      }
      return '$' + num;
    };
  });
