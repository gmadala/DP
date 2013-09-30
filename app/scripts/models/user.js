'use strict';

angular.module('nextgearWebApp')
  .factory('User', function($q, api, Base64) {
    // Private
    var info = null,
      statics = null,
      paySellerOptions = [];

    var calculateCanPayBuyer = function() {
      if (!info) {
        return undefined;
      }

      return info.IsBuyerDirectlyPayable && info.HasUCC;
    };

    // Public API
    return {
      isLoggedIn: function() {
        return api.hasAuthToken();
      },

      authenticate: function(username, password) {
        var self = this;
        return api.request(
          'POST',
          '/UserAccount/Authenticate', {}, {
            Authorization: 'CT ' + Base64.encode(username + ':' + password)
          })
          .then(function(authResult) {
            api.setAuthToken(authResult.Token);
            // fetch the dealer info & statics every time there's a new session (user could have changed)
            return $q.all([self.refreshInfo(), self.refreshStatics()]).then(
              function () {
                return {
                  showUserInit: authResult.ShowUserInitialization
                };
              }
            );
          });
      },

      refreshStatics: function() {
        return api.request('GET', '/Dealer/Static').then(function(data) {
          statics = {
            // API translation layer -- add transformation logic here as needed
            productTypes: data.ProductType || [],
            colors: data.Colors || [],
            states: data.States || [],
            locations: data.Locations || [],
            bankAccounts: data.BankAccounts || [],
            linesOfCredit: data.LinesOfCredit || [],
            titleLocationOptions: data.TitleLocationOptions || [],
            paymentMethods: data.PaymentMethods || []
          };
          return statics;
        });
      },

      getStatics: function() {
        return statics;
      },

      refreshInfo: function() {
        return api.request('GET', '/Dealer/Info').then(function(data) {
          info = data;
          return info;
        });
      },

      getInfo: function() {
        return info;
      },

      infoLoaded: function() {
        return info !== null;
      },

      isDealer: function() {
        return info && info.DealerAuctionStatusForGA === 'Dealer';
      },

      canPayBuyer: calculateCanPayBuyer,

      getPaySellerOptions: function() {
        // when flooring a car, the options this user has to pay seller vs. pay buyer
        var payBuyerAllowed = calculateCanPayBuyer();

        if (!angular.isDefined(payBuyerAllowed)) {
          return null;
        }

        if (paySellerOptions.length === 0) {
          if (payBuyerAllowed) {
            paySellerOptions.push(false, true); // buyer or seller
          } else {
            paySellerOptions.push(true); // seller only
          }
        }

        // always return the same array object so that this can be used in a binding
        return paySellerOptions;
      }

    };
  });
