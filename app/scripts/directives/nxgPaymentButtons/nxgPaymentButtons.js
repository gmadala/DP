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

        // set internalType based on type and scheduled state
        $scope.$watch('type + item.Scheduled + item.PayPayoffAmount', function () {
          var result = $scope.type;

          if ($scope.item.Scheduled && $scope.type !== 'fee') {
            if ($scope.item.CurtailmentPaymentScheduled) {
              result += '-scheduledPayment';
            } else {
              result += '-scheduledPayoff';
            }
          } else if ($scope.item.Scheduled && $scope.type === 'fee') {
            result += '-scheduledFee';
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
          var p = $scope.item,
            amount, principal, fees, interest, collateralProtectionPmt;

          if (asPayoff) {
            amount = p.CurrentPayoff;
            principal = p.PrincipalPayoff;
            fees = p.FeesPayoffTotal;
            interest = p.InterestPayoffTotal;
            collateralProtectionPmt = p.CollateralProtectionPayoffTotal;
          }
          else {
            amount = p.AmountDue;
            principal = p.PrincipalDue;
            fees = p.FeesPaymentTotal;
            interest = p.InterestPaymentTotal;
            collateralProtectionPmt = p.CollateralProtectionPaymentTotal;
          }

          if (!$scope.onQueue) {
            Payments.addPaymentToQueue(
              p.FloorplanId,
              p.Vin,
              p.StockNumber,
              p.UnitDescription,
              amount,
              p.DueDate,
              asPayoff,
              principal,
              interest,
              fees,
              collateralProtectionPmt
            );
          } else {
            Payments.removePaymentFromQueue(p.FloorplanId);
          }
        };

        $scope.cancelScheduledPayment = function () {
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
                    webScheduledPaymentId: $scope.item.WebScheduledPaymentId,
                    vin: $scope.item.Vin,
                    description: $scope.item.UnitDescription,
                    stockNumber: $scope.item.StockNumber,
                    scheduledDate: $scope.item.ScheduledPaymentDate,
                    isPayOff: !$scope.item.CurtailmentPaymentScheduled,
                    currentPayOff: $scope.item.CurrentPayoff,
                    amountDue: $scope.item.AmountDue
                  },
                  onCancel: function() {
                    var p = $scope.item;
                    p.Scheduled = false;
                    p.ScheduleSetupDate = p.ScheduledPaymentDate = null;
                    return p;
                  }
                };
              }
            }
          };
          $dialog.dialog(dialogOptions).open();
        };

        $scope.cancelScheduledFee = function () {
          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'views/modals/cancelFee.html',
            controller: 'CancelFeeCtrl',
            resolve: {
              options: function() {
                return {
                  fee: {
                    webScheduledAccountFeeId: $scope.item.WebScheduledAccountFeeId,
                    financialRecordId: $scope.item.FinancialRecordId,
                    feeType: $scope.item.FeeType,
                    description: $scope.item.Description,
                    scheduledDate: $scope.item.ScheduledDate,
                    balance: $scope.item.Balance
                  },
                  onCancel: function() {
                    var f = $scope.item;
                    f.Scheduled = false;
                    f.ScheduledDate = null;
                    return f;
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
