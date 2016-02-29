'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDealerSearchCtrl', function($scope, $dialog, BusinessSearch) {

    var lastPromise;

    $scope.data = {
      proposedQuery: '',
      query: null,
      results: [],
      loading: false,
      paginator: null,
      sortBy: 'BusinessName',
      sortDescending: false,
      hitInfiniteScrollMax: false
    };

    $scope.search = function() {
      var isNewQuery = $scope.data.query !== $scope.data.proposedQuery;

      $scope.data.query = $scope.data.proposedQuery;
      $scope.validity = angular.copy($scope.searchControls);

      if ($scope.validity && $scope.validity.$invalid) {
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
      var promise;
      var paginator = $scope.data.paginator;
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
          if (promise !== lastPromise) {
            return;
          }
          $scope.data.loading = false;
          $scope.data.paginator = result.$paginator;
          Array.prototype.push.apply($scope.data.results, result.SearchResults);
        }, function(/*error*/) {
          if (promise !== lastPromise) {
            return;
          }
          $scope.data.loading = false;
        }
      );
    };

    $scope.sortBy = function(fieldName) {
      if ($scope.data.sortBy === fieldName) {
        // already sorting by this field, just flip the direction
        $scope.data.sortDescending = !$scope.data.sortDescending;
      } else {
        $scope.data.sortBy = fieldName;
        $scope.data.sortDescending = false;
      }
      $scope.fetch();
    };

    /*** Name Search ***/
    $scope.nameSearch = {
      query: {},
      invalid: {},
      search: function() {
        if (this.validate()) {
          var dealerName = this.query.dealerName,
            city = this.query.city,
            state = this.query.state;

          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'views/modals/dealerNameSearch.html',
            controller: 'DealerNameSearchCtrl',
            dialogClass: 'modal modal-large',
            resolve: {
              options: function() {
                return {
                  dealerName: dealerName,
                  city: city,
                  state: state
                };
              }
            }
          };
          $dialog.dialog(dialogOptions).open();
        }
      },
      validate: function() {
        var valid = true;
        this.invalid = {};

        if (!this.query.dealerName) {
          this.invalid.dealerName = true;
          valid = false;
        } else if (this.query.dealerName.length < 3) {
          this.invalid.minlength = true;
          valid = false;
        }

        if (!this.query.city && !this.query.state) {
          this.invalid.CityOrState = true;
          valid = false;
        }
        if (this.query.city && !this.query.city.match(/^[A-Za-z ]*$/)) {
          this.invalid.cityFormat = true;
          valid = false;
        }
        return valid;
      }
    };

    /*** Private ***/
    var prv = {
      searchByNumberHandler: function(business) {
        if (business) {
          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'views/modals/creditQuery.html',
            controller: 'CreditQueryCtrl',
            dialogClass: 'modal modal-medium',
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
                  autoQueryCredit: false
                };
              }
            }
          };
          $dialog.dialog(dialogOptions).open();
        }
        else {
          if (this.auctionNumInactive) {
            this.noresults.dealerNumber = true;
          }
          else {
            this.noresults.auctionAccessNumber = true;
          }
        }
      }.bind($scope.numberSearch)
    };

    prv.searchByNumberHandler();
  });
