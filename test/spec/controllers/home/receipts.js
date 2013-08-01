'use strict';

describe('Controller: ReceiptsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ReceiptsCtrl,
      scope,
      httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend;
    httpBackend.when('GET', '/receipt/search').respond({
      'Success': true,
      'Message': null,
      'Data': {
        'Receipts': [{}]
      }
    });
    scope = $rootScope.$new();
    ReceiptsCtrl = $controller('ReceiptsCtrl', {
      $scope: scope
    });
  }));

  it('should attach receipts to the scope', function () {
    httpBackend.flush();
    expect(scope.receipts.length).toBe(1);
  });
});
