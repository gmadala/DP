'use strict';

angular.module('nextgearWebApp')
  .controller('DealerNameSearchCtrl', function($scope, $uibModal, $uibModalInstance, DealerNameSearch, User, options) {

    var uibModal = $uibModal,
       uibModalInstance= $uibModalInstance;


    $scope.proposedQuery = {
      name: options.dealerName,
      city: options.city,
      state: options.state
    };

    $scope.data = {
      query: null, // proposed query is copied here on search
      results: [],
      loading: false,
      paginator: null,
      sortBy: 'BusinessName',
      sortDescending: false,
      hitInfiniteScrollMax: false
    };

    $scope.isQueryValid = function (query) {
      // name + either city or state is required
      return !!(query && query.name && (query.city || query.state));
    };

    $scope.search = function() {
      // search means "start from the beginning with current criteria"

      $scope.validity = angular.copy($scope.dealerNameSearch);

      $scope.data.paginator = null;
      $scope.data.hitInfiniteScrollMax = false;
      $scope.data.results.length = 0;

      // commit the proposed query
      $scope.data.query = angular.copy($scope.proposedQuery);

      if($scope.validity && $scope.validity.$invalid) {
        return;
      }

      if ($scope.isQueryValid($scope.data.query)) {
        // name + either city or state is required
        $scope.fetchNextResults();
      }
    };

    $scope.fetchNextResults = function() {
      var paginator = $scope.data.paginator;
      if (paginator && !paginator.hasMore()) {
        if (paginator.hitMaximumLimit()) {
          $scope.data.hitInfiniteScrollMax = true;
        }
        return;
      }

      $scope.data.loading = true;
      DealerNameSearch.search(
          $scope.data.query.name,
          $scope.data.query.city,
          $scope.data.query.state,
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

    $scope.showCreditQuery = function(business) {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/creditQuery.html',
        controller: 'CreditQueryCtrl',
        dialogClass: 'modal credit-query',
        resolve: {
          options: function() {
            return {
              businessId: business.BusinessId,
              businessNumber: business.BusinessNumber,
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
      uibModal.open(dialogOptions);
      uibModalInstance.close();
    };

    // Allow the dialog to close itself using the "Cancel" button.
    // The current `dialog` is magically injected thanks to AngularUI.
    $scope.close = function() {
      uibModalInstance.close();
    };

    // Do an initial search with the initial query
    $scope.search();

    // Get list of states
    User.getStatics().then(function(statics) {
      $scope.states = statics.states;
    });
  });
