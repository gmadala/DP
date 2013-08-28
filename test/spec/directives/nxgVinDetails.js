'use strict';

describe('Directive: nxgVinDetails', function () {
  beforeEach(module('nextgearWebApp'));

  var element;

  xit('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<nxg-vin-details></nxg-vin-details>');
    element = $compile(element)($rootScope);
  }));
});
