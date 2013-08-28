'use strict';

describe('Controller: EditTitleCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var EditTitleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditTitleCtrl = $controller('EditTitleCtrl', {
      $scope: scope
    });
  }));

  /* TODO: Write valid tests for this controller. It doesn't do anything but open and close a modal right now. */

});
