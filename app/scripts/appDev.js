'use strict';

angular.module('nextgearWebApp')
  .run(function($rootScope, $location, apiBaseUrl) {
    // If ?mock exists, set the baseUrl to nothing (localhost)
    if ($location.absUrl().match(/\?mock/)) {
      apiBaseUrl.set('');
    };
  });
