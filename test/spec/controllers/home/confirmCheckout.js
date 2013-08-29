'use strict';

describe('Controller: ConfirmCheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ConfirmCheckoutCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfirmCheckoutCtrl = $controller('ConfirmCheckoutCtrl', {
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
