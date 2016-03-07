'use strict';

angular.module('nextgearWebApp')
  .directive('nxgRequestsSummary', function () {
    return {
      templateUrl: 'scripts/directives/nxg-requests-summary/nxg-requests-summary.html',
      restrict: 'A',
      scope: {
        eligibility: '='
      },
      controller: 'RequestsSummaryCtrl'
    };
  })
  .controller('RequestsSummaryCtrl', function ($scope, $state, TitleReleases, Floorplan) {
    $scope.titleQueue = {
      contents: TitleReleases.getQueue(),
      removeFromQueue: TitleReleases.removeFromQueue
    };

    $scope.getVehicleDescription = Floorplan.getVehicleDescription;

    $scope.navigate = $state.transitionTo;
  });
