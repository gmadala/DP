'use strict';

angular.module('nextgearWebApp')
  .controller('CheckoutCtrl', function ($scope, $q, $dialog, protect, moment, messages, User, Payments, OptionDefaultHelper, api) {

    $scope.isCollapsed = true;

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
      canSchedule: function (payment) {
        // false for overdue payments, payments due today, and payments that we've noticed have no available dates
        return !moment(payment.dueDate).isBefore(moment(), 'day') &&
          !moment(payment.dueDate).isSame(moment(), 'day') &&
          !payment.scheduleBlocked;
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

    var defaultCheckoutError = 'Unable to complete checkout. Please contact NextGear for assistance.';

    $scope.submit = function () {

      // validate user selections for payment
      $scope.validity = angular.copy($scope.paymentForm);
      var accountInvalid = $scope.paymentForm.bankAccount.$invalid,
        unappliedInvalid = $scope.unappliedFunds.useFunds && $scope.paymentForm.unappliedAmt.$invalid;
      if (accountInvalid || unappliedInvalid) {
        return;
      }

      // validate that we aren't transgressing any business-hours payment rules
      $scope.validateBusinessHours().then(function (result) {
        if (result) {
          $scope.reallySubmit(protect);
        }
      });
    };

    $scope.reallySubmit = function (guard) {
      if (guard !== protect) {
        throw 'CheckoutCtrl: reallySubmit can only be called from controller after validation';
      }

      var fees = $scope.paymentQueue.contents.fees,
        payments =  $scope.paymentQueue.contents.payments,
        bankAccount = $scope.bankAccounts.selectedAccount,
        unapplied = $scope.unappliedFunds.useFunds ? $scope.unappliedFunds.useAmount : 0;

      $scope.submitInProgress = true;
      Payments.checkout(fees, payments, bankAccount, unapplied).then(
        function (result) {
          $scope.submitInProgress = false;
          // confirmation dialog
          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'views/modals/confirmCheckout.html',
            controller: 'ConfirmCheckoutCtrl',
            dialogClass: 'modal confirm-checkout',
            resolve: {
              queue: function () { return $scope.paymentQueue.contents; },
              transactionInfo: function () { return result; }
            }
          };
          $dialog.dialog(dialogOptions).open().then(function () {
            Payments.clearPaymentQueue();
          });
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

    $scope.validateBusinessHours = function () {
      $scope.submitInProgress = true;
      return Payments.canPayNow().then(
        function (result) {
          $scope.submitInProgress = false;
          if (result === true) {
            // same-day payments are OK
            return true;
          } else {
            // same-day payments not possible; we are outside business hours
            if ($scope.paymentQueue.sum.todayCount() > 0) {
              // same-day payments are being attempted; block this
              $scope.handleAfterHoursViolation();
              return false;
            } else {
              // no same-day payments are being attempted, so we're OK
              return true;
            }
          }
        }, function (/*error*/) {
          $scope.submitInProgress = false;
          return false;
        }
      );
    };

    $scope.handleAfterHoursViolation = function () {
      // find the next possible payment date
      var tomorrow = moment().add('days', 1).toDate(),
        later = moment().add('months', 1).toDate();
      $scope.submitInProgress = true;
      Payments.fetchPossiblePaymentDates(tomorrow, later).then(
        function (result) {
          $scope.submitInProgress = false;
          if (!result.length) {
            // no possible payments dates in the next month were found; cannot check out
            messages.add(defaultCheckoutError, 'no suitable dates in next month for scheduling after-hours payments');
            return;
          }
          var nextAvail = moment(result.sort()[0]).toDate(),
            ejectedFees = [],
            ejectedPayments = [];
          // eject all fees since they cannot be scheduled
          // angular.forEach($scope.paymentQueue.contents.fees, function (fee) {
          //   Payments.removeFeeFromQueue(fee.financialRecordId);
          //   ejectedFees.push(fee);
          // });
          // eject payments that can't be scheduled; auto-schedule any others not already scheduled
          angular.forEach(angular.extend({}, $scope.paymentQueue.contents.payments, $scope.paymentQueue.contents.fees), function (item) {
            if (!$scope.paymentQueue.canSchedule(item) || moment(item.dueDate).isBefore(nextAvail, 'day')) {
              Payments.removeFromQueue(item);
              if (item.isPayment) {
                ejectedPayments.push(item);
              } else {
                ejectedFees.push(item);
              }
            } else if (!item.scheduleDate) {
              item.scheduleDate = nextAvail;
            }
          });
          // tell the user what we did
          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'views/modals/afterHoursCheckout.html',
            controller: 'AfterHoursCheckoutCtrl',
            resolve: {
              ejectedFees: function () { return ejectedFees; },
              ejectedPayments: function () { return ejectedPayments; },
              autoScheduleDate: function () { return nextAvail; }
            }
          };
          $dialog.dialog(dialogOptions).open();
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

    $scope.exportPaymentSummary = function() {
      console.log('export payment summary');
      var feeIds = [],
        paymentIds = [],
        params = {};

      angular.forEach($scope.paymentQueue.contents.fees, function(fee) {
        feeIds.push(fee.financialRecordId);
      });
      angular.forEach($scope.paymentQueue.contents.payments, function(payment) {
        paymentIds.push(payment.stockNum + '|' + (payment.isPayoff ? '1' : '0'));
      });

      if (feeIds.length > 0) {
        params.accountFees = feeIds.join(',');
      }
      if (paymentIds.length > 0) {
        params.floorplans = paymentIds.join(',');
      }

      // build query string
      var strUrl = api.contentLink('/payment/summary', params);

      window.open(strUrl, '_blank' /*open in a new window*/);
    };
  });
