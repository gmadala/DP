'use strict';

describe('Directive: nxgInput', function () {
  beforeEach(module('nextgearWebApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<div nxg-input></div>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe(' {{ model }}');
  }));
});
