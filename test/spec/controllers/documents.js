'use strict';

describe('Controller: DocumentsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var DocumentsCtrl,
    scope,
    gettextCatalog,
    httpBackend,
    mockKissMetricInfo,
    $q;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$rootScope_, _gettextCatalog_, _kissMetricInfo_, _metric_, $httpBackend, _$q_){
    $q = _$q_;
    httpBackend = $httpBackend;
    scope = _$rootScope_.$new();

    mockKissMetricInfo = {
      getKissMetricInfo : function() {
        return $q.when({
          height: 1080,
          isBusinessHours: true,
          vendor: 'Google Inc.',
          version: 'Chrome 44',
          width: 1920
        });
      }
    };

    httpBackend.whenGET('/info/v1_1/businesshours').respond($q.when({}));

    DocumentsCtrl = $controller('DocumentsCtrl', {
      $scope: scope,
      kissMetricInfo: mockKissMetricInfo,
      metric: _metric_
    });
    gettextCatalog = _gettextCatalog_;
  }));

  it('should attach a list of documents to the scope', function () {
    expect(scope.documents.length).toBe(3);
  });

  it('should attach a list of collateralProtection to the scope', function () {
    expect(scope.collateralProtection.length).toBe(4);
  });

  it('should return true when user clicks on Resources - Rates and Fees in the business hours. ', function(){

    scope.$apply();
    expect(scope.kissMetricData.isBusinessHours).toBe(true);
    expect(scope.kissMetricData.height).toBe(1080);
    expect(scope.kissMetricData.vendor).toBe('Google Inc.');
    expect(scope.kissMetricData.version).toBe('Chrome 44');
    expect(scope.kissMetricData.width).toBe(1920);
  });

  describe('sets correct URLs for other languages', function () {

    var langPrefix = {
      CAF: 'CAF%20',
      CAE: 'CAE%20',
      ES: 'ES'
    };

    var mockUser;

    afterEach(function () {
      gettextCatalog.setCurrentLanguage(gettextCatalog.baseLanguage);
    });

    describe('French Canada (CAF)', function () {

      beforeEach(inject(function ($controller, $rootScope) {
        mockUser = {
          isUnitedStates: function () {
            return false;
          }
        };
        gettextCatalog.setCurrentLanguage('fr_CA');

        scope = $rootScope.$new();
        DocumentsCtrl = $controller('DocumentsCtrl', {
          $scope: scope,
          User: mockUser
        });
      }));

      it('for documents', function () {
        angular.forEach(scope.documents, function (document) {
          expect(document.url.indexOf(langPrefix.CAF) > -1).toBe(true);
        });
      });

      it('for collateral protection', function () {
        angular.forEach(scope.collateralProtection, function (document) {
          expect(document.url.indexOf(langPrefix.CAF) > -1).toBe(true);
        });
      });
    });

    describe('English Canada (CAE)', function () {

      beforeEach(inject(function ($controller, $rootScope) {
        mockUser = {
          isUnitedStates: function () {
            return false;
          }
        };
        gettextCatalog.setCurrentLanguage('en');

        scope = $rootScope.$new();
        DocumentsCtrl = $controller('DocumentsCtrl', {
          $scope: scope,
          User: mockUser
        });
      }));

      it('for documents', function () {
        angular.forEach(scope.documents, function (document) {
          expect(document.url.indexOf(langPrefix.CAE) > -1).toBe(true);
        });
      });

      it('for collateral protection', function () {
        angular.forEach(scope.collateralProtection, function (document) {
          expect(document.url.indexOf(langPrefix.CAE) > -1).toBe(true);
        });
      });
    });

    describe('Spanish Canada', function () {

      beforeEach(inject(function ($controller, $rootScope) {
        mockUser = {
          isUnitedStates: function () {
            return false;
          }
        };
        gettextCatalog.setCurrentLanguage('es');

        scope = $rootScope.$new();
        DocumentsCtrl = $controller('DocumentsCtrl', {
          $scope: scope,
          User: mockUser
        });
      }));

      it('for documents', function () {
        angular.forEach(scope.documents, function (document) {
          expect(document.url.indexOf(langPrefix.CAE) > -1).toBe(true);
        });
      });

      it('for collateral protection', function () {
        angular.forEach(scope.collateralProtection, function (document) {
          expect(document.url.indexOf(langPrefix.CAE) > -1).toBe(true);
        });
      });
    });

    describe('French United States', function () {

      beforeEach(inject(function ($controller, $rootScope) {
        mockUser = {
          isUnitedStates: function () {
            return true;
          }
        };
        gettextCatalog.setCurrentLanguage('fr_CA');

        scope = $rootScope.$new();
        DocumentsCtrl = $controller('DocumentsCtrl', {
          $scope: scope,
          User: mockUser
        });
      }));

      it('for documents', function () {
        angular.forEach(scope.documents, function (document) {
          expect(document.url.indexOf(langPrefix.CAE) > -1).toBe(false);
          expect(document.url.indexOf(langPrefix.CAF) > -1).toBe(false);
          expect(document.url.indexOf(langPrefix.ES) > -1).toBe(false);
        });
      });

      it('for collateral protection', function () {
        angular.forEach(scope.collateralProtection, function (document) {
          expect(document.url.indexOf(langPrefix.CAE) > -1).toBe(false);
          expect(document.url.indexOf(langPrefix.CAF) > -1).toBe(false);
          expect(document.url.indexOf(langPrefix.ES) > -1).toBe(false);
        });
      });
    });

    describe('English United States', function () {

      beforeEach(inject(function ($controller, $rootScope) {
        mockUser = {
          isUnitedStates: function () {
            return true;
          }
        };
        gettextCatalog.setCurrentLanguage('en');

        scope = $rootScope.$new();
        DocumentsCtrl = $controller('DocumentsCtrl', {
          $scope: scope,
          User: mockUser
        });
      }));

      it('for documents', function () {
        angular.forEach(scope.documents, function (document) {
          expect(document.url.indexOf(langPrefix.CAE) > -1).toBe(false);
          expect(document.url.indexOf(langPrefix.CAF) > -1).toBe(false);
          expect(document.url.indexOf(langPrefix.ES) > -1).toBe(false);
        });
      });

      it('for collateral protection', function () {
        angular.forEach(scope.collateralProtection, function (document) {
          expect(document.url.indexOf(langPrefix.CAE) > -1).toBe(false);
          expect(document.url.indexOf(langPrefix.CAF) > -1).toBe(false);
          expect(document.url.indexOf(langPrefix.ES) > -1).toBe(false);
        });
      });
    });

    describe('Spanish United States', function () {

      beforeEach(inject(function ($controller, $rootScope) {
        mockUser = {
          isUnitedStates: function () {
            return true;
          }
        };
        gettextCatalog.setCurrentLanguage('es');

        scope = $rootScope.$new();
        DocumentsCtrl = $controller('DocumentsCtrl', {
          $scope: scope,
          User: mockUser
        });
      }));

      it('for documents', function () {
        angular.forEach(scope.documents, function (document) {
          expect(document.url.indexOf(langPrefix.ES) > -1).toBe(true);
        });
      });

      it('for collateral protection', function () {
        angular.forEach(scope.collateralProtection, function (document) {
          expect(document.url.indexOf(langPrefix.ES) > -1).toBe(true);
        });
      });
    });

  });
});
