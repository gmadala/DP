'use strict';

describe('Controller: ReportsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ReportsCtrl,
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

    ReportsCtrl = $controller('ReportsCtrl', {
      $scope: scope,
      kissMetricInfo: mockKissMetricInfo
    });
  }));

  it('should call to get core properties from kissmetric info service', function() {
    expect(mockKissMetricInfo.getKissMetricInfo).toHaveBeenCalled();
    scope.$apply();
    expect(scope.kissMetricData).toEqual(kissMetricData);
  });

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
