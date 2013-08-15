'use strict';

describe('Model: Floorplan', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var floorplan,
    httpBackend;

  beforeEach(inject(function ($httpBackend, Floorplan) {
    httpBackend = $httpBackend;
    floorplan = Floorplan;
  }));

  it('should exist', function () {
    expect(!!floorplan).toBe(true);
  });

  describe('fetchStatusSummary method', function () {

    beforeEach(function () {
      httpBackend.expectGET('/dealer/summary')
        .respond({ Success: true, Data: {} });
    });

    it('should make a GET request to the expected endpoint', function () {
      floorplan.fetchStatusSummary();
      httpBackend.flush();
    });

    it('should return a promise', function () {
      var resolveFn = jasmine.createSpy('success');
      floorplan.fetchStatusSummary().then(resolveFn);
      httpBackend.flush();
      expect(resolveFn).toHaveBeenCalled();
    });

  });

  describe('create method', function () {

    var sentData;

    beforeEach(function () {
      httpBackend.expectPOST('/floorplan/create')
        .respond(function (method, url, data) {
          // capture the request data that was sent for examination
          sentData = angular.fromJson(data);
          return [200, {Success: true}, {}];
        });
    });

    it('should make the expected POST', function () {
      floorplan.create({});
      expect(httpBackend.flush).not.toThrow();
    });

    it('should coerce boolean properties', function () {
      floorplan.create({
        PaySeller: 'true',
        SaleTradeIn: 'false',
        VinAckLookupFailure: 'foobar'
      });
      httpBackend.flush();
      expect(sentData.PaySeller).toBe(true);
      expect(sentData.SaleTradeIn).toBe(false);
      expect(sentData.VinAckLookupFailure).toBe(false);
    });

    it('should coerce int properties', function () {
      floorplan.create({
        UnitYear: '2004',
        TitleLocationId: '0',
        TitleTypeId: 'abcd'
      });
      httpBackend.flush();
      expect(sentData.UnitYear).toBe(2004);
      expect(sentData.TitleLocationId).toBe(0);
      expect(sentData.TitleTypeId).toBe(null);
    });

    it('should format purchase date to a short ISO string', function () {
      floorplan.create({
        UnitPurchaseDate: new Date(2013, 1, 1)
      });
      httpBackend.flush();
      expect(sentData.UnitPurchaseDate).toBe('2013-02-01');
    });

  });

});
