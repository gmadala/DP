(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgAddress', nxgAddress);

  nxgAddress.$inject = [];

  function nxgAddress() {

    return {
      template: '<span>{{ address.Line1 }} <br/><span ng-show="address.Line2">{{ address.Line2 }}<br/></span> {{ address.City && address.City + \', \' }} {{ address.State }} {{ address.Zip }}</span>',
      scope: {
        address: '=nxgAddress'
      },
      restrict: 'A'
    };

  }
})();
