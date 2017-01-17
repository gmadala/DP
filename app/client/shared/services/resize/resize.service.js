(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('resize', resizeFn);

  resizeFn.$inject = ['$window'];

  function resizeFn($window) {

    function isMobile() {
      return $window.innerWidth < 768;
    }

    return {
      isMobile: isMobile
    };
  }
})();
