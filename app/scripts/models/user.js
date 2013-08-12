'use strict';

angular.module('nextgearWebApp')
  .service('User', function(api, $http, $rootScope, Base64) {
    // Private
    var info = null;
    var statics = null;
    var authToken = null;

    // Public API
    this.isLoggedIn = function () {
      return authToken !== null;
    };

    this.getAuthToken = function() {
      return authToken;
    };

    this.authenticate = function(username, password) {
      console.log('authenticating with: ' + username + '/' + password);
      var self = this;
      var promise = api.request(
        'POST',
        '/UserAccount/Authenticate', {}, {
          Authorization: 'CT ' + Base64.encode(username + ':' + password)
        });
      promise.then(function(data) {
        authToken = data;
        // set a default Authorization header with the authentication token
        $http.defaults.headers.common.Authorization = 'CT ' + data;
        // fetch the dealer info & statics every time there's a new session (user could have changed)
        self.refreshInfo();
        self.refreshStatics();
      });
      return promise;
    };

    this.refreshStatics = function () {
      var promise = api.request('GET', '/Dealer/Static');
      promise.then(function(data) {
        statics = data;
      });
      return promise;
    };

    this.getStatics = function() {
      return statics;
    };

    this.refreshInfo = function() {
      var promise = api.request('GET', '/Dealer/Info');
      promise.then(function(data) {
        info = data;
      });
      return promise;
    };

    this.getInfo = function() {
      return info;
    };

    this.isDealer = function() {
      return info && info.DealerAuctionStatusForGA === 'Dealer';
    };
  });
