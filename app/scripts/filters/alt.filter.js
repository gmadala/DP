(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .filter('alt', alt);

  alt.$inject = [];

  function alt() {

    return function (input, alternative) {
      alternative = angular.isDefined(alternative) ? alternative : '?';
      if (angular.isDefined(input) && input !== null && input !== '') {
        return input;
      } else {
        return alternative;
      }
    };

  }
})();
