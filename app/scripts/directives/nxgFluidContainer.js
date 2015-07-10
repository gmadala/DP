'use strict';

angular.module('nextgearWebApp')
  .directive('nxgFluidContainer', function ($rootScope) {
    return {
      template: '<div class="{{ containerClass }}" ng-transclude></div>',
      restrict: 'A',
      replace: true,
      transclude: true,
      link: function(scope) {
        scope.containerClass = '';

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
          if (toState.showNavBar) {
            scope.containerClass = 'container';
          } else {
            // we're on a public page, we need a blue background
            scope.containerClass = 'container-public';
          }
        });
      }
    };
  });
