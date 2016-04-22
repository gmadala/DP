'use strict';

angular.module('nextgearWebApp')
  .filter('numeral', function () {
    return function(number, format) {
      // @see http://numeraljs.com/
      return numeral(number).format(format);
    };
  });
