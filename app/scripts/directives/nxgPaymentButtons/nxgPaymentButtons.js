'use strict';

angular.module('nextgearWebApp')
  .directive('nxgPaymentButtons', function (gettextCatalog) {
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
      controller: function($scope, $dialog, Payments, PaymentOptions) {

        $scope.paymentInProgress = function() {
          return Payments.paymentInProgress();
        };

        $scope.tooltipText = gettextCatalog.getString('Select the payments you want to make or schedule by adding them to your payment queue.');

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
            Payments.addFeeToQueue(f, true);
          } else {
            Payments.removeFeeFromQueue(f.FinancialRecordId);
          }
        };

        $scope.togglePaymentInQueue = function (asPayoff) {
          var p = $scope.item,
            paymentType = asPayoff ? PaymentOptions.TYPE_PAYOFF : PaymentOptions.TYPE_PAYMENT;

          // onQueue can be: payment, payoff or false
          if ($scope.onQueue) {
            Payments.removePaymentFromQueue(p.FloorplanId);

            if (asPayoff) {
              if ($scope.onQueue === PaymentOptions.TYPE_PAYMENT) {
                Payments.addPayoffToQueue(p, false /* not a scheduled payment object */);
              }
            }
            else if ($scope.onQueue === PaymentOptions.TYPE_PAYOFF) {
              Payments.addPaymentToQueue(p, false /* not a scheduled payment object */);
            }
          }
          else if (p.Scheduled) {
            // if it's already scheduled as a payment or payoff, we want to auto-cancel
            // the scheduled payment and add the new payment or payoff.
            $scope.cancelScheduledPayment().then(function(wasCancelled) {
              if (wasCancelled) {
                Payments.addPaymentTypeToQueue(p, paymentType);
              }
            });
          }
          else {
            Payments.addPaymentTypeToQueue(p, paymentType);
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
                    amountDue: $scope.item.ScheduledPaymentAmount
                  },
                  onCancel: function() {
                    if($scope.onCancelScheduledPayment !== null) {
                      // we have a custom function we want to run onCancel.
                      $scope.onCancelScheduledPayment();
                    }
                    // default onCancel function (payments page)
                    var f = $scope.item;
                    f.Scheduled = false;
                    f.ScheduledDate = null;
                    return f;
                  }
                };
              }
            }
          };
          return $dialog.dialog(dialogOptions).open();
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
