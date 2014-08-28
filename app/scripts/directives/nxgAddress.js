'use strict';

angular.module('nextgearWebApp')
  .directive('nxgAddress', function () {
    return {
      template: '<div>{{ address.Line1 }} <br/><span ng-show="address.Line2">{{ address.Line2 }}<br/></span> {{ address.City && address.City + \', \' }} {{ address.State }} {{ address.Zip }}</div>',
      scope: {
        address: '=nxgAddress',
      },
      restrict: 'A',
      replace: true
    };
  });
