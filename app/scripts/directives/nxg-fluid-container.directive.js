(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgFluidContainer', nxgFluidContainer);

  nxgFluidContainer.$inject = ['$rootScope'];

  function nxgFluidContainer($rootScope) {

    return {
      template: '<div class="{{ containerClass }}" ng-transclude></div>',
      restrict: 'A',
      replace: true,
      transclude: true,
      link: function(scope) {
        scope.containerClass = '';

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
          if (toState.data.showNavBar) {
            scope.containerClass = 'container';
          } else {
            // we're on a public page, we need a blue background
            scope.containerClass = 'container-public';
          }
        });
      }
    };

  }
})();
