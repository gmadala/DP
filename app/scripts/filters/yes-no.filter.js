'use strict';

angular.module('nextgearWebApp')
  .filter('yesno', function (gettextCatalog) {
    return function(yesno) {
      return yesno ? gettextCatalog.getString('Yes') : gettextCatalog.getString('No');
    };
  });
