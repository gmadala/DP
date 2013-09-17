'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentButtons', function () {
    return {
      scope: {
        type:        '@nxgPaymentButtons', // fee | payment | payoff
        item:        '=',
        queueStatus: '=',
        canPayNow:   '='
      },
      controller: function($scope, $dialog, Payments) {

        // set internalType based on type and scheduled state
        $scope.$watch('type + item.Scheduled + item.PayPayoffAmount', function () {
          var result = $scope.type;

          if ($scope.item.Scheduled) {
            if ($scope.item.PayPayoffAmount) {
              result += '-scheduledPayoff';
            } else {
              result += '-scheduledPayment';
            }
          }

          $scope.internalType = result;
        });

        $scope.toggleInQueue = function (asPayoff) {
          if (!$scope.queueStatus) {
            Payments.addToPaymentQueue($scope.item, asPayoff);
          } else {
            Payments.removeFromPaymentQueue($scope.item);
          }
        };

        $scope.cancelScheduled = function () {
          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'views/modals/cancelPayment.html',
            controller: 'CancelPaymentCtrl',
            resolve: {
              payment: function () {
                return $scope.item;
              }
            }
          };

          $dialog.dialog(dialogOptions).open();
        };

      },
      templateUrl: 'scripts/directives/nxgPaymentButtons/nxgPaymentButtons.html',
      replace: true
    };
  });
