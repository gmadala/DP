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

});
