'use strict';

angular.module('nextgearWebApp')
  .controller('BusinessSearchCtrl', function($scope, dialog, BusinessSearch, initialQuery, searchBuyersMode, segmentio, metric) {

    var lastPromise;

    $scope.data = {
      searchBuyersMode: searchBuyersMode,
      proposedQuery: initialQuery,
      query: null,
      results: [],
      loading: false,
      paginator: null,
      sortBy: 'BusinessName',
      sortDescending: false,
      hitInfiniteScrollMax: false
    };

    $scope.search = function() {
      var isNewQuery =  $scope.data.query !== $scope.data.proposedQuery;

      if (isNewQuery) {
        // commit the proposed query
        $scope.data.query = $scope.data.proposedQuery;

        if ($scope.data.query) {
          // a query is required for the search to be executed
          $scope.fetch();
          segmentio.track(searchBuyersMode ? metric.SEARCH_FOR_BUYER : metric.SEARCH_FOR_SELLER);
        }
      }
    };

    $scope.fetch = function() {
      // search means "start from the beginning with current criteria"
      $scope.data.paginator = null;
      $scope.data.hitInfiniteScrollMax = false;
      $scope.data.results.length = 0;

      if ($scope.data.query) {
        // a query is required for the search to be executed
        $scope.fetchNextResults();
      }
    };

    $scope.fetchNextResults = function() {
      var paginator = $scope.data.paginator,
          promise;
      if (paginator && !paginator.hasMore()) {
        if (paginator.hitMaximumLimit()) {
          $scope.data.hitInfiniteScrollMax = true;
        }
        return;
      }

      $scope.data.loading = true;
      promise = lastPromise = BusinessSearch.search(
        $scope.data.searchBuyersMode,
        $scope.data.query,
        $scope.data.sortBy,
        $scope.data.sortDescending,
        paginator
      );

      promise.then(
        function(result) {
          if (promise !== lastPromise) { return; }
          $scope.data.loading = false;
          $scope.data.paginator = result.$paginator;
          Array.prototype.push.apply($scope.data.results, result.SearchResults);
        }, function (/*error*/) {
          if (promise !== lastPromise) { return; }
          $scope.data.loading = false;
        }
      );
    };

    $scope.sortBy = function (fieldName) {
      if ($scope.data.sortBy === fieldName) {
        // already sorting by this field, just flip the direction
        $scope.data.sortDescending = !$scope.data.sortDescending;
      } else {
        $scope.data.sortBy = fieldName;
        $scope.data.sortDescending = false;
      }
      $scope.fetch();
    };

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    var focusField = angular.element('#inputBuyer');

    $scope.close = function() {
      dialog.close();
      if (focusField.length > 0) {
        focusField.focus();
      }
    };

    $scope.select = function(business) {
      dialog.close(business);
      if (focusField.length > 0) {
        focusField.focus();
      }
    };

    // Do a search with the initial query
    $scope.search();

  });
