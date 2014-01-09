'use strict';

angular.module('nextgearWebApp')
  .factory('api', function($rootScope, $q, $http, $filter, $timeout, nxgConfig, messages, $cookies) {
    var authToken = null,
        sessionHasTimedOut = false,
        sessionTimeout = null;

    function onSessionTimeout(ob, debug) {
      var expiredSessionError = 'Your session expired due to inactivity. Please log in again.';
      sessionHasTimedOut = true;
      ob.resetAuthToken();
      return messages.add(expiredSessionError, debug + '401 error', null, function() {
        $rootScope.$broadcast('event:redirectToLogin');
      });
    }

    function resetSessionTimeout(ob, debug) {
      var SESSION_TIMEOUT_INTERVAL = 900000; // 15 minutes
      if (sessionTimeout) { $timeout.cancel(sessionTimeout); }
      sessionTimeout = $timeout(function(){
        $timeout.cancel(sessionTimeout);
        if (ob.hasAuthToken()) { onSessionTimeout(ob, debug); }
      }, SESSION_TIMEOUT_INTERVAL);
    }

    return {
      setAuthToken: function(token) {
        // save authToken on cookies to allow us to restore in case of reload
        $cookies.authToken = token;

        authToken = token;
        sessionHasTimedOut = false;
        // set a default Authorization header with the authentication token
        $http.defaults.headers.common.Authorization = 'CT ' + token;
      },
      resetAuthToken: function() {
        // clear saved token
        delete $cookies.authToken;
        delete $http.defaults.headers.common.Authorization;
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
        debug = httpConfig.method + ' ' + httpConfig.url + ': ';

        httpConfig[httpConfig.method === 'GET' ? 'params' : 'data'] = data;

        return $http(httpConfig).then(
          function (response) {
            var error;
            resetSessionTimeout(self, debug);
            if (response.data && angular.isDefined(response.data.Success)) {
              if (response.data.Success) {
                return response.data.Data;
              }
              else {
                if(response.data.Message === '401') {
                  if (!sessionHasTimedOut) {
                    error = onSessionTimeout(self, debug);
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
            resetSessionTimeout(self, debug);
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
        // remove commas from string number expression
        if (typeof value === 'string') {
          value = value.replace(/,/g, '');
        }

        var intVal = parseInt(value, 10);
        if (isNaN(intVal)) {
          return null;
        } else {
          return intVal;
        }
      },
      toFloat: function (value) {
        // remove commas from string number expression
        if (typeof value === 'string') {
          value = value.replace(/,/g, '');
        }

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
