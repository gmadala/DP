'use strict';

angular.module('nextgearWebApp')
  .controller('BusinessSearchCtrl', function($scope, dialog, BusinessSearch, initialQuery, mode) {

    $scope.mode = mode;
    $scope.query = initialQuery;

    $scope.businessSearch = {
      loading: false,
      results: [],
      search: function() {
        this.loading = true;
        BusinessSearch.searchSeller($scope.query).then(function(results) {
          this.loading = false;
          this.results = results.SearchResults;
        }.bind(this));
      },
      loadMoreData: function() {
        if (BusinessSearch.hasMoreData()) {
          this.loading = true;
          BusinessSearch.loadMoreData().then(function(results) {
            this.loading = false;
            this.results = this.results.concat(results.SearchResults);
          }.bind(this));
        }
      }
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
    $scope.businessSearch.search();

  });
