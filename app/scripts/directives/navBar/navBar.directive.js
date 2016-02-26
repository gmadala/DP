(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('navBar', navBar);

  function navBar() {

    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/navBar/navBar.html',
      controller: 'NavBarCtrl'
    };

  }
})();
