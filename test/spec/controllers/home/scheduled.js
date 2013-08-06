'use strict';

describe('Controller: ScheduledCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ScheduledCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScheduledCtrl = $controller('ScheduledCtrl', {
      $scope: scope
    });
  }));

  it('should attach schPayments to the scope', function () {
    expect(scope.schPayments.length).toBe(1);
  });

  it('should attach a list of curtailment to the scope', function () {
    expect(scope.curtailment.length).toBe(1);
  });

});
