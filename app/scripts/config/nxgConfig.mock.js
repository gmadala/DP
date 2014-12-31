'use strict';

angular.module('nextgearWebApp')
  .config(function($provide) {
    $provide.decorator('nxgConfig', ['$delegate', function($delegate) {
      return angular.extend({}, $delegate, {
        apiBase: '',
        apiDomain: ''
      });
    }]);
  })
  .config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('requestInterceptor');
  })
  .factory('requestInterceptor', function ($q) {
    return function(promise) {
      return promise.then(function(response) {
        // do something on success
        console.log(response.status, response.config.url);
        return response;
      }, function(response) {
        // do something on error
        return $q.reject(response);
      });
    };
  });
