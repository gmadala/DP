'use strict';

describe('Directive: nxgUnappliedFundsWidget', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgUnappliedFundsWidget/nxgUnappliedFundsWidget.html'));

  var element,
    isolateScope;

  beforeEach(inject(function ($rootScope, $compile, $httpBackend) {
    $httpBackend.whenGET('/payment/info').respond({Success: true});

    element = angular.element('<div nxg-unapplied-funds-widget></div>');
    element = $compile(element)($rootScope);
    isolateScope = element.scope();
    $rootScope.$apply();
  }));

  it('should add some content to the element', function () {
    expect(element.children().length > 0).toBe(true);
  });

  it('should create a new scope', inject(function ($rootScope) {
    expect(isolateScope).not.toBe($rootScope);
  }));

  it('should attach an unappliedFunds object to the scope', function () {
    expect(isolateScope.unappliedFunds).toBeDefined();
  });

  it('should attach an openRequestPayout function to the scope', function () {
    expect(typeof isolateScope.openRequestPayout).toBe('function');
  });


});
