'use strict';

describe('Directive: placeholder', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
      scope,
      timeout;

  beforeEach(inject(function($rootScope, $compile, $timeout) {
    Modernizr.input.placeholder = false; // simulate no placeholder support
    scope = $rootScope.$new();
    scope.foo = 'bar';
    timeout = $timeout;

    element = angular.element('<input type="text" ng-model="foo" placeholder="1234">');
    element = $compile(element)(scope);
    $rootScope.$digest();
  }));

  it('should display the value of the placeholder on blur if its value is null', function () {
    element.val('');
    element.trigger('blur');
    scope.$apply();
    timeout.flush();
    expect(element.val()).toBe('1234');
  });
});
