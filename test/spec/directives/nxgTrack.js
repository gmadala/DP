'use strict';

describe('Directive: nxgTrack', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
    segmentio;

  describe('basic usage', function () {

    beforeEach(inject(function ($rootScope, $compile, _segmentio_) {
      segmentio = _segmentio_;
      spyOn(segmentio, 'track');
      element = angular.element('<a href="#" nxg-track="Enable Auto Destruct"></a>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should activate link tracking for the element with the specified event name', function () {
      element.triggerHandler('click');

      expect(segmentio.track).toHaveBeenCalled();
      expect(segmentio.track.mostRecentCall.args[0]).toBe('Enable Auto Destruct');
      expect(segmentio.track.mostRecentCall.args[1]).not.toBeDefined();
    });

  });

  describe('with interpolated event name', function () {

    beforeEach(inject(function ($rootScope, $compile, _segmentio_) {
      segmentio = _segmentio_;
      spyOn(segmentio, 'track');
      $rootScope.eventName = 'Bar Event';
      element = angular.element('<a href="#" nxg-track="{{ eventName }}"></a>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should activate link tracking for the element with the specified event name', function () {
      element.triggerHandler('click');

      expect(segmentio.track).toHaveBeenCalled();
      expect(segmentio.track.mostRecentCall.args[0]).toBe('Bar Event');
      expect(segmentio.track.mostRecentCall.args[1]).not.toBeDefined();
    });

  });

  describe('with properties', function () {

    beforeEach(inject(function ($rootScope, $compile, _segmentio_) {
      segmentio = _segmentio_;
      spyOn(segmentio, 'track');
      element = angular.element('<a href="#" nxg-track="Enable Auto Destruct" track-properties="{ revenue: 321.10 }"></a>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should activate link tracking for the element with the specified event name', function () {
      element.triggerHandler('click');

      expect(segmentio.track).toHaveBeenCalled();
      expect(segmentio.track.mostRecentCall.args[0]).toBe('Enable Auto Destruct');
      expect(segmentio.track.mostRecentCall.args[1]).toBeDefined();
      expect(segmentio.track.mostRecentCall.args[1].revenue).toBe(321.10);
    });

  });

});
