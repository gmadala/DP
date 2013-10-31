'use strict';

angular.module('nextgearWebApp')
  .config(function($provide) {
    $provide.decorator('nxgConfig', ['$delegate', function($delegate) {
      return angular.extend({}, $delegate, {
        apiBase: '',
        showReloadWarning: false
      });
    }]);
  });
