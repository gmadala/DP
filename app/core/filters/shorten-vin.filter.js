(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .filter('shortenVIN', shortenVIN);

  shortenVIN.$inject = [];

  function shortenVIN() {

    return function (input) {
      if (!angular.isString(input)) {
        return input;
      }

      if (input.length <= 6) {
        return input;
      }

      return '...' + input.slice(-6);
    };

  }
})();
