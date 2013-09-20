'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentButtons', function () {
    return {
      scope: {
        type:       '@nxgPaymentButtons', // fee | payment | payoff
        item:       '=',
        onQueue:  '=',
        canPayNow:  '='
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

        $scope.toggleFeeInQueue = function () {
          var f = $scope.item;
          if (!$scope.onQueue) {
            Payments.addFeeToQueue(f.FinancialRecordId, f.Vin, f.Description, f.Balance);
          } else {
            Payments.removeFeeFromQueue(f.FinancialRecordId);
          }
        };

        $scope.togglePaymentInQueue = function (asPayoff) {
          var p = $scope.item;
          if (!$scope.onQueue) {
            Payments.addToPaymentQueue(p.FloorplanId, p.Vin, p.UnitDescription, asPayoff ? p.CurrentPayoff : p.AmountDue, asPayoff);
          } else {
            Payments.removePaymentFromQueue(p.FloorplanId);
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
