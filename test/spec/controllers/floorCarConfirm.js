'use strict';

describe('Controller: FloorCarConfirmCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorCarConfirmCtrl,
    scope,
    dialogMock,
    formDataMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    dialogMock = {
      close: angular.noop
    };
    formDataMock = {};

    FloorCarConfirmCtrl = $controller('FloorCarConfirmCtrl', {
      $scope: scope,
      dialog: dialogMock,
      formData: formDataMock
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
