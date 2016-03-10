'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDealerSearchCtrl', function($scope, $uibModal, dealerSearch, User) {

    $scope.proposedQuery = null;
    $scope.searchExecuted = false;

    User.getInfo().then(function(info) {
      $scope.data = {
        query: null, // proposed query is copied here on search
        results: [],
        loading: false,
        paginator: null,
        auction: info.BusinessId,
        sortBy: 'BusinessName',
        sortDescending: false,
        hitInfiniteScrollMax: false
      };
    });

    $scope.search = function() {
      // search means "start from the beginning with current criteria"

      $scope.validity = angular.copy($scope.dealerSearchForm);

      $scope.data.paginator = null;
      $scope.data.hitInfiniteScrollMax = false;
      $scope.data.results.length = 0;

      // commit the proposed query
      $scope.data.query = angular.copy($scope.proposedQuery);

      // don't execute if the query length is less than 3 chars
      if($scope.validity && $scope.validity.$invalid) {
        return;
      }
      $scope.searchExecuted = true;
      $scope.fetchNextResults();
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
      dealerSearch.search(
        $scope.data.query,
        $scope.data.auction,
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

    $scope.viewDealer = viewDealer;

    /*** Private ***/
    function viewDealer(business) {
        if (business) {
          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'views/modals/credit-query.html',
            controller: 'CreditQueryCtrl',
            dialogClass: 'modal modal-medium',
            resolve: {
              options: function() {
                return {
                  businessId: business.businessId,
                  businessNumber: business.businessNumber,
                  businessAuctionAccessNumbers: business.businessAuctionAccessDealershipNumber,
                  businessName: business.businessName,
                  businessAddress: business.businessAddress,
                  businessCity: business.businessCity,
                  businessState: business.businessState,
                  businessZip: business.businessZip,
                  externalBusinessId: business.externalBusinessId,
                  autoQueryCredit: true
                };
              }
            }
          };
          $uibModal.open(dialogOptions).result.then(function() {
            $scope.search();
          });
        }
      }
  });
