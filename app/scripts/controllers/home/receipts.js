'use strict';

angular.module('nextgearWebApp')
  .controller('ReceiptsCtrl', function($scope, $log, $stateParams, Receipts, User, segmentio, metric) {

    segmentio.track(metric.VIEW_RECEIPTS_LIST);
    $scope.metric = metric; // make metric names available to template

    var lastPromise;

    $scope.isCollapsed = true;

    $scope.getReceiptStatus = function (receipt) {
      if (receipt.IsNsf) { return 'nsf'; }
      if (receipt.IsVoided) { return 'void'; }
      return 'normal';
    };

    $scope.filterOptions = []; // loaded below from User data

    $scope.receipts = {
      results: [],
      loading: false,
      paginator: null,
      hitInfiniteScrollMax: false
    };

    $scope.receipts.search = function() {
      // search means "start from the beginning with current criteria"
      $scope.receipts.paginator = null;
      $scope.receipts.hitInfiniteScrollMax = false;
      $scope.receipts.results.length = 0;

      // commit the proposed search criteria
      $scope.receipts.searchCriteria = angular.copy($scope.receipts.proposedSearchCriteria);

      $scope.receipts.fetchNextResults();
    };

    $scope.receipts.fetchNextResults = function () {
      var paginator = $scope.receipts.paginator,
          promise;
      if (paginator && !paginator.hasMore()) {
        if (paginator.hitMaximumLimit()) {
          $scope.receipts.hitInfiniteScrollMax = true;
        }
        return;
      }

      // get the next applicable batch of results
      $scope.receipts.loading = true;
      promise = lastPromise = Receipts.search($scope.receipts.searchCriteria, paginator);
      promise.then(
        function (result) {
          if (promise !== lastPromise) { return; }
          $scope.receipts.loading = false;
          $scope.receipts.paginator = result.$paginator;
          // fast concatenation of results into existing array
          Array.prototype.push.apply($scope.receipts.results, result.Receipts);
        }, function (/*error*/) {
          if (promise !== lastPromise) { return; }
          $scope.receipts.loading = false;
        }
      );
    };

    $scope.receipts.resetSearch = function (initialKeyword) {
      $scope.receipts.proposedSearchCriteria = {
        query: initialKeyword || null,
        startDate: null,
        endDate: null,
        filter: $scope.filterOptions.length > 0 ? $scope.filterOptions[0].value : null
      };
      $scope.receipts.search();
    };

    // filters (by payment method) are data-driven - wait for them to be available post-login
    var unwatch = $scope.$watch(function () { return User.getStatics(); }, function (statics) {
      if (statics) {
        var filters = [],
          allIds = [];
        angular.forEach(statics.paymentMethods, function (method) {
          filters.push({
            label: method.PaymentMethodName,
            value: method.PaymentMethodId
          });
          allIds.push(method.PaymentMethodId);
        });
        // special View All filter is simply a list of all payment method ids
        filters.unshift({
          label: 'View All',
          value: allIds.join(',')
        });
        $scope.filterOptions = filters;
        $scope.receipts.resetSearch($stateParams.search);
        unwatch();
      }
    });

  });
