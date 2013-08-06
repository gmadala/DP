'use strict';

describe('Controller: DashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var DashboardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DashboardCtrl = $controller('DashboardCtrl', {
      $scope: scope
    });
  }));

  it('should attach isCollapsed to the scope', function () {
    expect(scope.isCollapsed).toBe(true);
  });

  it('should attach a viewMode to the scope', function () {
    expect(scope.viewMode).toBeDefined();
  });

});
