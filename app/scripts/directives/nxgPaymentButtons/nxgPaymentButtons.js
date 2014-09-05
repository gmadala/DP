'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentButtons', function () {
    return {
      scope: {
        type:       '@nxgPaymentButtons', // fee | payment | payoff
        item:       '=',
        onQueue:    '=',
        canPayNow:  '=',
        onCancelScheduledPayment: '&'
      },
      link: function(scope, element, attrs) {
        if (!attrs.onCancelScheduledPayment) {
          // To make sure that if no function is passed in, this value
          // is undefined.
          scope.onCancelScheduledPayment = null;
        }
      },
      controller: function($scope, $dialog, Payments, metric) {
        //set on $rootScope, but for some reason, not available unless explicitly set here
        $scope.metric = metric;

        $scope.paymentInProgress = function() {
          return Payments.paymentInProgress();
        };

        // set internalType based on type and scheduled state
        $scope.$watch('type + item.Scheduled + item.PayPayoffAmount', function () {
          if(!$scope.item) {
            return;
          }

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

          if (!$scope.onQueue) { // if it's not on the queue

            if(p.Scheduled && p.ScheduledPaymentDate) {
              // if it's already scheduled as a payment or payoff, we want to auto-cancel
              // the scheduled payment and add the new payment or payoff.
              $scope.cancelScheduledPayment();
            }

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
            var onQueueAs = Payments.isPaymentOnQueue(p.FloorplanId);

            // Regardless, we still want to remove the original payment.
            Payments.removePaymentFromQueue(p.FloorplanId);

            if(onQueueAs === 'payment' && asPayoff) {
              // we want to switch from payment to payoff
              Payments.addPaymentToQueue(
                p.FloorplanId,
                p.Vin,
                p.StockNumber,
                p.UnitDescription,
                amount,
                p.DueDate,
                true, // this is the asPayoff flag
                principal,
                interest,
                fees,
                collateralProtectionPmt
              );
            } else if (onQueueAs === 'payoff' && !asPayoff) {
              // we want to switch from payoff to payment
              Payments.addPaymentToQueue(
                p.FloorplanId,
                p.Vin,
                p.StockNumber,
                p.UnitDescription,
                amount,
                p.DueDate,
                false, // this is the asPayoff flag
                principal,
                interest,
                fees,
                collateralProtectionPmt
              );
            }
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
                    if($scope.onCancelScheduledPayment !== null) {
                      // we have a custom function we want to run onCancel.
                      $scope.onCancelScheduledPayment();
                    } else {
                      // default onCancel function (payments page)
                      var f = $scope.item;
                      f.Scheduled = false;
                      f.ScheduledDate = null;
                      return f;
                    }
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
