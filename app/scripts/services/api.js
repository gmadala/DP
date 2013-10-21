'use strict';

angular.module('nextgearWebApp')
  .factory('api', function($rootScope, $q, $http, $filter, nxgConfig, messages) {
    var authToken = null, timedOut = false;

    return {
      setAuthToken: function(token) {
        authToken = token;
        timedOut = false;
        // set a default Authorization header with the authentication token
        $http.defaults.headers.common.Authorization = 'CT ' + token;
      },
      resetAuthToken: function() {
        authToken = null;
      },
      hasAuthToken: function() {
        return !!authToken;
      },
      request: function(method, url, data, headers) {
        var httpConfig = {
          method: method.toUpperCase(),
          url: nxgConfig.apiBase + url,
          headers: headers
        },
        self = this,
        defaultError = 'Unable to communicate with the NextGear system. Please try again later.',
        expiredSessionError = 'Your session expired due to inactivity. Please log in again.',
        debug = httpConfig.method + ' ' + httpConfig.url + ': ';

        httpConfig[httpConfig.method === 'GET' ? 'params' : 'data'] = data;

        return $http(httpConfig).then(
          function (response) {
            var error;
            if (response.data && angular.isDefined(response.data.Success)) {
              if (response.data.Success) {
                return response.data.Data;
              }
              else {
                if(response.data.Message === '401') {
                  if (!timedOut) {
                    timedOut = true;
                    self.resetAuthToken();
                    error = messages.add(expiredSessionError, debug + '401 error', null, function() {
                      $rootScope.$broadcast('event:redirectToLogin');
                    });
                  }
                }
                else {
                  error = messages.add(response.data.Message || defaultError, debug + 'api error: ' + response.data.Message);
                }
                return $q.reject(error);
              }
            }
            else {
              error = messages.add(defaultError, debug + 'invalid API response: ' + response.data);
              return $q.reject(error); // Treat as unknown error
              //throw new Error('Invalid response'); // dev only
            }
          }, function (error) {
            error = messages.add(defaultError, debug + 'HTTP or connection error: ' + error);
            return $q.reject(error); // reject w/ appropriate error
          }
        );
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
      toFloat: function (value) {
        var floatVal = parseFloat(value);
        if (isNaN(floatVal)) {
          return null;
        } else {
          return floatVal;
        }
      },
      toShortISODate: function (value) {
        if (typeof value === 'string') {
          throw 'api.toShortISODate does not currently support (re)formatting of strings. Use a Date object.';
        }
        return $filter('moment')(value, 'YYYY-MM-DD') || null;
      },
      contentLink: function (path, params) {
        if (!path) {
          throw 'api.contentLink requires a path string';
        }

        var queryParts = [];

        angular.forEach(params, function(value, key) {
          queryParts.push(key + '=' + value);
        });

        if (authToken) {
          queryParts.push('AuthToken=' + authToken);
        }

        if (queryParts.length > 0) {
          return nxgConfig.apiBase + path + '?' + queryParts.join('&');
        } else {
          return nxgConfig.apiBase + path;
        }
      }
    };
  });
