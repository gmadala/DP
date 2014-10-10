'use strict';

describe('Controller: DocumentsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var DocumentsCtrl,
    scope,
    gettextCatalog;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _gettextCatalog_) {
    scope = $rootScope.$new();
    DocumentsCtrl = $controller('DocumentsCtrl', {
      $scope: scope
    });
    gettextCatalog = _gettextCatalog_;
  }));

  it('should attach a list of documents to the scope', function () {
    expect(scope.documents.length).toBe(3);
  });

  it('should attach a list of collateralProtection to the scope', function () {
    expect(scope.collateralProtection.length).toBe(4);
  });

  describe('sets correct URLs for other languages', function () {

    var langPrefix = {
      fr_CA: 'CAF_',
      en_CA: 'CAE_'
    };

    afterEach(function () {
      gettextCatalog.setCurrentLanguage(gettextCatalog.baseLanguage);
    });

    describe('French (fr_CA)', function () {

      beforeEach(inject(function ($controller, $rootScope) {
        gettextCatalog.setCurrentLanguage('fr_CA');

        scope = $rootScope.$new();
        DocumentsCtrl = $controller('DocumentsCtrl', {
          $scope: scope
        });
      }));

      it('for documents', function () {
        angular.forEach(scope.documents, function (document) {
          expect(document.url.indexOf(langPrefix.fr_CA) > -1).toBe(true);
        });
      });

      it('for collateral protection', function () {
        angular.forEach(scope.collateralProtection, function (document) {
          expect(document.url.indexOf(langPrefix.fr_CA) > -1).toBe(true);
        });
      });

    });

    // Skipped until implementation

//    describe('English Canada (en_CA)', function () {
//
//      beforeEach(inject(function ($controller, $rootScope) {
//        gettextCatalog.setCurrentLanguage('en_CA');
//
//        scope = $rootScope.$new();
//        DocumentsCtrl = $controller('DocumentsCtrl', {
//          $scope: scope
//        });
//      }));
//
//      it('for documents', function () {
//        angular.forEach(scope.documents, function (document) {
//          expect(document.url.indexOf(langPrefix.en_CA) > -1).toBe(true);
//        });
//      });
//
//      it('for collateral protection', function () {
//        angular.forEach(scope.collateralProtection, function (document) {
//          expect(document.url.indexOf(langPrefix.en_CA) > -1).toBe(true);
//        });
//      });
//
//    });

  });
});
