'use strict';

angular.module('nextgearWebApp')
  .factory('User', function($q, api, $http, $rootScope, Base64) {
    // Private
    var info = null,
      statics = null,
      authToken = null;

    // Public API
    return {
      isLoggedIn: function() {
        return authToken !== null;
      },

      getAuthToken: function() {
        return authToken;
      },

      authenticate: function(username, password) {
        var self = this;
        return api.request(
          'POST',
          '/UserAccount/Authenticate', {}, {
            Authorization: 'CT ' + Base64.encode(username + ':' + password)
          })
          .then(function(data) {
            authToken = data;
            // set a default Authorization header with the authentication token
            $http.defaults.headers.common.Authorization = 'CT ' + data;
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
            titleLocationOptions: data.TitleLocationOptions || [] // array
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
      }
    };
  });
