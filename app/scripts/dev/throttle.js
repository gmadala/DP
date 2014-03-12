'use strict';

angular.module('nextgearWebApp')
  .config(function ($provide) {
    $provide.decorator('$http', ['$delegate', '$q', '$timeout', function ($delegate, $q, $timeout) {
      var TIMEOUT_IN_MS = 4000,
        original = $delegate;

      // Api calls use $http() instead of $http[method] so we only need to catch that case
      return _.extend(
        function() {
          var deferred = $q.defer(),
            originalArgs = arguments;
          $timeout(function() {
            original.apply(original, originalArgs).then(
              function(response) {
                deferred.resolve(response);
              },
              function(response) {
                deferred.reject(response);
              }
            );
          }, TIMEOUT_IN_MS);
          return deferred.promise;
        }, original);
    }]);
  });