'use strict';

angular.module('nextgearWebApp')
  .factory('User', function($q, api, Base64) {
    // Private
    var info = null,
      statics = null,
      showUserInitialization = false,
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

      initializationRequired: function() {
        return showUserInitialization;
      },

      authenticate: function(username, password) {
        var self = this;
        return api.request(
          'POST',
          '/UserAccount/Authenticate', {}, {
            Authorization: 'CT ' + Base64.encode(username + ':' + password)
          })
          .then(function(data) {
            api.setAuthToken(data.Token);
            showUserInitialization = data.ShowUserInitialization;
            // fetch the dealer info & statics every time there's a new session (user could have changed)
            return $q.all([self.refreshInfo(), self.refreshStatics()]);
          });
      },

      refreshStatics: function() {
        var promise = api.request('GET', '/Dealer/Static');
        promise.then(function(data) {
          statics = {
            // API translation layer -- add transformation logic here as needed
            productTypes: data.ProductType || {},
            colors: data.Colors || {}, // map object: {id: name}
            states: data.States || {}, // map object: {id: name}
            locations: data.Locations || {}, // map object: {id: name}
            bankAccounts: data.BankAccounts || {}, // map object: {id: name}
            linesOfCredit: data.LinesOfCredit || {}, // map object: {id: name}
            titleLocationOptions: data.TitleLocationOptions || [], // array
            paymentMethods: data.PaymentMethods || []
          };
        });
        return promise;
      },

      getStatics: function() {
        return statics;
      },

      refreshInfo: function() {
        return api.request('GET', '/Dealer/Info').then(function(data) {
          info = data;
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
