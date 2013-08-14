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
      $scope: scope,
      User: {
        foo: 'bar'
      }
    });
  }));

  it('should attach user object to the scope', function () {
    expect(scope.user.foo).toBe('bar');
  });

  it('should attach a default data object to the scope', function () {
    expect(scope.defaultData).toBeDefined();
  });

  it('should initialize live data with default data', function () {
    expect(angular.equals(scope.defaultData, scope.data)).toBe(true);
  });

  it('should have a reset function that resets data to default', function () {
    expect(scope.reset).toBeDefined();
    scope.data.UnitMake = 'Ford';
    scope.reset();
    expect(angular.equals(scope.defaultData, scope.data)).toBe(true);
  });
});
