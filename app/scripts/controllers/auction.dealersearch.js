'use strict';

angular.module('nextgearWebApp')
  .controller('AuctionDealerSearchCtrl', function($scope, $dialog, User, DealerNumberSearch) {
    $scope.onlyNumbersPattern = /^\d+$/;

    /*** Number Search ***/
    $scope.numberSearch = {
      dealerNumInactive: false,
      auctionNumInactive: false,
      searchInProgress: false,
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
        var which = this;

        if (this.validate()) {
          this.searchInProgress = true;
          if (!this.dealerNumInactive) {
            DealerNumberSearch.searchByDealerNumber(this.query.dealerNumber).then( function(business) {
              which.searchInProgress = false;
              prv.searchByNumberHandler(business);
            });
          }
          else {
            DealerNumberSearch.searchByAuctionAccessNumber(this.query.auctionAccessNumber).then( function(business) {
              which.searchInProgress = false;
              prv.searchByNumberHandler(business);
            });
          }
        }
      },
      validate: function() {
        var isValid = false,
          dealerNumInput = $scope.numberSearchForm.dealerNum,
          auctionAccessNumInput = $scope.numberSearchForm.auctionAccessNum,
          missingRequiredDealerNum = !(this.dealerNumInactive || dealerNumInput.$viewValue),
          missingRequiredAuctionAccessNum = !(this.auctionNumInactive || auctionAccessNumInput.$viewValue);

        this.invalid = {
          required: {},
          pattern: {}
        };

        if (missingRequiredDealerNum && missingRequiredAuctionAccessNum) {
          this.invalid.required.dealerOrAccessNumber = true;
        }
        else if (missingRequiredDealerNum) {
          this.invalid.required.dealerNumber = true;
        }
        else if (missingRequiredAuctionAccessNum) {
          this.invalid.required.auctionAccessNumber = true;
        }
        else if (!this.dealerNumInactive && dealerNumInput.$error.pattern) {
          this.invalid.pattern.dealerNumber = true;
        }
        else if (!this.auctionNumInactive && auctionAccessNumInput.$error.pattern) {
          this.invalid.pattern.auctionAccessNumber = true;
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
            dialogClass: 'modal search-modal dealer-search-modal',
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
