'use strict';

angular.module('nextgearWebApp')
  .controller('CheckoutCtrl', function ($scope, $q, $dialog, $timeout, protect, moment, messages, User, Payments, OptionDefaultHelper, api, Floorplan) {
    $scope.isCollapsed = true;
    $scope.submitInProgress = false;

    // Digest cycle wasn't noticing it change when simply assigning
    // submitInProgress to the watch method. This forces it to
    // rerun every digest cycle.
    $scope.$watch(
      function() {
        return Payments.paymentInProgress();
      },
      function(newValue) {
        $scope.submitInProgress = newValue;
      }
    );

    $scope.paymentQueue = {
      contents: Payments.getPaymentQueue(),
      sum: {
        todayCount: function () {
          var content = $scope.paymentQueue.contents,
            merged = angular.extend({}, content.fees, content.payments);
          return _.reduce(merged, function (accumulator, value) {
            if (!value.scheduleDate) {
              accumulator += 1;
            }
            return accumulator;
          }, 0);
        },
        scheduledCount: function () {
          var content = $scope.paymentQueue.contents,
            merged = angular.extend({}, content.fees, content.payments);
          return _.reduce(merged, function (accumulator, value) {
            if (value.scheduleDate) {
              accumulator += 1;
            }
            return accumulator;
          }, 0);
        },
        todayTotal: function () {
          var content = $scope.paymentQueue.contents,
            merged = angular.extend({}, content.fees, content.payments);
          return _.reduce(merged, function (accumulator, value) {
            if (!value.scheduleDate) {
              accumulator += value.amount;
            }
            return accumulator;
          }, 0);
        },
        scheduledTotal: function () {
          var content = $scope.paymentQueue.contents,
            merged = angular.extend({}, content.fees, content.payments);
          return _.reduce(merged, function (accumulator, value) {
            if (value.scheduleDate) {
              accumulator += value.amount;
            }
            return accumulator;
          }, 0);
        },
        feeCount: function () {
          var fees = $scope.paymentQueue.contents.fees;
          return _.size(fees);
        },
        paymentCount: function () {
          var payments = $scope.paymentQueue.contents.payments;
          return _.size(payments);
        }
      },
      removePayment: Payments.removePaymentFromQueue,
      removeFee: Payments.removeFeeFromQueue,
      canSchedule: function (item) {
        // false for overdue payments, payments due today, and payments that we've noticed have no available dates
        return !moment(item.dueDate).isBefore(moment(), 'day') &&
          !moment(item.dueDate).isSame(moment(), 'day') &&
          !item.scheduleBlocked;
      },
      getDueStatus: function (item) {
        var status;

        if (moment(item.dueDate).isBefore(moment(), 'day')) {
          status = 'overdue';
        } else if (moment(item.dueDate).isSame(moment(), 'day')) {
          status = 'today';
        } else {
          status = 'future';
        }
        return status;
      },
      schedule: function (item) {
        item.scheduleError = false;
        item.scheduleLoading = true;

        var dialogOptions = {
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          templateUrl: 'views/modals/scheduleCheckout.html',
          controller: 'ScheduleCheckoutCtrl',
          resolve: {
            payment: function () { return item.isPayment && item; },
            fee: function () { return item.isFee && item; },
            possibleDates: function () {
              var tomorrow = moment().add(1, 'day').toDate(),
                dueDate = moment(item.dueDate).toDate();
              return Payments.fetchPossiblePaymentDates(tomorrow, dueDate, true).then(
                function (result) {
                  item.scheduleLoading = false;
                  if (!_.find(result)) {
                    // no possible schedule dates for this item (edge case, but could happen)
                    item.scheduleError = 'This ' + (item.isPayment ? 'payment' : 'fee') + ' cannot be scheduled';
                    item.scheduleBlocked = true;
                    item.scheduleDate = null;
                    return $q.reject();
                  }
                  return result;
                }, function (error) {
                  if (error.dismiss) {
                    error.dismiss();
                  }
                  item.scheduleLoading = false;
                  item.scheduleError = 'Error retrieving schedule information';
                  return $q.reject(error);
                }
              );
            }
          }
        };
        $dialog.dialog(dialogOptions).open();
      }
    };

    $scope.todayDate = moment().toDate();

    $scope.bankAccounts = {
      getList: function () {
        var statics = User.getStatics();
        return statics ? statics.bankAccounts : undefined;
      },
      selectedAccount: null
    };

    $scope.bankAccounts.defaultHelper = OptionDefaultHelper.create([
      {
        scopeSrc: 'bankAccounts.getList()',
        modelDest: 'selectedAccount'
      }
    ]).applyDefaults($scope, $scope.bankAccounts);

    $scope.unappliedFunds = {
      available: Payments.getAvailableUnappliedFunds(),
      min: function () {
        return $scope.unappliedFunds.useFunds ? 0.01 : 0;
      },
      max: function () {
        // cannot use more unapplied funds than available, or than the total owed for same-day payments
        return Math.min($scope.unappliedFunds.available, $scope.paymentQueue.sum.todayTotal());
      },
      useFunds: false,
      useAmount: ''
    };

    // if todayTotal becomes 0 later on, force unapplied funds to OFF (template should disable)
    $scope.$watch('paymentQueue.sum.todayTotal()', function (total) {
      if (total === 0) { $scope.unappliedFunds.useFunds = false; }
    });

    // ----- begin uber-complex submit logic -----

    // var defaultCheckoutError = 'Unable to complete checkout. Please contact NextGear for assistance.';

    $scope.submit = function () {
      // validate user selections for payment
      $scope.validity = angular.copy($scope.paymentForm);
      var accountInvalid = $scope.paymentForm.bankAccount.$invalid,
        unappliedInvalid = $scope.unappliedFunds.useFunds && $scope.paymentForm.unappliedAmt.$invalid;
      if (accountInvalid || unappliedInvalid) {
        return;
      }

      $scope.reallySubmit(protect);
    };

    $scope.reallySubmit = function (guard) {
      if (guard !== protect) {
        throw 'CheckoutCtrl: reallySubmit can only be called from controller after validation';
      }

      var fees = $scope.paymentQueue.contents.fees,
        payments =  $scope.paymentQueue.contents.payments,
        bankAccount = $scope.bankAccounts.selectedAccount,
        unapplied = $scope.unappliedFunds.useFunds ? $scope.unappliedFunds.useAmount : 0;

      // if any addresses are overridden, handle those requests first now.
      // Grab payments to override addresses for
      var paymentsToOverride = [];
      _.each(payments, function(p) {
        if (p.isPayoff && p.overrideAddress && p.overrideAddress !== null) {
          paymentsToOverride.push(p);
        }
      });

      Floorplan.overrideCompletionAddress(paymentsToOverride).then(function() {
        Payments.checkout(fees, payments, bankAccount, unapplied).then(
          function (result) {
            // confirmation dialog
            var dialogOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: true,
              templateUrl: 'views/modals/confirmCheckout.html',
              controller: 'ConfirmCheckoutCtrl',
              dialogClass: 'modal modal-medium',
              resolve: {
                queue: function () { return $scope.paymentQueue.contents; },
                transactionInfo: function () { return result; }
              }
            };
            $dialog.dialog(dialogOptions).open().then(function () {
              Payments.clearPaymentQueue();
            });
          }
        );
      });
    };

    var refreshCanPayNow = function () {
      if( !User.isLoggedIn() ) { return; }

      Payments.canPayNow().then(
        function (result) {
          $scope.canPayNow = result;

          if(!$scope.canPayNow) {
            // we need to explicitly auto-schedule all payments/fees for the next available business day.
            var tomorrow = moment().add('days', 1).toDate(),
                later = moment().add('months', 1).toDate();

            Payments.fetchPossiblePaymentDates(tomorrow, later).then(
              function (result) {
                if (!result.length) {
                  // no possible payment dates...what do we do here?
                }

                var nextAvail = moment(result.sort()[0]).toDate(),
                paymentSummaryUpdates = [];

                angular.forEach($scope.paymentQueue.contents.payments, function (item) {
                  if (!item.scheduleDate) { // if it isn't already scheduled...
                    paymentSummaryUpdates.push(Payments.updatePaymentAmountOnDate(item, nextAvail, item.isPayoff));

                    // set the scheduled date to the next available business day.
                    item.scheduleDate = nextAvail;
                  }
                });

                angular.forEach($scope.paymentQueue.contents.fees, function (item) {
                  if (!item.scheduleDate) {
                    item.scheduleDate = nextAvail;
                  }
                });
              }
            );
          }
          $scope.canPayNowLoaded = true;
        }, function (error) {
          // suppress error message display from this to avoid annoyance since it runs continually
          error.dismiss();
          $scope.canPayNow = false;
          $scope.canPayNowLoaded = false;
        });

      $timeout(refreshCanPayNow, 60000); // repeat once a minute
    };
    refreshCanPayNow();

    $scope.exportPaymentSummary = function() {
      var feeIds = [],
        paymentIds = [],
        params = {};

      angular.forEach($scope.paymentQueue.contents.fees, function(fee) {
        feeIds.push(fee.financialRecordId);
      });
      angular.forEach($scope.paymentQueue.contents.payments, function(payment) {
        if(!payment.scheduleDate) {
          paymentIds.push(payment.stockNum + '|' + (payment.isPayoff ? '1' : '0'));
        }
      });

      if (feeIds.length > 0) {
        params.accountFees = feeIds.join(',');
      }
      if (paymentIds.length > 0) {
        params.floorplans = paymentIds.join(',');
      }

      // build query string
      var strUrl = api.contentLink('/report/payment/summary/paymentsSummary', params);

      window.open(strUrl, '_blank' /*open in a new window*/);
    };
  });
