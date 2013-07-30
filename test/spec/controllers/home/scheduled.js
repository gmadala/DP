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

});
