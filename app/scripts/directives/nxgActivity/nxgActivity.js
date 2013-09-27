'use strict';

angular.module('nextgearWebApp')
  .directive('nxgActivity', function () {
    return {
      templateUrl: 'scripts/directives/nxgActivity/nxgActivity.html',
      replace: true,
      restrict: 'A',
      scope: true,
      controller: function ($scope, $http, status) {
        $scope.showIndicator = function () {
          return status.isShown() && $http.pendingRequests.length > 0;
        };
      }
    };
  });
