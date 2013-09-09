'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduledCtrl', function($scope, ScheduledPaymentsSearch, BusinessHours) {

    $scope.isCollapsed = true;

    $scope.scheduledPayments = {
      loading: false,

      results: [],

      FILTER_BY_ALL: '',
      FILTER_BY_SCHEDULED: ScheduledPaymentsSearch.FILTER_BY_SCHEDULED,
      FILTER_BY_PROCESSED: ScheduledPaymentsSearch.FILTER_BY_PROCESSED,
      FILTER_BY_CANCELED: ScheduledPaymentsSearch.FILTER_BY_CANCELED,
      FILTER_BY_VOIDED: ScheduledPaymentsSearch.FILTER_BY_VOIDED,

      filterOptions: [
        {
          label: 'View All',
          value: ''
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

    $scope.scheduledPayments.resetSearch();

    BusinessHours.get().then(function(businessHours) {
      var currentTime = (new Date()).getTime(),
        startTime = businessHours.startTime.getTime(),
        endTime = businessHours.endTime.getTime();
      $scope.outOfBusinessHours = currentTime <  startTime || currentTime > endTime;
    });
  });
