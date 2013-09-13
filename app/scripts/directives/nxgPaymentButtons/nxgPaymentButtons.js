'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentButtons', function () {
    return {
      scope: {
        type:        '@nxgPaymentButtons',
        isAdded:     '=',
        isPayoff:    '=',
        isScheduled: '='
      },
      controller: function($scope) {
        $scope.toggle = function(options) {

          $scope.isAdded = !$scope.isAdded;

          // Delete `isScheduled` if they remove a scheduled payment
          if (!$scope.isAdded) {
            delete $scope.isScheduled;
          }

          // Delete `isPayoff` if they remove a payoff, otherwise set it to true
          if (options && options.payoff) {
            if (!$scope.isAdded) {
              delete $scope.isPayoff;
            } else {
              $scope.isPayoff = true;
            }
          }
        };
      },
      templateUrl: 'scripts/directives/nxgPaymentButtons/nxgPaymentButtons.html'
    };
  });
