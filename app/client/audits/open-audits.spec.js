'use strict';

describe('Controller: AuditsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AuditsCtrl,
    kissMetricData,
    mockKissMetricInfo,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$q_, $rootScope) {
    var $q = _$q_;
    scope = $rootScope.$new();

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

    spyOn(mockKissMetricInfo, 'getKissMetricInfo').and.callThrough();

    AuditsCtrl = $controller('AuditsCtrl', {
      $scope: scope,
      kissMetricInfo: mockKissMetricInfo
    });
  }));

  it('should call to get core properties from kissmetric info service', function() {
    expect(mockKissMetricInfo.getKissMetricInfo).toHaveBeenCalled();
  });
});
