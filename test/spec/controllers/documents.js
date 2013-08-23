'use strict';

describe('Controller: DocumentsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var DocumentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocumentsCtrl = $controller('DocumentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of documents to the scope', function () {
    expect(scope.documents.length).toBe(3);
  });

  it('should attach a list of collateralProtection to the scope', function () {
    expect(scope.collateralProtection.length).toBe(4);
  });
});
