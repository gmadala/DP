'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduledCtrl', function($scope, ScheduledPaymentsSearch, BusinessHours, Payments) {

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
        }
      ],

      loadMoreData: function() {
        this.loading = true;
        ScheduledPaymentsSearch.loadMoreData().then(function(results) {
          this.loading = false;
          this.results = this.results.concat(results);
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
          }.bind(this));
      },

      resetSearch: function () {
        this.searchCriteria = {
          query: null,
          startDate: null,
          endDate: null,
          filter: ''
        };
        this.search();
      },

      isOnPaymentQueue: function(/*payment*/) {
        // TODO: Check on the Payment Queue and return true if found there.
        return false;
      },

      isProcessed: function(payment) {
        return payment.status === this.FILTER_BY_PROCESSED;
      },

      isScheduled: function(payment) {
        return payment.status === this.FILTER_BY_SCHEDULED;
      },

      payOff: function(payment) {
        // TODO: Add it to the PaymentQueue
        console.log('ScheduledPayments::payOff()' + ' - ' + payment.floorplanId);
        Payments.addToPaymentQueue(payment, true /*asPayOff*/);
      },

      showReceipt: function(payment) {
        // TODO: Hook it to the model
        console.log('ScheduledPayments::showReceipt()' + ' - ' + payment.floorplanId);
      },

      cancelPayment: function(payment) {
        // TODO: Hook it to the model
        console.log('ScheduledPayments::cancelPayment()' + ' - ' + payment.floorplanId);
        Payments.cancelScheduled(payment);
      }
    };

    $scope.scheduledPayments.resetSearch();

    BusinessHours.get().then(function(businessHours) {
      var currentTime = (new Date()).getTime(),
        startTime = businessHours.startTime.getTime(),
        endTime = businessHours.endTime.getTime();
      $scope.outOfBusinessHours = currentTime <  startTime || currentTime > endTime;
    });
  });
