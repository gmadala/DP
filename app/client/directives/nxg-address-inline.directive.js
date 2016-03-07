(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgAddressInline', nxgAddressInline);

  nxgAddressInline.$inject = [];

  function nxgAddressInline() {

    return {
      template: '<span>{{ address.Line1 }} <span ng-show="address.Line2">{{ address.Line2 }}</span> {{ address.City && address.City + \', \' }} {{ address.State }} {{ address.Zip }}</span>',
      scope: {
        address: '=nxgAddressInline'
      },
      restrict: 'A'
    };

  }
})();
