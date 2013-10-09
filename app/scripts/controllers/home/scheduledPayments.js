'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduledCtrl', function($scope, $timeout, ScheduledPaymentsSearch, Payments, moment, $dialog) {
    var prv = {
      cancelLocalScheduledPayment: function(p) {
        p.isPending = p.isVoided = p.isProcessed = false;
        p.isCancelled = true;
        p.statusDate = moment().format('YYYY-MM-DD');
        p.status = 'Cancelled';
        return p;
      }
    };

    $scope.isCollapsed = true;

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
          value: ScheduledPaymentsSearch.FILTER_BY_SCHEDULED
        },
        {
          label: 'Processed',
          value: ScheduledPaymentsSearch.FILTER_BY_PROCESSED
        },
        {
          label: 'Cancelled',
          value: ScheduledPaymentsSearch.FILTER_BY_CANCELED
        },
        {
          label: 'Voided',
          value: ScheduledPaymentsSearch.FILTER_BY_VOIDED
        }
      ],

      loadMoreData: function() {
        this.loading = true;
        ScheduledPaymentsSearch.loadMoreData().then(function(results) {
          this.loading = false;
          this.results = this.results.concat(results);
        }.bind(this), function (/*error*/) {
          this.loading = false;
        }.bind(this));
      },

      search: function() {
        this.loading = true;
        ScheduledPaymentsSearch.search(
            this.searchCriteria.query,
            this.searchCriteria.startDate,
            this.searchCriteria.endDate,
            this.searchCriteria.filter)
          .then(function(results) {
            this.loading = false;
            this.results = results;
          }.bind(this), function (/*error*/) {
            this.loading = false;
          }.bind(this));
      },

      resetSearch: function() {
        this.searchCriteria = {
          query: null,
          startDate: null,
          endDate: null,
          filter: ScheduledPaymentsSearch.FILTER_BY_ALL
        };
        this.search();
      },

      isOnPaymentQueue: function(payment) {
        return !!Payments.isPaymentOnQueue(payment.floorplanId);
      },

      payOff: function(p) {
        Payments.addPaymentToQueue(p.floorplanId, p.vin, p.stockNumber, p.description, p.payoffAmount, true /*payoff*/);
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
      }
    };

    $scope.scheduledPayments.resetSearch();

    var refreshCanPayNow = function () {
      $scope.canPayNow = Payments.canPayNow();
      $timeout(refreshCanPayNow, 60000); // repeat once a minute
    };
    refreshCanPayNow();
  })
;
