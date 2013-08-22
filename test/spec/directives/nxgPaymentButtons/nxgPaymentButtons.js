'use strict';

describe('Directive: nxgPaymentButtons', function () {

  var element,
      scope;

  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgPaymentButtons/nxgPaymentButtons.html'));

  it('should toggle the value of `isAdded`', inject(function($rootScope, $compile) {
    element = angular.element('<div nxg-payment-buttons="foo.type" is-added="foo.added"></div>');
    scope = $rootScope;
    scope.foo = {type: 'fee', added: false};
    $compile(element)(scope);
    scope.$digest();

    expect(scope.foo.added).toBe(false);
    element.find('button').click();
    expect(scope.foo.added).toBe(true);
    element.find('button').click();
    expect(scope.foo.added).toBe(false);
  }));

  it('should toggle the value of `isPayoff`', inject(function($rootScope, $compile) {
    element = angular.element('<div nxg-payment-buttons="foo.type" is-added="foo.added" is-payoff="foo.payoff"></div>');
    scope = $rootScope;
    scope.foo = {type: 'payment', added: false, payoff: false};
    $compile(element)(scope);
    scope.$digest();

    expect(scope.foo.added).toBe(false);
    element.find('button')[1].click();
    expect(scope.foo.added).toBe(true);
    expect(scope.foo.payoff).toBe(true);
    element.find('button')[1].click();
    expect(scope.foo.added).toBe(false);
    expect(scope.foo.payoff).toBeUndefined();
  }));
});
