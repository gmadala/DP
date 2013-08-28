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

    var sentData,
      dummyFormData = {
        UnitColorId: {ColorId: 'col1'},
        TitleLocationId: {ResultingTitleLocationId: 'titleLoc1', ResultingTitleTypeId: 'titleType1'},
        UnitTitleStateId: {StateId: 'state1'},
        PhysicalInventoryAddressId: {LocationId: 'loc1'},
        LineOfCreditId: {LineOfCreditId: 'line1'},
        BuyerBankAccountId: {BankAccountId: 'account1'},
        SellerBusinessId: {BusinessId: 'seller1'}
      };

    beforeEach(function () {
      httpBackend.expectPOST('/floorplan/create')
        .respond(function (method, url, data) {
          // capture the request data that was sent for examination
          sentData = angular.fromJson(data);
          return [200, {Success: true}, {}];
        });
    });

    it('should make the expected POST', function () {
      floorplan.create(angular.extend({}, dummyFormData));
      expect(httpBackend.flush).not.toThrow();
    });

    it('should coerce boolean properties', function () {
      floorplan.create(angular.extend({}, dummyFormData, {
        PaySeller: 'true',
        SaleTradeIn: 'false',
        VinAckLookupFailure: 'foobar'
      }));
      httpBackend.flush();
      expect(sentData.PaySeller).toBe(true);
      expect(sentData.SaleTradeIn).toBe(false);
      expect(sentData.VinAckLookupFailure).toBe(false);
    });

    it('should coerce int properties', function () {
      floorplan.create(angular.extend({}, dummyFormData, {
        UnitYear: '2004',
      }));
      httpBackend.flush();
      expect(sentData.UnitYear).toBe(2004);
    });

    it('should format purchase date to a short ISO string', function () {
      floorplan.create(angular.extend({}, dummyFormData, {
        UnitPurchaseDate: new Date(2013, 1, 1)
      }));
      httpBackend.flush();
      expect(sentData.UnitPurchaseDate).toBe('2013-02-01');
    });

    it('should flatten option objects to ids', function () {
      floorplan.create(angular.extend({}, dummyFormData));
      httpBackend.flush();
      expect(sentData.UnitColorId).toBe('col1');
      expect(sentData.TitleLocationId).toBe('titleLoc1');
      expect(sentData.TitleTypeId).toBe('titleType1');
      expect(sentData.UnitTitleStateId).toBe('state1');
      expect(sentData.PhysicalInventoryAddressId).toBe('loc1');
      expect(sentData.LineOfCreditId).toBe('line1');
      expect(sentData.BuyerBankAccountId).toBe('account1');
      expect(sentData.SellerBusinessId).toBe('seller1');
    });

    it('should handle options that are not set without bombing', function () {
      floorplan.create({
        UnitColorId: null,
        TitleLocationId: null,
        UnitTitleStateId: null,
        PhysicalInventoryAddressId: null,
        LineOfCreditId: null,
        BuyerBankAccountId: null,
        SellerBusinessId: null
      });
      httpBackend.flush();
      expect(sentData.UnitColorId).toBe(null);
      expect(sentData.TitleLocationId).toBe(null);
      expect(sentData.TitleTypeId).toBe(null);
      expect(sentData.UnitTitleStateId).toBe(null);
      expect(sentData.PhysicalInventoryAddressId).toBe(null);
      expect(sentData.LineOfCreditId).toBe(null);
      expect(sentData.BuyerBankAccountId).toBe(null);
      expect(sentData.SellerBusinessId).toBe(null);
    });

  });

});
