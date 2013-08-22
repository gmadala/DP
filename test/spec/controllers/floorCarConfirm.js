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

  it('should attach the form data to the scope', function () {
    expect(scope.formData).toBe(formDataMock);
  });

  it('should provide a confirm function that closes the dialog with true result', function () {
    spyOn(dialogMock, 'close');
    scope.confirm();
    expect(dialogMock.close).toHaveBeenCalledWith(true);
  });

  it('should provide a cancel function that closes the dialog with false result', function () {
    spyOn(dialogMock, 'close');
    scope.close();
    expect(dialogMock.close).toHaveBeenCalledWith(false);
  });
});
