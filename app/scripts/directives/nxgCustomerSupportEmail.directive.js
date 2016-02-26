(function() {
  'use strict';

// This directive will display all available customer service email addresses. This directive should be used in pre auth
// pages:
// * login page
  angular
    .module('nextgearWebApp')
    .directive('nxgCustomerSupportEmail', nxgCustomerSupportEmail);

  nxgCustomerSupportEmail.$inject = [];

  function nxgCustomerSupportEmail() {

    return {
      restrict: 'E',
      replace: true,
      template: '<span class="container">' +
      '  <span class="row">' +
      '    <span class="col-xs-12">' +
      '      United States: <a href="mailto:CustomerService@nextgearcapital.com">CustomerService@nextgearcapital.com</a><br />' +
      '      Toronto: <a href="mailto:DealerServicesToronto@nextgearcapital.com">DealerServicesToronto@nextgearcapital.com</a><br />' +
      '      Montreal: <a href="mailto:DealerServicesMontreal@nextgearcapital.com">DealerServicesMontreal@nextgearcapital.com</a><br />' +
      '    </span>' +
      '  </span>' +
      '</span>'
    };

  }
})();
