'use strict';

angular.module('nextgearWebApp')
  .directive('vehicleDetails', function() {
    return {
      restrict: 'A',
      templateUrl: 'scripts/directives/vehicleDetails/vehicleDetails.html',
      scope: {
        stockNumber: '='
      },
      controller: function($scope, VehicleDetails) {
        $scope.$watch('stockNumber', function() {
          VehicleDetails.getDetails($scope.stockNumber).then(
            function(results) {
              $scope.vehicleDetails = results;
            }
          );

          // TODO: Waiting on service endpoint spec
          /*VehicleDetails.getCurtailmentSchedule($scope.stockNumber).then(
            function(results) {
              $scope.curtailmentSchedule = results;
            }
          );*/
        });
      }
    };
  });
