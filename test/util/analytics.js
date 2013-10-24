'use strict';

/**
 * Prevent analytics from loading and tracking while running tests
 */
angular.module('segmentio')
  .config(function($provide) {
    $provide.decorator('segmentio', ['$delegate', function($delegate) {
      $delegate.load = angular.noop;
      return $delegate;
    }]);
  });
