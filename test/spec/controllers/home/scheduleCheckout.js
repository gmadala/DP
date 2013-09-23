'use strict';

xdescribe('Controller: ScheduleCheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ScheduleCheckoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScheduleCheckoutCtrl = $controller('ScheduleCheckoutCtrl', {
      $scope: scope,
      dialog: {
        close: function() {}
      }
    });
  }));

  it('close function should exist in the scope', function () {
    expect(scope.close).toBeDefined();
  });
});
