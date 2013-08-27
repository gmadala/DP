'use strict';

angular.module('nextgearWebApp')
  .factory('api', function($q, $http, $filter, nxgConfig) {
    return {
      request: function(method, url, data, headers) {
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
          },
          httpConfig = {
            method: method.toUpperCase(),
            url: nxgConfig.apiBase + url,
            headers: headers
          };
        httpConfig[httpConfig.method === 'GET' ? 'params' : 'data'] = data;

        $http(httpConfig).then(success, failure);

        return deferred.promise;
      },
      toBoolean: function (value) {
        if (value === null || !angular.isDefined(value)) {
          return null;
        } else {
          return String(value) === 'true';
        }
      },
      toInt: function (value) {
        var intVal = parseInt(value, 10);
        if (isNaN(intVal)) {
          return null;
        } else {
          return intVal;
        }
      },
      toShortISODate: function (value) {
        if (typeof value === 'string') {
          throw 'api.toShortISODate does not currently support (re)formatting of strings. Use a Date object.';
        }
        return $filter('moment')(value, 'YYYY-MM-DD') || null;
      },
      toUTCShortISODate: function (value) {
        if (typeof value === 'string') {
          throw 'api.toUTCShortISODate does not currently support (re)formatting of strings. Use a Date object.';
        }
        return $filter('momentUTC')(value, 'YYYY-MM-DD') || null;
      }
    };
  });
