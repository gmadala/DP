'use strict';

angular.module('nextgearWebApp')
  .controller('ReceiptsCtrl', function($scope, $log, $stateParams, Receipts, User, segmentio, metric, api) {

    segmentio.track(metric.VIEW_RECEIPTS_PAGE);
    $scope.metric = metric; // make metric names available to template

    var lastPromise;
    var maxReceipts = 20;

    $scope.isCollapsed = true;

    $scope.getReceiptStatus = function (receipt) {
      if (receipt.IsNsf) { return 'nsf'; }
      if (receipt.IsVoided) { return 'void'; }
      return 'normal';
    };

    $scope.filterOptions = []; // loaded below from User data
    $scope.selectedReceipts = []; // to hold selected receipts to print/export

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
      $scope.selectedReceipts = []; // reset selected receipts array
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

    $scope.count = function() {
      var x = _.reduce($scope.selectedReceipts, function(count, checked) {
        if (checked) {
          return count + 1;
        } else {
          return count;
        }
      }, 0);

      return x;
    };

    $scope.tooMany = function() {
      if ($scope.count() >= maxReceipts) {
        return true;
      }
      return false;
    };

    $scope.onExport = function() {
      if($scope.count() === 0) {
        return;
      }

      var ids = '';

      for(var i = 0; i < $scope.selectedReceipts.length; i++) {
        if ($scope.selectedReceipts[i]) {
          ids = ids + $scope.receipts.results[i].FinancialTransactionId +  ',';
        }
      }

      // remove extra comma at end
      ids = ids.slice(0,-1);

      // build query string
      var strUrl = api.contentLink('/receipt/viewMultiple/receipts', { financialtransactionids: ids });

      window.open(
        strUrl,
        '_blank' // open in new window
      );
      // reset selection
      $scope.selectedReceipts = [];
    };

    $scope.sortField = 'CreateDate'; // Default sort

    $scope.sortBy = function (fieldName) {
      if ($scope.sortField === fieldName) {
        // already sorting by this field, just flip the direction
        $scope.sortDescending = !$scope.sortDescending;
      } else {
        $scope.sortField = fieldName;
        $scope.sortDescending = false;
      }

      $scope.receipts.proposedSearchCriteria.sortField = $scope.sortField;
      $scope.receipts.proposedSearchCriteria.sortDesc = $scope.sortDescending;

      $scope.receipts.search();
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

    $scope.receipts.resetSearch($stateParams.search);

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
