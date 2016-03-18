'use strict';

describe('Controller: TopAuctionsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var TopAuctionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TopAuctionsCtrl = $controller('TopAuctionsCtrl', {
      $scope: scope
    });
  }));

  /* TODO: Write valid tests for this controller. It doesn't do anything but open and close a modal right now. */

});
