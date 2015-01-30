'use strict';

// Confirmed with Ryan Gaddis 6/9/2014 to format number as (xxx) xxx-xxxx app-wide
// -Josh Kramer
//
// This does NOT replace the value in unsupported.html (which runs in older browsers and can't rely on
// AngularJS working)
angular.module('nextgearWebApp')
  .value('customerSupportPhone', '888.969.3721')
  .directive('nxgCustomerSupportPhoneSimple', function (customerSupportPhone) {
    return {
      restrict: 'E',
      replace: true,
      template: '<span class="nxg-phone">' + customerSupportPhone + '</span>'
    };
  });
