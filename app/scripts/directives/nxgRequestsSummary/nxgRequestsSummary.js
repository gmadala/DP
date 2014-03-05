'use strict';

angular.module('nextgearWebApp')
  .directive('nxgRequestsSummary', function () {
    return {
      templateUrl: 'scripts/directives/nxgRequestsSummary/nxgRequestsSummary.html',
      restrict: 'A',
      scope: {},
      controller: 'RequestsSummaryCtrl'
    };
  })
  .controller('RequestsSummaryCtrl', function ($scope, $state) {

    $scope.navigate = $state.transitionTo;
  });
