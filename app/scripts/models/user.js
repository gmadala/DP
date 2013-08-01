'use strict';

angular.module('nextgearWebApp')
  .service('User', function(api, $http, Base64) {
    // Private
    var info = null;
    var authToken = null;

    // Public API
    this.isLogged = false;

    this.getAuthToken = function() {
      return authToken;
    };

    this.authenticate = function(username, password) {
      var promise = api.request(
        'POST',
        '/UserAccount/Authenticate', {}, {
          Authorization: 'CT ' + Base64.encode(username + ':' + password)
        });
      promise.then(function(data) {
        authToken = data;
        // set a default Authorization header with the authentication token
        $http.defaults.headers.common.Authorization = 'CT ' + data;
      });
      return promise;
    };

    this.refreshInfo = function() {
      var promise = api.request('GET', '/Dealer/Info/');
      promise.then(function(data) {
        info = data;
      });
      return promise;
    };

    this.getInfo = function() {
      return info;
    };

    this.isDealer = function() {
      return info && info.DealerAuctionStatusForGA === "Dealer";
    }
  });
