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
      sortDescending: false
    };

    $scope.search = function() {
      // search means "start from the beginning with current criteria"
      $scope.data.paginator = null;
      $scope.data.results.length = 0;

      var isNewQuery =  $scope.data.query !== $scope.data.proposedQuery;

      // commit the proposed query
      $scope.data.query = $scope.data.proposedQuery;

      if ($scope.data.query) {
        // a query is required for the search to be executed
        $scope.fetchNextResults();
        if (isNewQuery) {
          segmentio.track(searchBuyersMode ? metric.SEARCH_FOR_BUYER : metric.SEARCH_FOR_SELLER);
        }
      }
    };

    $scope.fetchNextResults = function() {
      var paginator = $scope.data.paginator,
          promise;
      if (paginator && !paginator.hasMore()) {
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
      $scope.search();
    };

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };

    $scope.select = function(business) {
      dialog.close(business);
    };

    // Do a search with the initial query
    $scope.search();

  });
