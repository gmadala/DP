'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentsCtrl', function($scope, $stateParams, $timeout, moment, Payments, User, segmentio, metric) {

    segmentio.track(metric.VIEW_PAYMENTS_LIST);
    $scope.metric = metric; // make metric names available to template

    $scope.isCollapsed = true;

    var lastPromise;

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
      paginator: null,
      hitInfiniteScrollMax: false
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
      $scope.payments.hitInfiniteScrollMax = false;
      $scope.payments.results.length = 0;

      // commit the proposed search criteria
      $scope.payments.searchCriteria = angular.copy($scope.payments.proposedSearchCriteria);

      $scope.payments.fetchNextResults();
    };

    $scope.sortField = {};
    $scope.sortField.fee = 'EffectiveDate'; // Default sort
    $scope.sortField.payment = 'DueDate'; // Default sort
    $scope.sortDescending = {};

    $scope.sortBy = function (feeOrPayment, fieldName) {
      if ($scope.sortField[feeOrPayment] === fieldName) {
        // already sorting by this field, just flip the direction
        $scope.sortDescending[feeOrPayment] = !$scope.sortDescending[feeOrPayment];
      } else {
        $scope.sortField[feeOrPayment] = fieldName;
        $scope.sortDescending[feeOrPayment] = false;
      }
      if (feeOrPayment === 'payment') {
        $scope.payments.proposedSearchCriteria.sortField = $scope.sortField.payment;
        $scope.payments.proposedSearchCriteria.sortDesc = $scope.sortDescending.payment;
        $scope.payments.search();
      }
    };

    $scope.payments.fetchNextResults = function () {
      var paginator = $scope.payments.paginator,
          promise;

      if (paginator && !paginator.hasMore()) {
        if (paginator.hitMaximumLimit()) {
          $scope.payments.hitInfiniteScrollMax = true;
        }
        return;
      }

      // get the next applicable batch of results
      $scope.payments.loading = true;
      promise = lastPromise = Payments.search($scope.payments.searchCriteria, paginator);
      promise.then(
        function (result) {
          if (promise !== lastPromise) { return; }
          $scope.payments.loading = false;
          $scope.payments.paginator = result.$paginator;
          // fast concatenation of results into existing array
          Array.prototype.push.apply($scope.payments.results, result.SearchResults);
        }, function (/*error*/) {
          if (promise !== lastPromise) { return; }
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
