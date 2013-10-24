'use strict';

angular.module('nextgearWebApp')
  .directive('vehicleDetails', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/nxgVehicleDetails/nxgVehicleDetails.html',
      scope: {
        stockNumber: '=',
        collapse: '='
      },
      controller: function($scope, VehicleDetails, segmentio, metric) {

        // Watch for the directive to be uncollapsed, then, if the data hasn't
        // yet been lazy-loaded, load it via a promise so it can be rendered into
        // the associated view. If we already have the data loaded, do nothing...
        $scope.$watch('collapse', function() {
          if (!$scope.collapse && !$scope.vehicleDetails) {
            VehicleDetails.getDetails($scope.stockNumber).then(
              function(results) {
                $scope.vehicleDetails = results;
              }
            );
            segmentio.track(metric.VIEW_FLOOR_PLAN_DETAILS);
          }
        });
      }
    };
  });
