'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentsCtrl', function($scope, $stateParams, $timeout, moment, Payments) {

    $scope.isCollapsed = true;

    // dummy data - payment queue
    $scope.queue = [{
      vin: 'CH224157',
      make: 'Toyota',
      model: 'Corolla',
      payment: 3544.49,
      year: 2013
    },
    {
      vin: 'CH224157',
      make: 'Toyota',
      model: 'Corolla',
      payment: 3544.49,
      year: 2013
    },
    {
      vin: 'CH224157',
      make: 'Toyota',
      model: 'Corolla',
      payment: 3544.49,
      year: 2013
    }];
    $scope.total = 3544.49*3;
    $scope.fees=[{ type: 'Collateral Audit', payment: 150}];
    // end dummy data

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

    $scope.getQueueStatus = Payments.getPaymentQueueStatus;

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
      $scope.payments.searchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: initialFilter || Payments.filterValues.ALL
      };
      $scope.payments.search();
    };

    $scope.payments.resetSearch($stateParams.filter);

    $scope.fees = Payments.fetchFees();

    var refreshCanPayNow = function () {
      $scope.canPayNow = Payments.canPayNow();
      $timeout(refreshCanPayNow, 60000); // repeat once a minute
    };
    refreshCanPayNow();

  });
