'use strict';

describe('Controller: FloorCarConfirmCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorCarConfirmCtrl,
    controller,
    scope,
    catalog,
    userMock,
    dialogMock,
    formDataMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, gettextCatalog) {
    controller = $controller;
    catalog = gettextCatalog;
    scope = $rootScope.$new();
    dialogMock = {
      close: angular.noop
    };
    formDataMock = {};
    userMock = {
      isDealer: function () {
        return true;
      },
      isUnitedStates: function () {
        return true;
      }
    };

    FloorCarConfirmCtrl = controller('FloorCarConfirmCtrl', {
      $scope: scope,
      dialog: dialogMock,
      formData: formDataMock,
      User: userMock,
      gettextCatalog: catalog
    });
  }));

  var createController = function () {
    FloorCarConfirmCtrl = controller('FloorCarConfirmCtrl', {
      $scope: scope,
      dialog: dialogMock,
      formData: formDataMock,
      User: userMock,
      gettextCatalog: catalog
    });
  };

  it('should attach the form data to the scope', function () {
    expect(scope.formData).toBe(formDataMock);
  });

  it('should attach the mode to the scope', function () {
    expect(scope.isDealer).toBe(true);
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

  it('should return en document by default.', function () {
    expect(scope.documentLink).not.toContain('CAE');
    expect(scope.documentLink).not.toContain('CAF');
    expect(scope.documentLink).not.toContain('ES');
  });

  it('should return es documents when language is es and country is US.', function () {
    catalog.currentLanguage = 'es';
    createController();
    expect(scope.documentLink).toContain('ES');
  });

  it('should return en documents when language is fr_CA and country is US.', function () {
    catalog.currentLanguage = 'fr_CA';
    createController();
    expect(scope.documentLink).not.toContain('CAE');
    expect(scope.documentLink).not.toContain('CAF');
    expect(scope.documentLink).not.toContain('ES');
  });

  it('should return en documents when language is es and country is Canada.', function () {
    catalog.currentLanguage = 'es';
    spyOn(userMock, 'isUnitedStates').andReturn(false);
    createController();
    expect(scope.documentLink).toContain('CAE');
  });

  it('should return en documents when language is en and country is Canada.', function () {
    catalog.currentLanguage = 'en';
    spyOn(userMock, 'isUnitedStates').andReturn(false);
    createController();
    expect(scope.documentLink).toContain('CAE');
  });

  it('should return fr documents when language is fr_CA and country is Canada.', function () {
    catalog.currentLanguage = 'fr_CA';
    spyOn(userMock, 'isUnitedStates').andReturn(false);
    createController();
    expect(scope.documentLink).toContain('CAF');
  });
});
