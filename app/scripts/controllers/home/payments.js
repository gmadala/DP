'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentsCtrl', function($scope, $stateParams, $timeout, moment, Payments, User) {

    $scope.isCollapsed = true;

    $scope.getDueStatus = function (payment) {
      var due = moment(payment.DueDate),
        today = moment();

      if (due.isBefore(today, 'day')) {
        return 'overdue';
      } else if (due.isSame(today, 'day')) {
        return 'today';
      } else {
        return 'future';
      }
    };

    $scope.isPaymentOnQueue = Payments.isPaymentOnQueue;
    $scope.isFeeOnQueue = Payments.isFeeOnQueue;

    $scope.payments = {
      results: [],
      loading: false,
      paginator: null
    };

    $scope.payments.filterOptions = [
      {
        label: 'View All',
        value: Payments.filterValues.ALL
      },
      {
        label: 'Due Today',
        value: Payments.filterValues.TODAY
      },
      {
        label: 'Due This Week',
        value: Payments.filterValues.THIS_WEEK
      },
      {
        label: 'Date Range',
        value: Payments.filterValues.RANGE
      }
    ];

    $scope.payments.search = function() {
      // search means "start from the beginning with current criteria"
      $scope.payments.paginator = null;
      $scope.payments.results.length = 0;

      // commit the proposed search criteria
      $scope.payments.searchCriteria = angular.copy($scope.payments.proposedSearchCriteria);

      $scope.payments.fetchNextResults();
    };

    $scope.payments.fetchNextResults = function () {
      var paginator = $scope.payments.paginator;
      if (paginator && !paginator.hasMore()) {
        return;
      }

      // get the next applicable batch of results
      $scope.payments.loading = true;
      Payments.search($scope.payments.searchCriteria, paginator).then(
        function (result) {
          $scope.payments.loading = false;
          $scope.payments.paginator = result.$paginator;
          // fast concatenation of results into existing array
          Array.prototype.push.apply($scope.payments.results, result.SearchResults);
        }, function (/*error*/) {
          $scope.payments.loading = false;
        }
      );
    };

    $scope.payments.resetSearch = function (initialFilter) {
      $scope.payments.proposedSearchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: initialFilter || Payments.filterValues.ALL
      };
      $scope.payments.search();
    };

    $scope.payments.resetSearch($stateParams.filter);

    $scope.fees = {
      results: [],
      loading: false
    };

    $scope.fees.loading = true;
    Payments.fetchFees().then(
      function (result) {
        $scope.fees.loading = false;
        $scope.fees.results = result;
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

  });
