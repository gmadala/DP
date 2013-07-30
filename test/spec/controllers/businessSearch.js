'use strict';

describe('Controller: BusinesssearchCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var BusinesssearchCtrl,
      scope,
      httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    httpBackend = $httpBackend;
    httpBackend.when('GET', 'views/home.html').respond('');
    httpBackend.when('GET', 'views/home.dashboard.html').respond('');
    httpBackend.when('GET', 'views/login.html').respond('');
    httpBackend.when('GET', 'http://test.discoverdsc.com/MobileService/api/Dealer/SearchSeller').respond({
      'Data': {
        'DealerInfoList': [
          {
            'BusinessId': '1',
            'BusinessNumber': '1',
            'BusinessName': 'One',
            'IsUniversalSource': true
          }
        ]
      }
    });
    scope = $rootScope.$new();
    BusinesssearchCtrl = $controller('BusinessSearchCtrl', {
      $scope: scope,
      dialog: {}
    });
  }));

  it('should attach a list of results to the scope', function () {
    expect(scope.results.length).toBe(0);
  });

  it('should fetch additional results', function() {
    expect(scope.loadMore).toBeDefined();
    scope.loadMore();
    httpBackend.flush();
    expect(scope.results.length).toBe(1);
  });
});
