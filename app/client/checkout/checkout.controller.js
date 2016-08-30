(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('CheckoutCtrl', CheckoutCtrl);

  CheckoutCtrl.$inject = [
    '$scope',
    '$q',
    '$uibModal',
    'protect',
    'moment',
    'User',
    'Payments',
    'OptionDefaultHelper',
    'api',
    'Floorplan',
    'PaymentOptions',
    'BusinessHours',
    'gettextCatalog',
    'gettext',
    'kissMetricInfo',
    'segmentio',
    'metric',
    'decimalAdjust'
  ];

  function CheckoutCtrl(
    $scope,
    $q,
    $uibModal,
    protect,
    moment,
    User,
    Payments,
    OptionDefaultHelper,
    api,
    Floorplan,
    PaymentOptions,
    BusinessHours,
    gettextCatalog,
    gettext,
    kissMetricInfo,
    segmentio,
    metric,
    decimalAdjust) {

    var uibModal = $uibModal;

    $scope.isCollapsed = true;
    $scope.submitInProgress = false;

    kissMetricInfo.getKissMetricInfo().then(function(result){
      $scope.kissMetricData = result;
    });

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

    $scope.sanitize = function(str) {
      var sanitized = str || '';
      return api.toFloat(sanitized.replace(/[^\d\.]/g, ''));
    };

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
              accumulator += value.getCheckoutAmount();
            }
            return accumulator;
          }, 0);
        },
        scheduledTotal: function () {
          var content = $scope.paymentQueue.contents,
            merged = angular.extend({}, content.fees, content.payments);
          return _.reduce(merged, function (accumulator, value) {
            if (value.scheduleDate) {
              accumulator += value.getCheckoutAmount();
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
          templateUrl: 'client/checkout/schedule-checkout-modal/schedule-checkout.template.html',
          controller: 'ScheduleCheckoutCtrl',
          resolve: {
            payment: function () { return !item.isFee && item; },
            fee: function () { return item.isFee && item; },
            possibleDates: function () {
              var tomorrow = moment().add(1, 'day').toDate(),
                dueDate = moment(item.dueDate).toDate();
              return Payments.fetchPossiblePaymentDates(tomorrow, dueDate, true).then(
                function (result) {
                  item.scheduleLoading = false;
                  if (!_.find(result)) {
                    // no possible schedule dates for this item (edge case, but could happen)

                    item.scheduleError = gettextCatalog.getString('This {{ paymentType }} cannot be scheduled', { paymentType: (item.isFee ? 'fee' : 'payment') });
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
                  item.scheduleError = gettextCatalog.getString('Error retrieving schedule information');
                  return $q.reject(error);
                }
              );
            }
          }
        };
        uibModal.open(dialogOptions);
      }
    };

    $scope.removeFee = function (fee) {
      Payments.removeFeeFromQueue(fee.financialRecordId);
    };

    User.getInfo().then(function(info) {
      $scope.bankAccounts = {
        getList: function () {
          return info ? info.BankAccounts : undefined;
        },
        selectedAccount: null,
        singleAccount: info.BankAccounts.length === 1
      };

      $scope.bankAccounts.defaultHelper = OptionDefaultHelper.create([
        {
          scopeSrc: 'bankAccounts.getList()',
          modelDest: 'selectedAccount'
        }
      ]).applyDefaults($scope, $scope.bankAccounts);
    });

    $scope.unappliedFunds = {
      available: Payments.getAvailableUnappliedFunds(),
      min: function () {
        return $scope.unappliedFunds.useFunds ? 0.01 : 0;
      },
      max: function () {
        var max = Math.min($scope.unappliedFunds.available, $scope.paymentQueue.sum.todayTotal());
        // cannot use more unapplied funds than available, or than the total owed for same-day payments
        // PROD-36: Adjust the max value to 2 decimal points.
        // e.g.: 18492.559999999998 -> 18492.56
        // This is javascript floating point calculation error. You can try: 0.1 * 0.2.
        return decimalAdjust.round(max, -2);
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
        if (p.isPayoff() && p.overrideAddress && p.overrideAddress !== null) {
          paymentsToOverride.push(p);
        }
      });

      Floorplan.overrideCompletionAddress(paymentsToOverride).then(function() {
        Payments.checkout(fees, payments, bankAccount, unapplied).then(
          function (result) {
            // confirmation dialog
            kissMetricInfo.getKissMetricInfo().then(function (result) {
              result.vins = _.size($scope.paymentQueue.contents.payments);
              result.fees = _.size($scope.paymentQueue.contents.fees);

              segmentio.track(metric.DEALER_PAYMENT_SUBMITTED, result);
            });

            var dialogOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: true,
              templateUrl: 'client/checkout/confirm-checkout-modal/confirm-checkout.template.html',
              controller: 'ConfirmCheckoutCtrl',
              dialogClass: 'modal modal-medium',
              resolve: {
                queue: function () {
                  return $scope.paymentQueue.contents;
                },
                transactionInfo: function () {
                  return result;
                }
              }
            };
            $uibModal.open(dialogOptions).result.then(function () {
              Payments.clearPaymentQueue();
            });
          }
        );
      });
    };

    $scope.todayDate = moment().toDate();

    var bizHours = function() {
      BusinessHours.insideBusinessHours().then(function(result) {
        $scope.canPayNow = result;
        // If we are oustide of business hours, we need to grab
        // the next available date so we can auto-schedule.
        if(!$scope.canPayNow) {
          BusinessHours.nextBusinessDay().then(function(nextBizDay) {
            var nextAvail = moment(nextBizDay); // updatePaymentAmountOnDate requires a date object for the scheduleDate param
            angular.forEach($scope.paymentQueue.contents.payments, function(item) {
              if(!item.scheduleDate) {
                // This does NOT need to be called when the payments search page was loaded after business hours ended.
                // This ONLY needs to be called when the payments page was loaded just before business hours ended, and
                // then business hours ended.
                Payments.updatePaymentAmountOnDate(item, nextAvail, item.isPayoff()).then(function() {
                  // set scheduled date to next available business day.
                  item.scheduleDate = nextAvail.toDate();
                }, function(/* error */) {
                  // Should set to schedule even if updating the value didn't work.
                  // Value will be incorrect but it will still show as scheduling for the future.
                  item.scheduleDate = nextAvail.toDate();
                });

              }
            });

            angular.forEach($scope.paymentQueue.contents.fees, function(item) {
              if(!item.scheduleDate) {
                item.scheduleDate = nextAvail.toDate();
              }
            });
          });
        }

        $scope.canPayNowLoaded = true;
      }, function(error) {
        error.dismiss();
        $scope.canPayNow = false;
        $scope.canPayNowoaded = false;
      });
    };

    // initial check
    bizHours();

    // when business hours change, update
    $scope.$on(BusinessHours.CHANGE_EVENT, function() {
      bizHours();
    });

    $scope.launchPaymentOptions = function(payment) {
      var dialogOptions = {
        dialogClass: 'modal modal-medium',
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'client/shared/modals/payment-options-breakdown/payment-options-breakdown.template.html',
        controller: 'PaymentOptionsBreakdownCtrl',
        resolve: {
          object: function() {
            return payment;
          },
          isOnQueue: function() {
            return true; // already on queue.
          }
        }
      };
      uibModal.open(dialogOptions);
    };

    $scope.exportPaymentSummary = function() {
      var feeIds = [],
        paymentIds = [],
        params = {};

      angular.forEach($scope.paymentQueue.contents.fees, function(fee) {
        feeIds.push(fee.financialRecordId);
      });
      angular.forEach($scope.paymentQueue.contents.payments, function(payment) {
        if(!payment.scheduleDate) {
          paymentIds.push(payment.stockNum + '|' + (payment.isPayoff() ? '1' : '0'));
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

    $scope.getPaymentTypeText = function(payment) {
      var text;

      switch(payment.paymentOption) {
        case PaymentOptions.TYPE_PAYMENT:
          text = gettext('payment');
          break;
        case PaymentOptions.TYPE_PAYOFF:
          text = gettext('payoff');
          break;
        case PaymentOptions.TYPE_INTEREST:
          text = gettext('interest only');
          break;
        default:
          text = '_' + gettext('invalid payment type') + '_';
      }
      return gettextCatalog.getString(text);
    };

  }
})();
