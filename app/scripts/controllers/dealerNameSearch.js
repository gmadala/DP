'use strict';

angular.module('nextgearWebApp')
  .controller('DealerNameSearchCtrl', function($scope, dialog, $dialog, DealerNameSearch, CreditQuery, User, options) {
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
        if (DealerNameSearch.hasMoreData()) {
          this.loading = true;
          DealerNameSearch.loadMoreData().then(function(results) {
            this.loading = false;
            this.results = this.results.concat(results);
          }.bind(this));
        }
      }
    };

    $scope.showCreditQuery = function(business) {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/creditQuery.html',
        controller: 'CreditQueryCtrl',
        resolve: {
          options: function() {
            return {
              businessId: business.BusinessId,
              businessNumber: business.BusinessName,
              auctionAccessNumbers: business.AuctionAccessDealershipNumbers.join(', '),
              businessName: business.BusinessName,
              address: business.Address,
              city: business.City,
              state: business.State,
              zipCode: business.PostalCode,
              autoQueryCredit: true
            };
          }
        }
      };
      $dialog.dialog(dialogOptions).open();
      dialog.close();
    };

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      dialog.close();
    };

    // Do an initial search with the initial query
    $scope.dealerNameSearch.search();

    // Get list of states
    $scope.states = User.getStatics().states;
  });
