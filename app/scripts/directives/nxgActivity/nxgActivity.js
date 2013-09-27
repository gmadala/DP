'use strict';

angular.module('nextgearWebApp')
  .directive('nxgActivity', function (activity) {
    return {
      templateUrl: 'scripts/directives/nxgActivity/nxgActivity.html',
      replace: true,
      restrict: 'A',
      scope: true,
      controller: function ($scope) {
        $scope.activity = activity;
      }
    };
  });
