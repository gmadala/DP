'use strict';

describe('Controller: BusinessSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var BusinessSearchCtrl,
      scope,
      httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend;
    httpBackend.when('GET', '/Dealer/SearchSeller').respond({});
    scope = $rootScope.$new();
    BusinessSearchCtrl = $controller('BusinessSearchCtrl', {
      $scope: scope,
      dialog: {
        close: function() {}
      },
      initialQuery: '',
      mode: 'seller'
    });
  }));

  it('should attach a businessSearch to the scope', function () {
    expect(scope.businessSearch).toBeDefined();
  });

  it('should attach a close to the scope', function () {
    expect(scope.close).toBeDefined();
    scope.close();
  });
});
