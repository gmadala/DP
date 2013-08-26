'use strict';

angular.module('nextgearWebApp')
  .controller('BusinessSearchCtrl', function ($scope, dialog, BusinessSearch, initialQuery, mode) {

    $scope.mode = mode;
    $scope.query = initialQuery;

    $scope.businessSearch = {
      loading: false,
      results: [],
      loadMoreData: function() {
        this.loading = true;
        BusinessSearch.searchSeller().then(function(results) {
          this.loading = false;
          this.results = this.results.concat(results.DealerInfoList);
        }.bind(this));
      }
    };

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };

    $scope.select = function (business) {
      dialog.close(business);
    };

  });
