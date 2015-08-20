'use strict';

describe('Controller: AuctionDocumentsCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AuctionDocumentsCtrl,
    scope,
    dashboard,
    mockKissMetricInfo,
    $q,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, _kissMetricInfo_ , _$q_, _$httpBackend_, _metric_) {
    $q = _$q_;
    httpBackend = _$httpBackend_;
    scope = $rootScope.$new();


    mockKissMetricInfo = {
      getKissMetricInfo: function () {
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

    AuctionDocumentsCtrl = $controller('AuctionDocumentsCtrl', {
      $scope: scope,
      kissMetricInfo: mockKissMetricInfo,
      metric: _metric_
    });

  }));

  it('should attach metric names to the scope', function() {
    expect(scope.metric).toBeDefined();
  });

  it('should attach a list of documents to the scope', function() {
    expect(scope.documents).toBeDefined();
  });

  it('should return true when user clicks on Auction-Resources links', function(){

    scope.$apply();
    expect(scope.kissMetricData.isBusinessHours).toBe(true);
    expect(scope.kissMetricData.height).toBe(1080);
    expect(scope.kissMetricData.vendor).toBe('Google Inc.');
    expect(scope.kissMetricData.version).toBe('Chrome 44');
    expect(scope.kissMetricData.width).toBe(1920);
  });

});
