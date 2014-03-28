'use strict';

ddescribe('Directive: placeholder', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
      scope;

  beforeEach(inject(function($rootScope, $compile) {
    Modernizr.input.placeholder = false; // simulate no placeholder support
    scope = $rootScope.$new();
    scope.foo = 'bar';

    element = angular.element('<input type="text" ng-model="foo" placeholder="1234"></input>');
    element = $compile(element)(scope);
    $rootScope.$digest();
  }));

  it('should display the value of the placeholder on blur if its value is null', function () {
    element.val('');
    element.trigger('blur');
    scope.$apply();
    expect(element.val()).toBe('1234');
  });
});
