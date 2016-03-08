(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .filter('list', list);

  list.$inject = [];

  function list() {

    return function (input, separator) {
      separator = separator || ', ';
      if (angular.isArray(input)) {
        return input.join(separator);
      }
      return input;
    };

  }
})();
