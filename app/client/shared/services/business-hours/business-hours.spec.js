'use strict';

describe('Service: BusinessHours', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  var $rootScope,
      BusinessHours,
      $q,
      $interval,
      moment,
      clock,
      api;

  var intervalTick = 4 * 60 * 60 * 1000;

  beforeEach(module(function($provide) {
    $provide.decorator('$interval', function($delegate) {
      var $intervalSpy = jasmine.createSpy('$interval').and.callFake(function() {
        $delegate.apply(this, arguments);
      });
      $intervalSpy.flush = function(millis) {
        $delegate.flush(millis);
      };
      $interval = $intervalSpy;
      return $intervalSpy;
    });
  }));

  // instantiate service
  beforeEach(inject(function (_$rootScope_, _BusinessHours_, _$q_, _moment_, _api_) {
    $rootScope = _$rootScope_;
    BusinessHours = _BusinessHours_;
    api = _api_;
    $q = _$q_;
    moment = _moment_;

    spyOn(api, 'request').and.returnValue($q.when({
      BusinessHours: [
        {
          StartDateTime: '2014-10-01T04:00:00Z',
          EndDateTime: '2014-10-02T00:00:00Z'
        },
        {
          StartDateTime: '2014-10-02T04:00:00Z',
          EndDateTime: '2014-10-03T00:00:00Z'
        }
      ]
    }));
  }));

  describe('insideBusinessHours function', function() {
    beforeEach(function(done) {
      // Start javascript date at 4 hours before start of first business hours,
      // 8pm previous night eastern time
      clock = sinon.useFakeTimers(moment('2014-10-01T00:00:00Z').valueOf(), 'Date');
      done();
    });

    afterEach(function() {
      clock.restore();
    });

    it('should call the business hours endpoint', function(done) {
      BusinessHours.insideBusinessHours();
      $rootScope.$digest();
      expect(api.request).toHaveBeenCalledWith('GET', '/info/v1_1/businesshours');
      done();
    });

    it('should return false if we are logged in before business hours begin', function() {
      var result;
      BusinessHours.insideBusinessHours().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe(false);
    });

    it('should return true if we are logged in during business hours', function() {
      clock.tick(6 * 60 * 60 * 1000); // skip ahead 6 hours, 2am eastern time
      var result;
      BusinessHours.insideBusinessHours().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe(true);
    });

    it('should return false if we are logged in after business hours end', function() {
      clock.tick(24 * 60 * 60 * 1000); // skip ahead 24 hours, 8pm eastern time
      var result;
      BusinessHours.insideBusinessHours().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe(false);
    });

    it('should cache the business hours', function() {
      BusinessHours.insideBusinessHours();
      expect(api.request).toHaveBeenCalled();
      api.request.calls.reset();

      BusinessHours.insideBusinessHours();
      expect(api.request).not.toHaveBeenCalled();
    });

    it('should refresh the cached business hours when we go from outside to inside business hours', function() {
      BusinessHours.insideBusinessHours();
      $rootScope.$digest();
      expect(api.request).toHaveBeenCalled();
      expect($interval).toHaveBeenCalledWith(jasmine.any(Function), intervalTick); // 4 hours, time from 8pm to midnight
      api.request.calls.reset();

      BusinessHours.insideBusinessHours();
      $rootScope.$digest();
      api.request.calls.reset();
      expect(api.request).not.toHaveBeenCalled();

      $interval.flush(intervalTick);
      BusinessHours.insideBusinessHours();
      expect(api.request).toHaveBeenCalled();
    });

    it('should broadcast a change event when we go from outside to inside business hours', function() {
      spyOn($rootScope, '$broadcast').and.callThrough();
      BusinessHours.insideBusinessHours();
      $rootScope.$digest();
      expect(api.request).toHaveBeenCalled();
      expect($interval).toHaveBeenCalledWith(jasmine.any(Function), intervalTick); // 4 hours, time from 8pm to midnight
      api.request.calls.reset();

      $interval.flush(intervalTick);
      expect($rootScope.$broadcast).toHaveBeenCalledWith(BusinessHours.CHANGE_EVENT);
    });

    it('should broadcast a change event when we go from inside to outside business hours', function() {
      var tick = 18 * 60 * 60 * 1000;
      clock.tick(6 * 60 * 60 * 1000); // plus 6 hours, to 2am

      spyOn($rootScope, '$broadcast').and.callThrough();
      BusinessHours.insideBusinessHours();
      $rootScope.$digest();
      expect(api.request).toHaveBeenCalled();
      expect($interval).toHaveBeenCalledWith(jasmine.any(Function), tick); // 4 hours, time from 8pm to midnight
      api.request.calls.reset();

      $interval.flush(tick);
      expect($rootScope.$broadcast).toHaveBeenCalledWith(BusinessHours.CHANGE_EVENT);
    });
  });

  describe('nextBusinessDay function', function() {
    beforeEach(function() {
      clock = sinon.useFakeTimers(moment('2014-10-01T00:00:00Z').valueOf(), 'Date'); // 8pm before business hours start
    });

    afterEach(function() {
      clock.restore();
    });

    it('should return the first result object from the API if we are logged in before business hours', function() {
      var result;
      BusinessHours.nextBusinessDay().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe('2014-10-01');
    });

    it('should return the second result object from the API if we are logged in during business hours', function() {
      clock.tick(6 * 60 * 60 * 1000); // skip ahead 6 hours, to 2am during business hours
      var result;
      BusinessHours.nextBusinessDay().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe('2014-10-02');
    });

    it('should return the second result object from the API if we are logged in after business hours', function() {
      clock.tick(25 * 60 * 60 * 1000); // skip ahead 25 hours, to 9pm outside business hours
      var result;
      BusinessHours.nextBusinessDay().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe('2014-10-02');
    });


  });
});
