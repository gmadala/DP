'use strict';

angular.module('nextgearWebApp')
  .controller('ReceiptsCtrl', function($scope, $log, $stateParams, $window, Receipts, User, api, gettextCatalog) {

    var lastPromise;
    var maxReceipts = 20;

    $scope.format = 'grouped';
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

    $scope.tooMany = function() {
      return $scope.selectedReceipts.length >= maxReceipts;
    };

    $scope.selectedReceipts = []; // to hold selected receipts to print/export

    $scope.toggleInQueue = function(receipt) {
      if (!$scope.isSelected(receipt)) {
        $scope.selectedReceipts.push(receipt);
      } else {
        $scope.removeReceipt(receipt);
      }
    };

    $scope.removeReceipt = function(receipt) {
      $scope.selectedReceipts.splice($scope.selectedReceipts.indexOf(receipt), 1);
    };

    $scope.isSelected = function(receipt) {
      return $scope.selectedReceipts.indexOf(receipt) !== -1;
    };

    $scope.viewReceipt = function(receipt) {
      var transactionId = receipt.FinancialTransactionId;
      if ($scope.format === 'grouped') {
        var strUrl = api.contentLink('/receipt/viewMultiple/receipts', { financialtransactionids: transactionId });
        window.open(strUrl, '_blank');
      } else if ($scope.format === 'single') {
      }
    };

    $scope.onExport = function() {
      if($scope.selectedReceipts.length < 1) {
        return;
      }

      var ids = _.reduce($scope.selectedReceipts, function(ids, nextReceipt) {
        return ids + nextReceipt.FinancialTransactionId + ',';
      }, '');
      ids = ids.slice(0,-1); // remove extra comma at end

      if ($scope.format === 'grouped') {
        // build query string
        var strUrl = api.contentLink('/receipt/viewMultiple/receipts', { financialtransactionids: ids });
        window.open(strUrl, '_blank');
      } else if ($scope.format === 'single') {
      }
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
    User.getStatics().then(function(statics) {
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
        label: gettextCatalog.getString('View All'),
        value: allIds.join(',')
      });
      $scope.filterOptions = filters;
      $scope.receipts.resetSearch($stateParams.search);
    });
  });
