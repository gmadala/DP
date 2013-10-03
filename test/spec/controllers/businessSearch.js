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
    httpBackend.when('GET', /\/dealer\/search\/seller\/?.+/).respond({});
    scope = $rootScope.$new();
    BusinessSearchCtrl = $controller('BusinessSearchCtrl', {
      $scope: scope,
      dialog: {
        close: function() {}
      },
      initialQuery: '',
      searchBuyersMode: false
    });
  }));

  // TODO: test this controller properly

  it('should attach a close function to the scope', function () {
    expect(scope.close).toBeDefined();
    scope.close();
  });
});
