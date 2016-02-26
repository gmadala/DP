(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgDealerCustomerSupportPhone', nxgDealerCustomerSupportPhone);

  nxgDealerCustomerSupportPhone.$inject = ['dealerCustomerSupportPhone'];

  function nxgDealerCustomerSupportPhone(dealerCustomerSupportPhone) {

    return {
      restrict: 'E',
      replace: false,
      link: function (scope, element) {
        dealerCustomerSupportPhone.then(function (phoneNumber) {
          element.html('<span class="nxg-phone">' + phoneNumber.formatted + '</span');
        });
      }
    };

  }
})();
