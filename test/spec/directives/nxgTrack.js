'use strict';

describe('Directive: nxgTrack', function () {
  beforeEach(module('nextgearWebApp'));

  var element,
    segmentio;

  describe('basic usage', function () {

    beforeEach(inject(function ($rootScope, $compile, _segmentio_) {
      segmentio = _segmentio_;
      spyOn(segmentio, 'trackLink');
      element = angular.element('<a href="#" nxg-track="Enable Auto Destruct"></a>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should activate link tracking for the element with the specified event name', function () {
      expect(segmentio.trackLink).toHaveBeenCalled();
      expect(segmentio.trackLink.mostRecentCall.args[0][0]).toBe(element[0]);
      expect(segmentio.trackLink.mostRecentCall.args[1]).toBe('Enable Auto Destruct');
      expect(segmentio.trackLink.mostRecentCall.args[2]).not.toBeDefined();
    });

  });

  describe('with interpolated event name', function () {

    beforeEach(inject(function ($rootScope, $compile, _segmentio_) {
      segmentio = _segmentio_;
      spyOn(segmentio, 'trackLink');
      $rootScope.eventName = 'Bar Event';
      element = angular.element('<a href="#" nxg-track="{{ eventName }}"></a>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should activate link tracking for the element with the specified event name', function () {
      expect(segmentio.trackLink).toHaveBeenCalled();
      expect(segmentio.trackLink.mostRecentCall.args[0][0]).toBe(element[0]);
      expect(segmentio.trackLink.mostRecentCall.args[1]).toBe('Bar Event');
      expect(segmentio.trackLink.mostRecentCall.args[2]).not.toBeDefined();
    });

  });

  describe('with properties', function () {

    beforeEach(inject(function ($rootScope, $compile, _segmentio_) {
      segmentio = _segmentio_;
      spyOn(segmentio, 'trackLink');
      element = angular.element('<a href="#" nxg-track="Enable Auto Destruct" track-properties="{ revenue: 321.10 }"></a>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
    }));

    it('should activate link tracking for the element with the specified event name', function () {
      expect(segmentio.trackLink).toHaveBeenCalled();
      expect(segmentio.trackLink.mostRecentCall.args[0][0]).toBe(element[0]);
      expect(segmentio.trackLink.mostRecentCall.args[1]).toBe('Enable Auto Destruct');
      expect(segmentio.trackLink.mostRecentCall.args[2]).toBeDefined();
      expect(segmentio.trackLink.mostRecentCall.args[2].revenue).toBe(321.10);
    });

  });



});
