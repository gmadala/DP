'use strict';

angular.module('nextgearWebApp')
  .controller('PaymentsCtrl', function($scope, $stateParams, $timeout, moment, Payments, User, segmentio, metric, $dialog, $q) {

    segmentio.track(metric.VIEW_PAYMENTS_LIST);
    $scope.metric = metric; // make metric names available to template

    $scope.isCollapsed = true;

    var lastPromise;

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
          dialogClass: 'modal extension-modal',
          resolve: {
            payment: function() {
              return payment;
            },
            confirmRequest: function() {
              return function() {
                if(payment.Extendable) {
                  return Payments.requestExtension(payment.FloorplanId).then(function() {
                    // Reload data since which payments can be extended has now changed
                    // If user extends a payment not on the first page it will un-load previously
                    // loaded payments and kick them to the top of the list.
                    $scope.payments.search();
                  });
                } else {
                  // shouldn't be calling this method
                  return $q.reject();
                }
              };
            }
          }
        }).open();
    };

    $scope.payments.resetSearch = function (initialFilter) {
      $scope.payments.proposedSearchCriteria = {
        query: null,
        startDate: null,
        endDate: null,
        filter: initialFilter || Payments.filterValues.ALL,
        inventoryLocation: undefined
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

  }).controller('ExtensionRequestCtrl', function ($scope, dialog, payment, confirmRequest, Floorplan) {
    $scope.payment = payment;
    $scope.closeDialog = dialog.close;

    Floorplan.getExtensionPreview(payment.FloorplanId).then(function(result) {
      $scope.extPrev = result;

      var feeTotal = _.reduce($scope.extPrev.Fees, function(sum, fee) {
        return sum + fee.Amount;
      }, 0);

      $scope.subtotal = $scope.extPrev.PrincipalAmount + $scope.extPrev.InterestAmount + feeTotal + $scope.extPrev.CollateralProtectionAmount;
    });

    $scope.confirmRequest = function() {
      confirmRequest().then(function() {
        dialog.close();
      });
    };

  });
