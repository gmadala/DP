'use strict';

angular.module('nextgearWebApp')
  .filter('list', function () {
    return function (input, separator) {
      separator = separator || ', ';
      if (angular.isArray(input)) {
        return input.join(separator);
      }
      return input;
    };
  });
