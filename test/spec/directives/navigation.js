'use strict';

describe('Directive: navigation', function () {
  beforeEach(module('nextgearWebApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<navigation></navigation>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the navigation directive');
  }));
});
