'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentButtons', function () {
    return {
      scope: {
        type:        '@nxgPaymentButtons',
        item:        '=',
        queueStatus: '=',
        isScheduled: '=',
        canPayNow:   '='
      },
      controller: function($scope, Payments) {

        $scope.$watch('isScheduled + type', function () {
          if ($scope.isScheduled && $scope.type === 'payment') {
            $scope.type = 'scheduled-payment';
          } else if (!$scope.isScheduled && $scope.type === 'scheduled-payment') {
            $scope.type = 'payment';
          }
        });

        $scope.toggleInQueue = function (asPayoff) {
          if (!$scope.queueStatus) {
            Payments.addToPaymentQueue($scope.item, asPayoff);
          } else {
            Payments.removeFromPaymentQueue($scope.item);
          }
        };

        $scope.cancelScheduled = function () {
          // TODO: Implement this
        };

      },
      templateUrl: 'scripts/directives/nxgPaymentButtons/nxgPaymentButtons.html',
      replace: true
    };
  });
