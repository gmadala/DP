'use strict';

describe('Controller: AuditsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AuditsCtrl,
    kissMetricData,
    mockKissMetricInfo,
    segmentio,
    scope,
    $httpBackend,
    VIEW_OPEN_AUDITS = 'View Open Audits';

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$q_, $rootScope, _$httpBackend_) {
    var $q = _$q_;
    scope = $rootScope.$new(),
    $httpBackend = _$httpBackend_;

    kissMetricData = {
      height: 1080,
      isBusinessHours: true,
      vendor: 'Google Inc.',
      version: 'Chrome 44',
      width: 1920
    };

    mockKissMetricInfo = {
      getKissMetricInfo : function() {
        return $q.when(kissMetricData);
      }
    };

    segmentio = {
      track: function() {
        return $q.when({});
      }
    };

    $httpBackend.whenGET('/Dealer/v1_2/Info').respond($q.when({}));

    spyOn(mockKissMetricInfo, 'getKissMetricInfo').and.callThrough();
    spyOn(segmentio, 'track').and.callThrough();

    AuditsCtrl = $controller('AuditsCtrl', {
      $scope: scope,
      kissMetricInfo: mockKissMetricInfo,
      segmentio: segmentio
    });
  }));

  it('should call to get core properties from kissmetric info service', function() {
    expect(mockKissMetricInfo.getKissMetricInfo).toHaveBeenCalled();
    scope.$apply();
    expect(segmentio.track).toHaveBeenCalledWith(VIEW_OPEN_AUDITS, kissMetricData);
  });

  it('should attach metric names to the scope', function() {
    expect(scope.metric.VIEW_OPEN_AUDITS).toBeDefined();
  });
});
