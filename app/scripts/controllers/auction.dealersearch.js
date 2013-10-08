'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDealerSearchCtrl', function($scope, $dialog, User, DealerNumberSearch) {
    /*** Number Search ***/
    $scope.numberSearch = {
      dealerNumInactive: false,
      auctionNumInactive: false,
      query: {},
      invalid: {},
      noresults: {},
      setDealerNumActive: function() {
        this.dealerNumInactive = false;
        this.auctionNumInactive = true;
      },
      setAuctionNumActive: function() {
        this.dealerNumInactive = true;
        this.auctionNumInactive = false;
      },
      search: function() {
        this.noresults = {}; // reset the no result messages, we're doing a new search

        if (this.validate()) {
          var dealerNumber = this.query.dealerNumber,
            auctionAccessNumber = this.query.auctionAccessNumber;

          if (dealerNumber) {
            DealerNumberSearch.searchByDealerNumber(dealerNumber).then(
              prv.searchByNumberHandler
            );
          }
          else if (auctionAccessNumber) {
            DealerNumberSearch.searchByAuctionAccessNumber(auctionAccessNumber).then(
              prv.searchByNumberHandler
            );
          }
        }
      },
      validate: function() {
        var isValid = false,
          invalidDealerNum = !(this.query.dealerNumber || this.dealerNumInactive),
          invalidAuctionAccessNum = !(this.query.auctionAccessNumber || this.auctionNumInactive);

        this.invalid = {};

        if (invalidDealerNum && invalidAuctionAccessNum) {
          this.invalid.dealerOrAccessNumber = true;
        }
        else if (invalidDealerNum) {
          this.invalid.dealerNumber = true;
        }
        else if (invalidAuctionAccessNum) {
          this.invalid.auctionAccessNumber = true;
        }
        else {
          isValid = true;
        }
        return isValid;
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
            dialogClass: 'modal search-modal bus-search',
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
  })
;
