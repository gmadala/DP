'use strict';

angular.module('nextgearWebApp')
  .filter('ifMissing', function () {
    return function (input, alternative) {
      alternative = angular.isDefined(alternative) ? alternative : '?';
      if (angular.isDefined(input) && input !== null && input !== '') {
        return input;
      } else {
        return alternative;
      }
    };
  });
