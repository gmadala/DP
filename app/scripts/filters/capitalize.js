'use strict';

angular.module('nextgearWebApp')
  .filter('capitalize', function() {
    return function(input) {
      if (!angular.isString(input) || input.length === 0) {
        return input;
      }
      return input.charAt(0).toUpperCase() + input.substring(1);
    };
  });
