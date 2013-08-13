'use strict';

angular.module('nextgearWebApp')
  .controller('ScheduledCtrl', function($scope, ScheduledPaymentsSearch) {

    $scope.isCollapsed = true;

    $scope.scheduledPayments = {
      loading: false,

      results: [],

      criteria: {
        startDate: null,
        endDate: null,
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
      }
    };

    $scope.scheduledPayments.search();
  });
