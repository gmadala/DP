(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('BusinessSearchCtrl', BusinessSearchCtrl);

  BusinessSearchCtrl.$inject = ['$scope', '$uibModalInstance', 'BusinessSearch', 'initialQuery', 'searchBuyersMode', 'closeNow'];

  function BusinessSearchCtrl($scope, $uibModalInstance, BusinessSearch, initialQuery, searchBuyersMode, closeNow) {

    var lastPromise;
    var uibModalInstance = $uibModalInstance;

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

    $scope.$watch(
      function() {
        return closeNow();
      },
      function(newVal) {
        if(newVal) {
          uibModalInstance.close();
        }
      }
    );

    $scope.search = function() {
      var isNewQuery =  $scope.data.query !== $scope.data.proposedQuery;
      // commit the proposed query
      $scope.data.query = $scope.data.proposedQuery;

      $scope.validity = angular.copy($scope.searchControls);

      if($scope.validity && $scope.validity.$invalid) {
        $scope.data.results.length = 0;
        return;
      }
      if (isNewQuery) {
        $scope.fetch();
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
    var focusField = null;

    focusField = angular.element('#inputBiz').next('button');

    $scope.close = function() {
      uibModalInstance.close();
      if (focusField.length > 0) {
        focusField.focus();
      }
    };

    $scope.select = function(business) {
      uibModalInstance.close(business);
      if (focusField.length > 0) {
        focusField.focus();
      }
    };

    // Do a search with the initial query
    $scope.search();

  }
})();
