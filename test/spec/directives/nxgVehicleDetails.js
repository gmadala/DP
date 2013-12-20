'use strict';

describe('Directive: nxgVehicleDetails', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgVehicleDetails/nxgVehicleDetails.html'));

  var element,
    outerScope,
    scope,
    elem,
    foo = true,
    stockMock = 5555,
    vehicleDetails = null,
    detailsMock;

  beforeEach(inject(function ($rootScope, $compile) {
    outerScope = $rootScope.$new();
    outerScope.isCollapsed = foo;
    outerScope.stockNum = stockMock;
    element = angular.element('<div vehicle-details collapse="isCollapsed" stock-number="stockNum"></div>');

    element = $compile(element)(outerScope);
    $rootScope.$digest();
  }));

  it('should expose stock number and collapse variables on isolate scope', function() {
    var iScope = element.scope();

    expect(iScope.stockNumber).toBe(stockMock);
    expect(iScope.collapse).toBe(foo);
  })

  describe('controller', function() {
    var ctrl,
    scope;

    beforeEach(inject(function ($controller, $rootScope, $compile) {
      scope = element.scope();
      elem = $compile(element)(scope);
      ctrl = elem.controller('nxgVehicleDetails');
    }));
  })
});
