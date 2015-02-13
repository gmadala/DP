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
      '<span>'+
      '  <span class="row-fluid">'+
      '    <span class="span4">United States</span>'+
      '    <span class="span8">: 1.888.969.3721</span>'+
      '  </span>'+
      '  <span class="row-fluid">'+
      '    <span class="span4">Canada - Quebec</span>'+
      '    <span class="span8">: 1.877.864.9291</span>'+
      '  </span>'+
      '  <span class="row-fluid">'+
      '    <span class="span4">Canada - National</span>'+
      '    <span class="span8">: 1.855.864.9291</span>'+
      '  </span>'+
      '</span>'
    };
  });
