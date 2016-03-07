'use strict';

angular.module('nextgearWebApp')
  .filter('alt', function () {
    return function (input, alternative) {
      alternative = angular.isDefined(alternative) ? alternative : '?';
      if (angular.isDefined(input) && input !== null && input !== '') {
        return input;
      } else {
        return alternative;
      }
    };
  });
