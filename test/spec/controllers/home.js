'use strict';

describe('Controller: HomeCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var HomeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
      HomeCtrl = $controller('HomeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of payments to the scope', function () {
    expect(scope.payments.length).toBe(1);
  });

  it('should attach a list of curtailment to the scope', function () {
    expect(scope.curtailment.length).toBe(1);
  });

  it('should attach isCollapsed to the scope', function () {
    expect(scope.isCollapsed).toBe(true);
  });

  it('should attach schPayments to the scope', function () {
    expect(scope.schPayments.length).toBe(1);
  });

  it('should attach receipts to the scope', function () {
    expect(scope.receipts.length).toBe(1);
  });

  it('should attach floorplan to the scope', function () {
    expect(scope.floorplan.length).toBe(1);
  });
});
