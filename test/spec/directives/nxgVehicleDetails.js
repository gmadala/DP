'use strict';

describe('Directive: nxgVehicleDetails', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgVehicleDetails/nxgVehicleDetails.html'));

  var element,
    outerScope,
    scope,
    elem,
    stockMock = 5555;

  beforeEach(inject(function ($rootScope, $compile) {
    outerScope = $rootScope.$new();
    outerScope.isCollapsed = true;
    outerScope.stockNum = stockMock;
    element = angular.element('<div vehicle-details collapse="isCollapsed" stock-number="stockNum"></div>');

    element = $compile(element)(outerScope);
    $rootScope.$digest();
  }));

  // it('should expose stock number and collapse variables on isolate scope', function() {
  //   var iScope = element.scope();

  //   expect(iScope.stockNumber).toBe(stockMock);
  //   expect(iScope.collapse).toBe(true);
  // })

  // describe('controller', function() {
  //   var ctrl,
  //   scope,
  //   detailsMock;

  //   beforeEach(inject(function ($controller, $rootScope, $compile, VehicleDetails) {
  //     scope = element.scope();
  //     elem = $compile(element)(scope);

  //     VehicleDetails.getDetails = function(stock) {
  //       return {
  //         then: function(success) {
  //           success({ foo: 'hey', bar: 'there' });
  //         }
  //       };
  //     };

  //     detailsMock = VehicleDetails;
  //   }));

  //   it('should load the vehicle detail info when uncollapsed', function() {
  //     spyOn(detailsMock, 'getDetails').andCallThrough();
  //     expect(scope.vehicleDetails).not.toBeDefined();
  //     scope.collapse = false;
  //     scope.$apply();

  //     expect(detailsMock.getDetails).toHaveBeenCalled();
  //     expect(scope.vehicleDetails).toEqual({ foo: 'hey', bar: 'there' });
  //   });
  // });
});
