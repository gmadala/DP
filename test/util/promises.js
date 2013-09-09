'use strict';

/**
 * Adds a convenience function to $q for testing named resolve().
 *
 * Calling $q.resolved(value) will create a promise that's already
 * resolved with the provided value, for fast mocking of methods that
 * produce promises.
 *
 * Note: you may have to call $scope.$apply() if you want to use
 * the promise results synchronously (angular $q waits until a digest
 * cycle to propagate promise resolution for performance reasons).
 */
angular.module('nextgearWebApp')
  .config(function($provide) {
    $provide.decorator('$q', ['$delegate', '$rootScope', function($delegate, $rootScope) {
      angular.extend($delegate, {
        resolved: function (value) {
          var deferred = $delegate.defer();
          deferred.resolve(value);
          return deferred.promise;
        }
      });
      return $delegate;
    }]);
  });
