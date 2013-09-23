'use strict';

angular.module('nextgearWebApp')
  .controller('CheckoutCtrl', function ($scope, $dialog, protect, moment, User, Payments, OptionDefaultHelper) {

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
          var payments = $scope.paymentQueue.contents.payments; // fees are never scheduled
          return _.reduce(payments, function (accumulator, value) {
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
          var payments = $scope.paymentQueue.contents.payments; // fees are never scheduled
          return _.reduce(payments, function (accumulator, value) {
            if (value.scheduleDate) {
              accumulator += value.amount;
            }
            return accumulator;
          }, 0);
        }
      },
      removePayment: Payments.removePaymentFromQueue,
      removeFee: Payments.removeFeeFromQueue,
      canSchedule: function (payment) {
        // overdue payments cannot be scheduled
        return !moment(payment.dueDate).isBefore(moment(), 'day');
      },
      schedule: function (payment) {
        var dialogOptions = {
          backdrop: true,
          keyboard: true,
          backdropClick: true,
          templateUrl: 'views/modals/scheduleCheckout.html',
          controller: 'ScheduleCheckoutCtrl',
          resolve: {
            payment: function () { return payment; },
            possibleDates: function () {
              var tomorrow = moment().add(1, 'day').toDate(),
                dueDate = moment(payment.dueDate).toDate();
              return Payments.fetchPossiblePaymentDates(tomorrow, dueDate, true);
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
      useFunds: false,
      useAmount: 0
    };

    // ----- begin uber-complex submit logic -----

    var defaultCheckoutError = 'Unable to complete checkout. Please contact NextGear for assistance.';

    $scope.submit = function () {
      $scope.submitError = null;

      // validate user selections for payment
      $scope.validity = angular.copy($scope.paymentForm);
      if (!$scope.paymentForm.$valid) {
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
            resolve: {
              queue: function () { return $scope.paymentQueue.contents; },
              transactionInfo: function () { return result; }
            }
          };
          $dialog.dialog(dialogOptions).open();
        }, function (error) {
          $scope.submitInProgress = false;
          console.log('checkout call failed');
          $scope.submitError = error || defaultCheckoutError;
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
        }, function (error) {
          $scope.submitInProgress = false;
          console.log('unable to retrieve business hours');
          $scope.submitError = error || defaultCheckoutError;
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
            console.log('no suitable date found for scheduling after-hours payments');
            $scope.submitError = defaultCheckoutError;
            return;
          }
          var nextAvail = moment(result.sort()[0]).toDate(),
            ejectedFees = [],
            ejectedPayments = [];
          // eject all fees since they cannot be scheduled
          angular.forEach($scope.paymentQueue.contents.fees, function (fee) {
            Payments.removeFeeFromQueue(fee.financialRecordId);
            ejectedFees.push(fee);
          });
          // eject payments that can't be scheduled; auto-schedule any others not already scheduled
          angular.forEach($scope.paymentQueue.contents.payments, function (payment) {
            if (!$scope.paymentQueue.canSchedule(payment)) {
              Payments.removePaymentFromQueue(payment.floorplanId);
              ejectedPayments.push(payment);
            } else if (!payment.scheduleDate) {
              payment.scheduleDate = nextAvail;
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
        }, function (error) {
          $scope.submitInProgress = false;
          console.log('error loading potential dates for scheduling after-hours payments');
          $scope.submitError = error || defaultCheckoutError;
        }
      );
    };

  });
