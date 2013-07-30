'use strict';

describe('Controller: FloorCarCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorCarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FloorCarCtrl = $controller('FloorCarCtrl', {
      $scope: scope
    });
  }));

  it('should attach a openBusinessSearch funtion to the scope', function () {
    expect(scope.openBusinessSearch).toBeDefined();
  });
});
