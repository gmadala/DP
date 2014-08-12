'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduledCtrl', function($scope, $timeout, ScheduledPaymentsSearch, Payments, moment, $dialog, segmentio, metric, User) {
    segmentio.track(metric.VIEW_SCHEDULED_PAYMENTS_PAGE);

    var prv = {
        cancelLocalScheduledPayment: function(p) {
          p.isPending = p.isVoided = p.isProcessed = false;
          p.isCancelled = true;
          p.statusDate = moment().format('YYYY-MM-DD');
          p.status = 'Cancelled';
          return p;
        },
        cancelLocalScheduledFee: function(f) {
          $scope.fees.results = _.filter($scope.fees.results, function(fee) {
            return fee.WebScheduledAccountFeeId !== f.WebScheduledAccountFeeId;
          });
          return f;
        }
      },
      lastPromise;

    $scope.isCollapsed = true;
    $scope.hitInfiniteScrollMax = false;

    $scope.scheduledPayments = {
      loading: false,
      results: [],
      filterOptions: [
        {
          label: 'View All',
          value: ScheduledPaymentsSearch.FILTER_BY_ALL
        },
        {
          label: 'Pending',
          value: ScheduledPaymentsSearch.FILTER_BY_PENDING
        },
        {
          label: 'Processed',
          value: ScheduledPaymentsSearch.FILTER_BY_PROCESSED
        },
        {
          label: 'Cancelled',
          value: ScheduledPaymentsSearch.FILTER_BY_CANCELLED
        },
        {
          label: 'Voided',
          value: ScheduledPaymentsSearch.FILTER_BY_VOIDED
        }
      ],

      loadMoreData: function() {
        if (!ScheduledPaymentsSearch.hasMoreRecords()) { return; }
        this.loading = true;
        ScheduledPaymentsSearch.loadMoreData().then(function(results) {
          this.loading = false;
          this.results = this.results.concat(results);
        }.bind(this), function (error) {
          // No more results because of our infinite scrolling max
          if (_.isBoolean(error) && error === false) {
            $scope.hitInfiniteScrollMax = true;
          }
          this.loading = false;
        }.bind(this));
      },

      search: function() {
        var promise;
        this.loading = true;
        $scope.scheduledPayments.results.length = 0;
        $scope.hitInfiniteScrollMax = false;
        promise = lastPromise = ScheduledPaymentsSearch.search(
            this.searchCriteria.query,
            this.searchCriteria.startDate,
            this.searchCriteria.endDate,
            this.searchCriteria.filter,
            this.searchCriteria.inventoryLocation,
            $scope.sortField.payment,
            $scope.sortDescending.payment);

        promise.then(
          function(results) {
            if (promise !== lastPromise) { return; }
            this.loading = false;
            this.results = results;
          }.bind(this),
          function (/*error*/) {
            if (promise !== lastPromise) { return; }
            this.loading = false;
          }.bind(this)
        );
      },

      resetSearch: function() {
        this.searchCriteria = {
          query: null,
          startDate: null,
          endDate: null,
          filter: ScheduledPaymentsSearch.FILTER_BY_ALL,
          sortField: null,
          sortDesc: true,
          inventoryLocation: undefined
        };
        this.search();
      },

      isOnPaymentQueue: function(payment) {
        return !!Payments.isPaymentOnQueue(payment.floorplanId);
      },

      payOff: function(p) {
        Payments.addPaymentToQueue(
          p.floorplanId,
          p.vin,
          p.stockNumber,
          p.description,
          p.payoffAmount,
          p.curtailmentDueDate,
          true, /*payoff*/
          p.principalPayoff,
          p.InterestPayoffTotal,
          p.FeesPayoffTotal,
          p.CollateralProtectionPayoffTotal
        );
      },

      cancelPayment: function(payment) {
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
                  webScheduledPaymentId: payment.webScheduledPaymentId,
                  vin: payment.vin,
                  description: payment.description,
                  stockNumber: payment.stockNumber,
                  scheduledDate: payment.scheduledDate,
                  isPayOff: !payment.isCurtailment,
                  currentPayOff: payment.payoffAmount,
                  amountDue: payment.paymentAmount
                },
                onCancel: function() {
                  prv.cancelLocalScheduledPayment(payment);
                }
              };
            }
          }
        };
        $dialog.dialog(dialogOptions).open();
      },

      cancelFee: function(fee) {
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
                  webScheduledAccountFeeId: fee.WebScheduledAccountFeeId,
                  financialRecordId: fee.FinancialRecordId,
                  feeType: fee.FeeType,
                  description: fee.Description,
                  scheduledDate: fee.ScheduledDate,
                  balance: fee.Balance
                },
                onCancel: function() {
                  prv.cancelLocalScheduledFee(fee);
                }
              };
            }
          }
        };
        $dialog.dialog(dialogOptions).open();
      }
    };

    $scope.paymentInProgress = Payments.paymentInProgress;

    $scope.sortField = {};
    $scope.sortField.fee = 'EffectiveDate'; // Default sort
    $scope.sortField.payment = 'ScheduledForDate'; // Default sort
    $scope.sortDescending = {};

    $scope.sortFeesBy = function(fieldName) {
      $scope.__sortBy('fee', fieldName);
    };

    $scope.sortPaymentsBy = function(fieldName) {
      $scope.__sortBy('payment', fieldName);
      $scope.scheduledPayments.search();
    };

    $scope.__sortBy = function (feeOrPayment, fieldName) {
      if ($scope.sortField[feeOrPayment] === fieldName) {
        // already sorting by this field, just flip the direction
        $scope.sortDescending[feeOrPayment] = !$scope.sortDescending[feeOrPayment];
      } else {
        $scope.sortField[feeOrPayment] = fieldName;
        $scope.sortDescending[feeOrPayment] = false;
      }
    };

    $scope.scheduledPayments.resetSearch();

    $scope.fees = {
      results: [],
      loading: false
    };

    $scope.fees.loading = true;

    ScheduledPaymentsSearch.fetchFees(User.getInfo().BusinessId).then(
      function (result) {
        $scope.fees.loading = false;
        $scope.fees.results = result.ScheduledAccountFees;
      }, function (/*error*/) {
        $scope.fees.loading = false;
      }
    );

    var refreshCanPayNow = function () {
      if( !User.isLoggedIn() ) { return; }

      Payments.canPayNow().then(
        function (result) {
          $scope.canPayNow = result;
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

  })
;
