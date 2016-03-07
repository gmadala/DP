(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('navBar', navBar);

  function navBar() {

    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/navbar/navbar.html',
      controller: 'NavBarCtrl'
    };
    
  }
})();
