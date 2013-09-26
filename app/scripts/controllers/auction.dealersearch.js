'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDealerSearchCtrl', function($scope, $dialog, User, DealerNumberSearch) {
    var prv = {
      searchByNumberHandler: function(business) {
        if (business) {
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
                  autoQueryCredit: false
                };
              }
            }
          };
          $dialog.dialog(dialogOptions).open();
        }
        else {
          // TODO: Show a no results found message.
        }
      },
      searchByNumberErrorHandler: function(reason) {
        // TODO: Show error
        console.error(reason);
      }
    };

    /*** Number Search ***/
    $scope.numberSearch = {
      query: {},
      invalid: {},
      search: function() {
        if (this.validate()) {
          var dealerNumber = this.query.dealerNumber,
            auctionAccessNumber = this.query.auctionAccessNumber;

          if (dealerNumber) {
            DealerNumberSearch.searchByDealerNumber(dealerNumber).then(
              prv.searchByNumberHandler,
              prv.searchByNumberErrorHandler
            );
          }
          else if (auctionAccessNumber) {
            DealerNumberSearch.searchByAuctionAccessNumber(auctionAccessNumber).then(
              prv.searchByNumberHandler,
              prv.searchByNumberErrorHandler
            );
          }
        }
      },
      validate: function() {
        if (!this.query.dealerNumber && !this.query.auctionAccessNumber) {
          this.invalid.dealerOrAccessNumber = true;
          return false; // invalid
        }
        else {
          this.invalid = {};
          return true; // valid
        }
      }
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
        }
        if (!this.query.city && !this.query.state) {
          this.invalid.CityOrState = true;
          valid = false;
        }
        return valid;
      }
    };

// Get list of states
    $scope.states = User.getStatics().states;
  })
;
