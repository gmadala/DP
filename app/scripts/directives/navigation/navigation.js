'use strict';

angular.module('nextgearWebApp')
  .directive('navigation', function() {
      return {
          restrict: 'A',
          templateUrl: "scripts/directives/navigation/navigation.html",
          controller: 'NavigationCtrl'
      };
  })

  .controller('NavigationCtrl', function($scope) {

  });
