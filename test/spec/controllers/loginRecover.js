'use strict';

describe('Controller: LoginRecoverCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var LoginRecoverCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginRecoverCtrl = $controller('LoginRecoverCtrl', {
      $scope: scope
    });
  }));

});
