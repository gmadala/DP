'use strict';

describe('Service: BusinessHours', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  var BusinessHours,
      $httpBackend,
      response,
      clock,
      api;

  // instantiate service
  beforeEach(inject(function (_BusinessHours_, _$httpBackend_, _api_) {
    BusinessHours = _BusinessHours_;
    $httpBackend = _$httpBackend_;
    api = _api_;

    response = {
      Success: true,
      Message: null,
      Data: {
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
      }
    };

    $httpBackend.whenGET('/info/v1_1/businesshours').respond(response);

  }));

  describe('insideBusinessHours function', function() {
    var rootScope;

    beforeEach(inject(function($rootScope) {
      rootScope = $rootScope;
      clock = sinon.useFakeTimers(moment('2014-10-01T00:00:00Z').valueOf(), 'Date');
    }));

    afterEach(function() {
      clock.restore();
    });

    it('should call the business hours endpoint', function() {
      spyOn(api, 'request').andCallThrough();
      BusinessHours.insideBusinessHours().then(function(res) {
        expect(api.request).toHaveBeenCalled();
      });
    });

    it('should return false if we are logged in before business hours begin', function() {
      BusinessHours.insideBusinessHours().then(function(res) {
        expect(res).toBe(false);
      });
    });

    it('should return true if we are logged in during business hours', function() {
      clock.tick(6 * 60 * 60 * 1000); // skip ahead 6 hours
      BusinessHours.insideBusinessHours().then(function(res) {
        expect(res).toBe(true);
      });
    });

    it('should return false if we are logged in after business hours end', function() {
      clock.tick(18 * 60 * 60 * 1000); // skip ahead 18 hours
      BusinessHours.insideBusinessHours().then(function(res) {
        expect(res).toBe(false);
      });
    });

    it('should cache the business hours', function() {
      spyOn(api, 'request').andCallThrough();
      BusinessHours.insideBusinessHours().then(function(res) {
        expect(api.request).toHaveBeenCalled();
      });

      BusinessHours.insideBusinessHours().then(function(res) {
        expect(api.request).not.toHaveBeenCalled();
      });
    });

    it('should refresh the cached business hours when we go from outside to inside business hours', function() {
      spyOn(api, 'request').andCallThrough();
      BusinessHours.insideBusinessHours().then(function(res) {
        expect(api.request).toHaveBeenCalled();
      });

      BusinessHours.insideBusinessHours().then(function(res) {
        expect(api.request).not.toHaveBeenCalled();
      });

      clock.tick(6 * 60 * 60 * 1000); // skip ahead 6 hours
      BusinessHours.insideBusinessHours().then(function(res) {
        expect(api.request).toHaveBeenCalled();
      });
    });

    // it('should broadcast a change event when we go from outside to inside business hours', function() {
    //   spyOn(rootScope, '$broadcast').andCallThrough();
    //        spyOn(api, 'request').andCallThrough();
    //   BusinessHours.insideBusinessHours().then(function(res) {
    //     expect(api.request).toHaveBeenCalled();
    //   });
    //   clock.tick(4 * 60 * 60 * 1000);
    //   rootScope.$apply();
    //   expect(rootScope.$broadcast).toHaveBeenCalledWith(BusinessHours.CHANGE_EVENT);
    // });
  });

  describe('nextBusinessDay function', function() {
    beforeEach(function() {
      clock = sinon.useFakeTimers(moment('2014-10-01T00:00:00Z').valueOf(), 'Date');
    });

    afterEach(function() {
      clock.restore();
    });

    it('should return the first result object from the API if we are logged in before business hours', function() {
      BusinessHours.nextBusinessDay().then(function(res) {
        expect(res).toBe(response.Data.BusinessHours[0]);
      });
    });

    it('should return the second result object from the API if we are logged in during business hours', function() {
      clock.tick(6 * 60 * 60 * 1000); // skip ahead 6 hours
      BusinessHours.nextBusinessDay().then(function(res) {
        expect(res).toBe(response.Data.BusinessHours[1]);
      });
    });

    it('should return the second result object from the API if we are logged in after business hours', function() {
      clock.tick(18 * 60 * 60 * 1000); // skip ahead 18 hours
      BusinessHours.nextBusinessDay().then(function(res) {
        expect(res).toBe(response.Data.BusinessHours[1]);
      });
    });


  });
});
