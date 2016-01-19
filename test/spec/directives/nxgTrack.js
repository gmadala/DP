'use strict';

describe('Directive: nxgTrack', function () {
  beforeEach(module('nextgearWebApp'));

  var
    $compile,
    $rootScope,
    element,
    kissMetricInfo,
    segmentio;

  var coreProperties = {
    height: 1080,
    isBusinessHours: true,
    vendor: 'Google Inc.',
    version: 'Chrome 44',
    width: 1920
  };

  describe('basic usage', function () {

    beforeEach(inject(function (_$rootScope_, _$compile_, _segmentio_, _$q_, _kissMetricInfo_) {
      segmentio = _segmentio_;
      spyOn(segmentio, 'track');

      var $q = _$q_;
      kissMetricInfo = _kissMetricInfo_;
      spyOn(kissMetricInfo, 'getKissMetricInfo').and.callFake(function() {
        return $q.when(coreProperties);
      });

      $compile = _$compile_;
      $rootScope = _$rootScope_;

      element = angular.element('<a href="#" nxg-track="Enable Auto Destruct"></a>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should activate link tracking for the element with the specified event name', function () {
      element.triggerHandler('click');

      $rootScope.$apply();
      expect(segmentio.track).toHaveBeenCalled();
      expect(segmentio.track.calls.mostRecent().args[0]).toBe('Enable Auto Destruct');
      expect(segmentio.track.calls.mostRecent().args[1]).toEqual(coreProperties);
    });

  });

  describe('with interpolated event name', function () {

    beforeEach(inject(function (_$rootScope_, _$compile_, _segmentio_, _$q_, _kissMetricInfo_) {
      segmentio = _segmentio_;
      spyOn(segmentio, 'track');

      var $q = _$q_;
      kissMetricInfo = _kissMetricInfo_;
      spyOn(kissMetricInfo, 'getKissMetricInfo').and.callFake(function() {
        return $q.when(coreProperties);
      });

      $compile = _$compile_;
      $rootScope = _$rootScope_;

      $rootScope.eventName = 'Bar Event';
      element = angular.element('<a href="#" nxg-track="{{ eventName }}"></a>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should activate link tracking for the element with the specified event name', function () {
      element.triggerHandler('click');

      $rootScope.$apply();
      expect(segmentio.track).toHaveBeenCalled();
      expect(segmentio.track.calls.mostRecent().args[0]).toBe('Bar Event');
      expect(segmentio.track.calls.mostRecent().args[1]).toEqual(coreProperties);
    });

  });

  describe('with properties', function () {

    beforeEach(inject(function (_$rootScope_, _$compile_, _segmentio_, _$q_, _kissMetricInfo_) {
      segmentio = _segmentio_;
      spyOn(segmentio, 'track');

      var $q = _$q_;
      kissMetricInfo = _kissMetricInfo_;
      spyOn(kissMetricInfo, 'getKissMetricInfo').and.callFake(function() {
        return $q.when(coreProperties);
      });

      $compile = _$compile_;
      $rootScope = _$rootScope_;

      element = angular.element('<a href="#" nxg-track="Enable Auto Destruct" track-properties="{ revenue: 321.10, width: 3000 }"></a>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should activate link tracking for the element with the specified event name', function () {
      element.triggerHandler('click');

      $rootScope.$apply();
      expect(segmentio.track).toHaveBeenCalled();
      expect(segmentio.track.calls.mostRecent().args[0]).toBe('Enable Auto Destruct');
      expect(segmentio.track.calls.mostRecent().args[1]).toBeDefined();
      expect(segmentio.track.calls.mostRecent().args[1].revenue).toBe(321.10);
      expect(segmentio.track.calls.mostRecent().args[1].width).toBe(3000);
    });

  });

});
