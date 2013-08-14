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
});
