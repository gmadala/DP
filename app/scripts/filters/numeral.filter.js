(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .filter('numeral', numeral);

  numeral.$inject = [];

  function numeral() {

    return function(number, format) {
      // @see http://numeraljs.com/
      return numeral(number).format(format);
    };

  }
})();
