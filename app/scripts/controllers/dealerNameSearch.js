'use strict';

angular.module('nextgearWebApp')
  .controller('DealerNameSearchCtrl', function($scope, dialog, DealerNameSearch, CreditQuery, options) {
    $scope.query = {
      name: options.dealerName,
      city: options.city,
      state: options.state
    };

    $scope.dealerNameSearch = {
      loading: false,
      results: [],
      search: function() {
        this.loading = true;
        DealerNameSearch.search($scope.query.name, $scope.query.city, $scope.query.state).then(
          function(data) {
            this.loading = false;
            this.results = data;
          }.bind(this));
      },
      loadMoreData: function() {
        this.loading = true;
        DealerNameSearch.loadMoreData().then(function(results) {
          this.loading = false;
          this.results = this.results.concat(results);
        }.bind(this));
      }
    };

    $scope.creditQuery = {
      get: function(business) {
        CreditQuery.get(business.BusinessId).then(
          function(data) {
            console.log('got credit query - ' + data);
          }
        );
      }
    };

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };

    // Do an initial search with the initial query
    $scope.dealerNameSearch.search();
  });
