'use strict';

describe('Directive: nxgInput', function () {
  beforeEach(module('nextgearWebApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<nxg-input></nxg-input>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the nxgInput directive');
  }));
});
