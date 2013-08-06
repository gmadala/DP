'use strict';

describe('Controller: FloorplanCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorplanCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FloorplanCtrl = $controller('FloorplanCtrl', {
      $scope: scope
    });
  }));

  it('should attach floorplan to the scope', function () {
    expect(scope.floorplan.length).toBe(1);
  });

  it('should attach a list of curtailment to the scope', function () {
    expect(scope.curtailment.length).toBe(1);
  });

});
