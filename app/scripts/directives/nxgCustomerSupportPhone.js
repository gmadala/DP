'use strict';

// Confirmed with Ryan Gaddis 6/9/2014 to format number as (xxx) xxx-xxxx app-wide
// -Josh Kramer
//
// This does NOT replace the value in unsupported.html (which runs in older browsers and can't rely on
// AngularJS working)
angular.module('nextgearWebApp')
  .directive('nxgCustomerSupportPhone', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<span class="container">' +
      '  <span class="row">' +
      '    <span class="col-md-12">' +
      '      United States: 1-888-969-3721<br />' +
      '      Canada - Toronto: 1-877-864-9291<br />' +
      '      Canada - Montreal: 1-855-864-9291<br />' +
      '    </span>' +
      '  </span>' +
      '</span>'
    };
  });
