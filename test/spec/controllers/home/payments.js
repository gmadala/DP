'use strict';

describe('Controller: PaymentsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var PaymentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PaymentsCtrl = $controller('PaymentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of payments to the scope', function () {
    expect(scope.payments.length).toBe(1);
  });

  it('should attach a list of curtailment to the scope', function () {
    expect(scope.curtailment.length).toBe(1);
  });

});
