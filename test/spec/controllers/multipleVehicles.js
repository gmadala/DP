'use strict';

describe('Controller: MultipleVehiclesCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var MultipleVehiclesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MultipleVehiclesCtrl = $controller('MultipleVehiclesCtrl', {
      $scope: scope
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
