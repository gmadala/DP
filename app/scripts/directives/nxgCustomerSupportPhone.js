'use strict';

// This directive will display all available customer service number. This directive should be used in pre auth
// pages:
// * recover login information
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
