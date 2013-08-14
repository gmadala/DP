'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduledCtrl', function($scope, ScheduledPaymentsSearch) {

    $scope.isCollapsed = true;

    $scope.scheduledPayments = {
      loading: false,

      results: [],

      criteria: {
        query: '',
        startDate: '',
        endDate: '',
        filter: ''
      },

      FILTER_BY_ALL: '',
      FILTER_BY_SCHEDULED: ScheduledPaymentsSearch.FILTER_BY_SCHEDULED,
      FILTER_BY_PROCESSED: ScheduledPaymentsSearch.FILTER_BY_PROCESSED,
      FILTER_BY_CANCELED: ScheduledPaymentsSearch.FILTER_BY_CANCELED,
      FILTER_BY_VOIDED: ScheduledPaymentsSearch.FILTER_BY_VOIDED,

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
            this.criteria.query,
            this.criteria.startDate,
            this.criteria.endDate,
            this.criteria.filter)
          .then(function(results) {
            this.loading = false;
            this.results = results;
          }.bind(this));
      },

      clearCriteria: function() {
        this.criteria = {
          query: '',
          startDate: '',
          endDate: '',
          filter: ''
        };
      },

      clearSearch: function() {
        this.clearCriteria();
        this.search();
      },

      isOnPaymentQueue: function(payment) {
        // TODO: Check on the Payment Queue and return true if found there.
        console.log('ScheduledPayments::isOnPaymentQueue()' + ' - ' + payment.floorplanId);
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
      },

      showReceipt: function(payment) {
        // TODO: Hook it to the model
        console.log('ScheduledPayments::showReceipt()' + ' - ' + payment.floorplanId);
      },

      cancelPayment: function(payment) {
        // TODO: Hook it to the model
        console.log('ScheduledPayments::cancelPayment()' + ' - ' + payment.floorplanId);
      }
    };

    $scope.scheduledPayments.clearCriteria();
    $scope.scheduledPayments.search();
  });
