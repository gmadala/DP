'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentButtons', function () {
    return {
      scope: {
        type:       '@nxgPaymentButtons', // fee | payment | payoff
        item:       '=',
        onQueue:    '=',
        canPayNow:  '='
      },
      controller: function($scope, $dialog, Payments) {

        var prv = {
          cancelLocalScheduledPayment: function(p) {
            p.Scheduled = false;
            p.ScheduleSetupDate = p.ScheduledPaymentDate = null;
            return p;
          }
        };

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
            Payments.addFeeToQueue(
              f.FinancialRecordId,
              f.Vin,
              f.FeeType,
              f.Description,
              f.Balance,
              f.EffectiveDate);
          } else {
            Payments.removeFeeFromQueue(f.FinancialRecordId);
          }
        };

        $scope.togglePaymentInQueue = function (asPayoff) {
          var p = $scope.item;
          if (!$scope.onQueue) {
            Payments.addPaymentToQueue(
              p.FloorplanId,
              p.Vin,
              p.StockNumber,
              p.UnitDescription,
              asPayoff ? p.CurrentPayoff : p.AmountDue,
              p.DueDate,
              asPayoff);
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
              options: function() {
                return {
                  payment: {
                    floorplanId: $scope.item.FloorplanId,
                    vin: $scope.item.Vin,
                    description: $scope.item.UnitDescription,
                    stockNumber: $scope.item.StockNumber,
                    scheduledDate: $scope.item.ScheduledPaymentDate,
                    isPayOff: $scope.item.PayPayoffAmount,
                    currentPayOff: $scope.item.CurrentPayoff,
                    amountDue: $scope.item.AmountDue
                  },
                  onCancel: function() {
                    prv.cancelLocalScheduledPayment($scope.item);
                  }
                };
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
