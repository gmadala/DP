'use strict';

angular.module('nextgearWebApp')
  .filter('yesno', function () {
    return function(yesno) {
      return yesno ? 'Yes' : 'No';
    };
  });
