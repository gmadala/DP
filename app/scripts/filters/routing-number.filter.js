(function () {
  'use strict';

  angular.module('nextgearWebApp')
    .filter('routingNumber', routingNumber);

  routingNumber.$inject = ['gettext', 'gettextCatalog'];

  /**
   * A filter that generates the label and value for routing number based on the specifications given by the
   * user's country.
   *
   * Currently used in nxgFinancialAccount.js
   */
  function routingNumber(gettext, gettextCatalog) {
    return filter;

    function filter(value, isUnitedStates, isLabel) {
      gettext('Routing Number');
      gettext('Transit/Institution Number');

      value = !!value ? value.toString() : '';

      if (!isLabel) {
        return !!isUnitedStates ? value : convertUsToCanada(value);
      }
      else {
        return !!isUnitedStates ? gettextCatalog.getString('Routing Number') : gettextCatalog.getString('Transit/Institution Number');
      }

      // Given a US routing number 012345678. The Canadian Transit/Institution Number should be 45678-123.
      // Given a Canadian Transit/Institution Number 12345-678. The US and Discover routing number should be 067812345.
      function convertUsToCanada(routingNumber) {
        return routingNumber.substr(4) + '-' + routingNumber.substr(1, 3);
      }
    }
  }
})();
