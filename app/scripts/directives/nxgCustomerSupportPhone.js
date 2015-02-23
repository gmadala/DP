'use strict';

// This directive will display all available customer service number. This directive should be used in pre auth
// pages:
// * recover login information
angular.module('nextgearWebApp')
  .directive('nxgCustomerSupportPhone', function () {
    return {
      restrict: 'E',
      replace: true,
      template:
      '<table class="error-table">'+
      '  <tr>'+
      '    <td>United States</td>'+
      '    <td>1.888.969.3721</td>'+
      '  </tr>'+
      '  <tr>'+
      '    <td>Canada - Quebec</td>'+
      '    <td>1.877.864.9291</td>'+
      '  </tr>'+
      '  <tr>'+
      '    <td>Canada - National</td>'+
      '    <td>1.855.864.9291</td>'+
      '  </tr>'+
      '</table>'
    };
  });
