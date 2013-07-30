'use strict';

describe('Controller: ReceiptsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ReceiptsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReceiptsCtrl = $controller('ReceiptsCtrl', {
      $scope: scope
    });
  }));

});
