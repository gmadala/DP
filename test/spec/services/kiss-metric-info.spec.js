'use strict';

describe('Service: kissMetricInfo', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var $window, kissMetricInfo, BusinessHours, $q,$rootScope;

  beforeEach(inject(function (_kissMetricInfo_,_$window_, _BusinessHours_, _$q_, _$rootScope_){

    kissMetricInfo = _kissMetricInfo_;
    $window = _$window_;
    BusinessHours =_BusinessHours_;
    $q = _$q_;
    $rootScope = _$rootScope_;


    spyOn(BusinessHours,'insideBusinessHours').and.returnValue($q.when(true));
  }));

  it('should return true for biz hours if within biz hours and return non-null properties for kissMetric', function() {

    var result;

    kissMetricInfo.getKissMetricInfo().then(function(retVal) {
      result = retVal;
    });

    $rootScope.$apply();

    expect(result.isBusinessHours).toBe(true);
    expect(result.height).not.toBeNull();
    expect(result.width).not.toBeNull();
    expect(result.vendor).not.toBeNull();
    expect(result.version).not.toBeNull();

  });

});
