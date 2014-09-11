'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentsCtrl', function($scope, $stateParams, $timeout, moment, Payments, User, segmentio, metric, $dialog, gettextCatalog) {

    segmentio.track(metric.VIEW_PAYMENTS_PAGE);
    $scope.metric = metric; // make metric names available to template

    $scope.isCollapsed = true;

    var lastPromise;

    function getNextBusinessDate(scope) {
      // find the next possible payment date
      var tomorrow = moment().add('days', 1).toDate(),
        later = moment().add('months', 1).toDate();
      if(scope.nextBusinessDay) {
        return scope.nextBusinessDay;
      } else {
        Payments.fetchPossiblePaymentDates(tomorrow, later).then(
          function (result) {
            scope.nextBusinessDay = {
              date: moment(result.sort()[0]).toDate(),
              isTomorrow: moment(result.sort()[0]).isSame(tomorrow, 'day')
            };
          }
        );
      }
    }

    $scope.getDueStatus = function (item, isPayment) {
      var due = isPayment ? moment(item.DueDate) : moment(item.EffectiveDate),
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
        label: gettextCatalog.getString('View All'),
        value: Payments.filterValues.ALL
      },
      {
        label: gettextCatalog.getString('Due Today'),
        value: Payments.filterValues.TODAY
      },
      {
        label: gettextCatalog.getString('Due This Week'),
        value: Payments.filterValues.THIS_WEEK
      },
      {
        label: gettextCatalog.getString('Date Range'),
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

    $scope.sortFeesBy = function(fieldName) {
      $scope.__sortBy('fee', fieldName);
    };

    $scope.sortPaymentsBy = function(fieldName) {
      $scope.__sortBy('payment', fieldName);
      $scope.payments.proposedSearchCriteria.sortField = $scope.sortField.payment;
      $scope.payments.proposedSearchCriteria.sortDesc = $scope.sortDescending.payment;
      $scope.payments.search();
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

    $scope.showExtendLink = function(payment) {
      return payment.AmountDue === payment.CurrentPayoff;
    };

    $scope.payments.extension = function (payment) {
      $dialog.dialog({
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        controller: 'ExtensionRequestCtrl',
        templateUrl: 'views/modals/paymentExtension.html',
        dialogClass: 'modal modal-medium',
        resolve: {
          payment: function() {
            return payment;
          },
          onConfirm: function() {
            return function() {
               // Reload data since which payments can be extended has now changed
              // If user extends a payment not on the first page it will un-load previously
              // loaded payments and kick them to the top of the list.
              $scope.payments.search();
            };
          }
        }
      }).open();
    };

    $scope.payments.resetSearch = function (initialFilter, initialStartDate, initialEndDate) {
      $scope.payments.proposedSearchCriteria = {
        query: null,
        startDate: initialStartDate || null,
        endDate: initialEndDate || null,
        filter: initialFilter || Payments.filterValues.ALL,
        inventoryLocation: undefined
      };
      $scope.payments.search();
    };

    $scope.todayDate = moment().toDate();
    $scope.nextBusinessDay = null;
    $scope.nextBusinessDay = getNextBusinessDate($scope);

    // Set up page-load filtering based on $stateParams
    var filterParam = null,
        startDate = null,
        endDate = null;
    switch($stateParams.filter) {
    case 'today':
      filterParam = Payments.filterValues.TODAY;
      break;
    case 'overdue':
      filterParam = Payments.filterValues.RANGE;
      endDate = moment().subtract(1, 'days').toDate();
      break;
    case 'this-week':
      filterParam = Payments.filterValues.THIS_WEEK;
      break;
    }
    if($stateParams.filter && !filterParam) {
      // it's a date filter
      filterParam = Payments.filterValues.RANGE;
      startDate = moment($stateParams.filter, 'YYYY-MM-DD').toDate();
      endDate = moment($stateParams.filter, 'YYYY-MM-DD').toDate();
    }
    $scope.payments.resetSearch(filterParam, startDate, endDate);

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

  }).controller('ExtensionRequestCtrl', function ($scope, dialog, payment, onConfirm, Payments, Floorplan) {
    $scope.payment = payment;
    $scope.closeDialog = dialog.close;

    Floorplan.getExtensionPreview(payment.FloorplanId).then(function(result) {
      $scope.extPrev = result;

      var feeTotal = _.reduce($scope.extPrev.Fees, function(sum, fee) {
        return sum + fee.Amount;
      }, 0);

      $scope.subtotal = $scope.extPrev.PrincipalAmount + $scope.extPrev.InterestAmount + feeTotal + $scope.extPrev.CollateralProtectionAmount;
    });

    $scope.onConfirm = function() {
      onConfirm();
      dialog.close();
    };

    $scope.confirmRequest = function() {
      if($scope.extPrev.CanExtend) {
        Payments.requestExtension(payment.FloorplanId).then(function() {
          $scope.onConfirm();
        });
      } else {
        dialog.close();
      }
    };
  });
