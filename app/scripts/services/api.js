'use strict';

angular.module('nextgearWebApp')
  .service('api', function($q, $http, nxgConfig) {
    this.request = function(method, url, data, headers) {
      var deferred = $q.defer(),

      success = function(response) {
        if (angular.isDefined(response.data) && angular.isDefined(response.data.Success)) {
          if (response.data.Success) {
            deferred.resolve(response.data.Data);
          }
          else {
            deferred.reject(response.data.Message); // reject with error message
          }
        }
        else {
          //console.error(response);
          throw new Error('Invalid response'); //todo: only dev
        }
      },
      failure = function(/*error*/) {
        // retry or something?
        //console.error('Network failure', error);
        deferred.reject();
      };

      $http({
        method: method,
        url: nxgConfig.apiBase + url,
        data: data,
        headers: headers
      }).then(success, failure);

      return deferred.promise;
    };
  });
