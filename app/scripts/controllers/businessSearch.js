'use strict';

angular.module('nextgearWebApp')
  .controller('BusinessSearchCtrl', function($scope, dialog, BusinessSearch, initialQuery, searchBuyersMode) {

    $scope.data = {
      searchBuyersMode: searchBuyersMode,
      query: initialQuery,
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
      $scope.fetchNextResults();
    };

    $scope.fetchNextResults = function() {
      var paginator = $scope.data.paginator;
      if (paginator && !paginator.hasMore()) {
        return;
      }

      $scope.data.loading = true;
      BusinessSearch.search(
          $scope.data.searchBuyersMode,
          $scope.data.query,
          $scope.data.sortBy,
          $scope.data.sortDescending,
          paginator
        ).then(
        function(result) {
          $scope.data.loading = false;
          $scope.data.paginator = result.$paginator;
          Array.prototype.push.apply($scope.data.results, result.SearchResults);
        }, function (/*error*/) {
          $scope.data.loading = false;
        }
      );
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
