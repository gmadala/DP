'use strict';

describe('Directive: nxgFluidContainer', function () {
  beforeEach(module('nextgearWebApp'));

  var element;

  beforeEach(inject(function($rootScope, $compile) {
    element = angular.element('<div nxg-fluid-container></div>');
    element = $compile(element)($rootScope);

  }));

  it('should add the fluid container class if we are on a logged in page', inject(function ($rootScope) {
    // to do
  }));
});
