"use strict";

angular.module('nextgearWebApp')
  .service('User', function(api, Base64) {
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
          });
          return promise;
      };

      this.refreshInfo = function() {
          info = api.request('GET', '/Dealer/Info/');
          return info;
      };

      this.getInfo = function() {
          return info;
      }
  });
