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
    httpBackend.when('GET', '/receipt/search?').respond({
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

  it('should attach keyword to the scope', function () {
    expect(scope.keyword).toBeDefined();
  });

  it('should attach criteria to the scope', function () {
    expect(scope.criteria).toBeDefined();
  });

  it('should attach search to the scope', function () {
    expect(typeof scope.search).toBe('function');
  });

  it('should attach receipts to the scope', function () {
    scope.search();
    httpBackend.flush();
    expect(scope.receipts.length).toBe(1);
  });

});
