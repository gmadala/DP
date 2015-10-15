(function () {

  'use strict';

  angular.module('nextgearWebApp')
    .controller('ReceiptsCtrl', ReceiptsCtrl);

  function ReceiptsCtrl($scope, $stateParams, Receipts, User, api, gettextCatalog) {

    var lastPromise;
    var maxReceipts = 20;

    $scope.format = 'grouped';
    $scope.isCollapsed = true;

    $scope.filterOptions = []; // loaded below from User data
    $scope.receipts = {
      results: [],
      loading: false,
      paginator: null,
      hitInfiniteScrollMax: false
    };

    $scope.receipts.search = search;
    $scope.receipts.fetchNextResults = fetchNextResults;

    $scope.selectedReceipts = []; // to hold selected receipts to print/export

    $scope.tooMany = tooMany;
    $scope.toggleInQueue = toggleInQueue;
    $scope.getReceiptStatus = getReceiptStatus;
    $scope.isSelected = isSelected;
    $scope.removeReceipt = removeReceipt;
    $scope.viewReceipt = viewReceipt;
    $scope.onExport = onExport;

    $scope.receipts.resetSearch = resetSearch;
    $scope.sortField = 'CreateDate'; // Default sort
    $scope.sortBy = sortBy;

    // filters (by payment method) are data-driven - wait for them to be available post-login
    $scope.receipts.resetSearch($stateParams.search);
    User.getStatics().then(handleStatics);

    /**
     * Return the status of the receipt which will be used in the toggle to display the receipt status.
     * @param receipt the current receipt
     * @returns {*} (string) key used to toggle the receipt status.
     */
    function getReceiptStatus(receipt) {
      if (receipt.IsNsf) {
        return 'nsf';
      }
      if (receipt.IsVoided) {
        return 'void';
      }
      return 'normal';
    }

    /**
     * Search for all available receipts. This search function will be the first function getting called when the page
     * is rendered. This will perform initial search based on all selected criteria.
     */
    function search() {
      // search means "start from the beginning with current criteria"
      $scope.receipts.paginator = null;
      $scope.receipts.hitInfiniteScrollMax = false;
      $scope.receipts.results.length = 0;

      // commit the proposed search criteria
      $scope.receipts.searchCriteria = angular.copy($scope.receipts.proposedSearchCriteria);

      $scope.receipts.fetchNextResults();
      $scope.selectedReceipts = []; // reset selected receipts array
    }

    /**
     * Search for the next batch of receipts after the initial search is completed. This call will trigger the infinite
     * loading image to get displayed when the user scroll all the way to the bottom of the receipts screen.
     */
    function fetchNextResults() {
      var promise;
      var paginator = $scope.receipts.paginator;

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
          if (promise !== lastPromise) {
            return;
          }
          $scope.receipts.loading = false;
          $scope.receipts.paginator = result.$paginator;
          // fast concatenation of results into existing array
          Array.prototype.push.apply($scope.receipts.results, result.Receipts);
        }, function (/*error*/) {
          if (promise !== lastPromise) {
            return;
          }
          $scope.receipts.loading = false;
        }
      );
    }

    /**
     * Check if selected receipts is more than allowed.
     * @returns {boolean} true if the selected receipts is more than max allowed.
     */
    function tooMany() {
      return $scope.selectedReceipts.length >= maxReceipts;
    }

    /**
     * Toggle a receipt in and out of the queue of the selected receipts to be printed.
     * @param receipt the receipt to be toggled.
     */
    function toggleInQueue(receipt) {
      if (!$scope.isSelected(receipt)) {
        $scope.selectedReceipts.push(receipt);
      } else {
        $scope.removeReceipt(receipt);
      }
    }

    /**
     * Remove receipt from list of all selected receipts.
     * @param receipt the receipt to be removed.
     */
    function removeReceipt(receipt) {
      $scope.selectedReceipts.splice($scope.selectedReceipts.indexOf(receipt), 1);
    }

    /**
     * Check whether a receipt is selected or not.
     * @param receipt the receipt to be checked.
     * @returns {boolean} true if the receipt is selected.
     */
    function isSelected(receipt) {
      return $scope.selectedReceipts.indexOf(receipt) !== -1;
    }

    /**
     * View the selected receipt in a new tab. The tab will contains the receipt.
     * @param receipt the receipt to viewed.
     */
    function viewReceipt(receipt) {
      var transactionId = receipt.FinancialTransactionId;
      if ($scope.format === 'grouped') {
        var strUrl = api.contentLink('/receipt/viewMultiple/receipts', {financialtransactionids: transactionId});
        window.open(strUrl, '_blank');
      } else if ($scope.format === 'single') {
      }
    }

    /**
     * Export all selected receipts.
     */
    function onExport() {
      if ($scope.selectedReceipts.length < 1) {
        return;
      }

      var ids = _.reduce($scope.selectedReceipts, function (ids, nextReceipt) {
        return ids + nextReceipt.FinancialTransactionId + ',';
      }, '');
      ids = ids.slice(0, -1); // remove extra comma at end

      if ($scope.format === 'grouped') {
        // build query string
        var strUrl = api.contentLink('/receipt/viewMultiple/receipts', {financialtransactionids: ids});
        window.open(strUrl, '_blank');
      } else if ($scope.format === 'single') {
      }
      // reset selection
      $scope.selectedReceipts = [];
    }

    /**
     * Change the sorting field which will be used to order the receipts.
     * @param fieldName the field name which will be used to order the receipts.
     */
    function sortBy(fieldName) {
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
    }

    /**
     * Reset the search criteria and refresh the search results using the search keyword.
     * @param initialKeyword keyword used to filter out the receipts.
     */
    function resetSearch(initialKeyword) {
      $scope.receipts.proposedSearchCriteria = {
        query: initialKeyword || null,
        startDate: null,
        endDate: null,
        filter: $scope.filterOptions.length > 0 ? $scope.filterOptions[0].value : null
      };
      $scope.receipts.search();
    }

    /**
     * Handle all of the default static information to generate the filter information.
     * @param statics static data coming from the server.
     */
    function handleStatics(statics) {
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
    }
  }

})();
