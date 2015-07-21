(function () {
  'use strict';

  angular.module('nextgearWebApp')
    .filter('routingNumber', function(gettext, gettextCatalog) {
      return routingNumber;

      function routingNumber(value, isUnitedStates, isLabel) {
        gettext('Routing Number');
        gettext('Transit/Institution Number');

        value = !!value ? value.toString() : '';

        if (!isLabel) {
          return !!isUnitedStates ? value : value.substr(1, 5) + '-' + value.substr(6);
        }
        else {
          return !!isUnitedStates ? gettextCatalog.getString('Routing Number') : gettextCatalog.getString('Transit/Institution Number');
        }
      }
    });
})();
