'use strict';

describe('Directive: nxgPaymentSummary', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgPaymentSummary/nxgPaymentSummary.html'));

  var element;

  it('should create an isolate scope', inject(function ($rootScope, $compile) {
    element = angular.element('<section nxg-payment-summary></section>');
    element = $compile(element)($rootScope);
    expect(element.scope()).not.toBe($rootScope);
  }));
});
