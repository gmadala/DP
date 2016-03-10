(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('navBar', navBar);

  function navBar() {

    return {
      restrict: 'A',
      templateUrl: 'client/shared/directives/navbar/navbar.template.html',
      controller: 'NavBarCtrl'
    };

  }
})();
