'use strict';

describe('Model: Floorplan', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var floorplan,
    httpBackend,
    urlParser;

  beforeEach(inject(function ($httpBackend, Floorplan, URLParser) {
    httpBackend = $httpBackend;
    floorplan = Floorplan;
    urlParser = URLParser;
  }));

  describe('create method', function () {

    var sentData,
      dummyFormData = {
        UnitColorId: {ColorId: 'col1'},
        TitleLocationId: {ResultingTitleLocationId: 'titleLoc1', ResultingTitleTypeId: 'titleType1'},
        UnitTitleStateId: {StateId: 'state1'},
        PhysicalInventoryAddressId: {LocationId: 'loc1'},
        LineOfCreditId: {LineOfCreditId: 'line1'},
        BankAccountId: {BankAccountId: 'account1'},
        BusinessId: {BusinessId: 'seller1'}
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
      expect(sentData.BankAccountId).toBe('account1');
      expect(sentData.BusinessId).toBe('seller1');
    });

    it('should handle options that are not set without bombing', function () {
      floorplan.create({
        UnitColorId: null,
        TitleLocationId: null,
        UnitTitleStateId: null,
        PhysicalInventoryAddressId: null,
        LineOfCreditId: null,
        BankAccountId: null,
        BusinessId: null
      });
      httpBackend.flush();
      expect(sentData.UnitColorId).toBe(null);
      expect(sentData.TitleLocationId).toBe(null);
      expect(sentData.TitleTypeId).toBe(null);
      expect(sentData.UnitTitleStateId).toBe(null);
      expect(sentData.PhysicalInventoryAddressId).toBe(null);
      expect(sentData.LineOfCreditId).toBe(null);
      expect(sentData.BankAccountId).toBe(null);
      expect(sentData.BusinessId).toBe(null);
    });

    it('should set Blackboook properties and clear redundant Unit* properties if $selectedVehicle present ', function () {
      floorplan.create(angular.extend({}, dummyFormData, {
        $selectedVehicle: {
          GroupNumber: 'gn',
          UVc: 'uvc',
          VinPos1To8: 'vh34t45y',
          DSCRegionalAveragePurchasePrice: 1,
          foo: 'bar'
        },
        UnitMake: 'make',
        UnitModel: 'model',
        UnitYear: 'year',
        UnitStyle: 'style'
      }));
      httpBackend.flush();
      expect(sentData.BlackBookGroupNumber).toBe('gn');
      expect(sentData.BlackBookUvc).toBe('uvc');
      expect(sentData.UnitMake).toBe(null);
      expect(sentData.UnitModel).toBe(null);
      expect(sentData.UnitYear).toBe(null);
      expect(sentData.UnitStyle).toBe(null);
    });

    it('should retain Unit* property values if $selectedVehicle not present', function () {
      floorplan.create(angular.extend({}, dummyFormData, {
        $selectedVehicle: null,
        UnitMake: 'make',
        UnitModel: 'model',
        UnitYear: '2004',
        UnitStyle: 'style'
      }));
      httpBackend.flush();
      expect(sentData.BlackBookGroupNumber).toBeFalsy();
      expect(sentData.BlackBookUvc).toBeFalsy();
      expect(sentData.UnitMake).toBe('make');
      expect(sentData.UnitModel).toBe('model');
      expect(sentData.UnitYear).toBe(2004);
      expect(sentData.UnitStyle).toBe('style');
    });

  });

  describe('filterValues property', function () {

    it('should have the expected values', function () {
      expect(floorplan.filterValues).toBeDefined();
      expect(floorplan.filterValues.ALL).toBeDefined();
      expect(floorplan.filterValues.PENDING).toBeDefined();
      expect(floorplan.filterValues.DENIED).toBeDefined();
      expect(floorplan.filterValues.APPROVED).toBeDefined();
      expect(floorplan.filterValues.COMPLETED).toBeDefined();
      expect(floorplan.filterValues.PENDING_NOT_PAID).toBeDefined();
      expect(floorplan.filterValues.DENIED_NOT_PAID).toBeDefined();
      expect(floorplan.filterValues.APPROVED_PAID).toBeDefined();
      expect(floorplan.filterValues.APPROVED_NOT_PAID).toBeDefined();
      expect(floorplan.filterValues.COMPLETED_PAID).toBeDefined();
      expect(floorplan.filterValues.COMPLETED_NOT_PAID).toBeDefined();
      expect(floorplan.filterValues.NO_TITLE_PAID).toBeDefined();
    });

  });

  describe('search method', function () {

    var paginate,
      defaultCriteria = {
        query: '',
        startDate: null,
        endDate: null,
        filter: ''
      },
      searchResults = [],
      callParams,
      respondFnc = function(method, url) {
        callParams = urlParser.extractParams(url);
        return [200, {
          Success: true,
          Data: {
            FloorplanRowCount: 20,
            Floorplans: searchResults
          }
        }, {}];
      };

    beforeEach(inject(function (Paginate, User) {
      paginate = Paginate;
      httpBackend.whenGET(/\/floorplan\/search.*/).respond(respondFnc);
      defaultCriteria.filter = floorplan.filterValues.ALL;
      spyOn(User, 'getInfo').andReturn({ BusinessNumber: '123' });
    }));

    it('should call the expected API path', function () {
      httpBackend.expectGET(/\/floorplan\/search.*/);
      floorplan.search(defaultCriteria);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should ask for items sorted by most recent first', function () {
      floorplan.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('FlooringDate');
      expect(callParams.OrderByDirection).toBe('DESC');
    });

    it('should provide a page size', function () {
      floorplan.search(defaultCriteria);
      httpBackend.flush();
      expect(isNaN(parseInt(callParams.PageSize, 10))).toBe(false);
    });

    it('should start on the first page if a paginator is not provided', function () {
      floorplan.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.PageNumber).toBe(paginate.firstPage().toString());
    });

    it('should start on the next page if a paginator is provided', function () {
      floorplan.search(defaultCriteria, {
        nextPage: function () {
          return 11;
        }
      });
      httpBackend.flush();
      expect(callParams.PageNumber).toBe('11');
    });

    it('should add a paginator to the results', function () {
      var output = {};
      floorplan.search(defaultCriteria).then(function (results) {
        output = results;
      });
      httpBackend.flush();
      expect(output.$paginator).toBeDefined();
      expect(output.$paginator.nextPage()).toBe(2);
    });

    it('should add the appropriate $titleURL to floorplans that have a title available', function () {
      var output = {};
      searchResults = [
        {
          StockNumber: '456',
          TitleImageAvailable: true
        },
        {
          StockNumber: '789',
          TitleImageAvailable: false
        }
      ];
      floorplan.search(defaultCriteria).then(function (results) { output = results; });
      httpBackend.flush();
      expect(output.Floorplans[0].$titleURL).toBe('/floorplan/title/123-456/0');
      expect(output.Floorplans[1].$titleURL).not.toBeDefined();
    });

    it('should NOT send a Keyword if search term is empty/null', function () {
      floorplan.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.Keyword).not.toBeDefined();
    });

    it('should send the search term as Keyword, if present', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {query: 'foo'}));
      httpBackend.flush();
      expect(callParams.Keyword).toBe('foo');
    });

    it('should not send startDate and endDate if not provided', function () {
      floorplan.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.StartDate).not.toBeDefined();
      expect(callParams.EndDate).not.toBeDefined();
    });

    it('should send startDate and endDate if provided', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {
        startDate: moment([2013, 1, 1]).toDate(),
        endDate: moment([2013, 2, 1]).toDate()
      }));
      httpBackend.flush();
      expect(callParams.StartDate).toBe('2013-02-01');
      expect(callParams.EndDate).toBe('2013-03-01');
    });

    it('should set no filter flags to false for ALL filter', function () {
      floorplan.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.SearchPending).not.toBe('false');
      expect(callParams.SearchApproved).not.toBe('false');
      expect(callParams.SearchCompleted).not.toBe('false');
      expect(callParams.SearchDenied).not.toBe('false');
      expect(callParams.SearchPaid).not.toBe('false');
      expect(callParams.SearchUnPaid).not.toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but pending + title + paid flags to false for PENDING filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.PENDING}));
      httpBackend.flush();
      expect(callParams.SearchPending).not.toBe('false');
      expect(callParams.SearchApproved).toBe('false');
      expect(callParams.SearchCompleted).toBe('false');
      expect(callParams.SearchDenied).toBe('false');
      expect(callParams.SearchPaid).not.toBe('false');
      expect(callParams.SearchUnPaid).not.toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but denied + title + paid flags to false for DENIED filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.DENIED}));
      httpBackend.flush();
      expect(callParams.SearchPending).toBe('false');
      expect(callParams.SearchApproved).toBe('false');
      expect(callParams.SearchCompleted).toBe('false');
      expect(callParams.SearchDenied).not.toBe('false');
      expect(callParams.SearchPaid).not.toBe('false');
      expect(callParams.SearchUnPaid).not.toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but approved + title + paid filter flags to false for APPROVED filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.APPROVED}));
      httpBackend.flush();
      expect(callParams.SearchPending).toBe('false');
      expect(callParams.SearchApproved).not.toBe('false');
      expect(callParams.SearchCompleted).toBe('false');
      expect(callParams.SearchDenied).toBe('false');
      expect(callParams.SearchPaid).not.toBe('false');
      expect(callParams.SearchUnPaid).not.toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but completed + title + paid flags to false for COMPLETED filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.COMPLETED}));
      httpBackend.flush();
      expect(callParams.SearchPending).toBe('false');
      expect(callParams.SearchApproved).toBe('false');
      expect(callParams.SearchCompleted).not.toBe('false');
      expect(callParams.SearchDenied).toBe('false');
      expect(callParams.SearchPaid).not.toBe('false');
      expect(callParams.SearchUnPaid).not.toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but pending + title + not-paid flags to false for PENDING_NOT_PAID filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.PENDING_NOT_PAID}));
      httpBackend.flush();
      expect(callParams.SearchPending).not.toBe('false');
      expect(callParams.SearchApproved).toBe('false');
      expect(callParams.SearchCompleted).toBe('false');
      expect(callParams.SearchDenied).toBe('false');
      expect(callParams.SearchPaid).toBe('false');
      expect(callParams.SearchUnPaid).not.toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but denied + title + not-paid flags to false for DENIED_NOT_PAID filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.DENIED_NOT_PAID}));
      httpBackend.flush();
      expect(callParams.SearchPending).toBe('false');
      expect(callParams.SearchApproved).toBe('false');
      expect(callParams.SearchCompleted).toBe('false');
      expect(callParams.SearchDenied).not.toBe('false');
      expect(callParams.SearchPaid).toBe('false');
      expect(callParams.SearchUnPaid).not.toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but approved + title + yes-paid flags to false for APPROVED_PAID filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.APPROVED_PAID}));
      httpBackend.flush();
      expect(callParams.SearchPending).toBe('false');
      expect(callParams.SearchApproved).not.toBe('false');
      expect(callParams.SearchCompleted).toBe('false');
      expect(callParams.SearchDenied).toBe('false');
      expect(callParams.SearchPaid).not.toBe('false');
      expect(callParams.SearchUnPaid).toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but approved + title + not-paid flags to false for APPROVED_NOT_PAID filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.APPROVED_NOT_PAID}));
      httpBackend.flush();
      expect(callParams.SearchPending).toBe('false');
      expect(callParams.SearchApproved).not.toBe('false');
      expect(callParams.SearchCompleted).toBe('false');
      expect(callParams.SearchDenied).toBe('false');
      expect(callParams.SearchPaid).toBe('false');
      expect(callParams.SearchUnPaid).not.toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but completed + title + yes-paid flags to false for COMPLETED_PAID filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.COMPLETED_PAID}));
      httpBackend.flush();
      expect(callParams.SearchPending).toBe('false');
      expect(callParams.SearchApproved).toBe('false');
      expect(callParams.SearchCompleted).not.toBe('false');
      expect(callParams.SearchDenied).toBe('false');
      expect(callParams.SearchPaid).not.toBe('false');
      expect(callParams.SearchUnPaid).toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set all but completed + title + not-paid flags to false for COMPLETED_NOT_PAID filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.COMPLETED_NOT_PAID}));
      httpBackend.flush();
      expect(callParams.SearchPending).toBe('false');
      expect(callParams.SearchApproved).toBe('false');
      expect(callParams.SearchCompleted).not.toBe('false');
      expect(callParams.SearchDenied).toBe('false');
      expect(callParams.SearchPaid).toBe('false');
      expect(callParams.SearchUnPaid).not.toBe('false');
      expect(callParams.SearchHasTitle).not.toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

    it('should set yes-title and not-paid flags to false for NO_TITLE_PAID filter', function () {
      floorplan.search(angular.extend({}, defaultCriteria, {filter: floorplan.filterValues.NO_TITLE_PAID}));
      httpBackend.flush();
      expect(callParams.SearchPending).not.toBe('false');
      expect(callParams.SearchApproved).not.toBe('false');
      expect(callParams.SearchCompleted).not.toBe('false');
      expect(callParams.SearchDenied).not.toBe('false');
      expect(callParams.SearchPaid).not.toBe('false');
      expect(callParams.SearchUnPaid).toBe('false');
      expect(callParams.SearchHasTitle).toBe('false');
      expect(callParams.SearchHasNoTitle).not.toBe('false');
    });

  });

  describe('addTitleURL method', function () {

    beforeEach(inject(function (User) {
      spyOn(User, 'getInfo').andReturn({ BusinessNumber: '123' });
    }));

    it('should not add the property if item has no stock number', function () {
      var out = floorplan.addTitleURL({});
      expect(out.$titleURL).not.toBeDefined();
    });

    it('should use the current user business number + item stock number if no buyer biz # present', function () {
      var out = floorplan.addTitleURL({
        StockNumber: 'foo'
      });
      expect(out.$titleURL).toBe('/floorplan/title/123-foo/0');
    });

    it('should use the buyer business number + item stock number if buyer biz # is present', function () {
      var out = floorplan.addTitleURL({
        StockNumber: 'foo',
        BuyerBusinessNumber: '777'
      });
      expect(out.$titleURL).toBe('/floorplan/title/777-foo/0');
    });

  });

  describe('setTitleInfo method', function () {

    var sentData;

    beforeEach(function () {
      httpBackend.whenPOST('/floorplan/EditTitleNumberAndState')
        .respond(function (method, url, data) {
          // capture the request data that was sent for examination
          sentData = angular.fromJson(data);
          return [200, {Success: true, Data: 'OK'}, {}];
        });
    });

    it('should POST to the correct endpoint', function () {
      httpBackend.expectPOST('/floorplan/EditTitleNumberAndState');
      floorplan.setTitleInfo('floorplanId', 'titleNum', {StateId: 'CO'});
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the floorplan id', function () {
      floorplan.setTitleInfo('floorplanId', 'titleNum', {StateId: 'CO'});
      httpBackend.flush();
      expect(sentData.FloorplanId).toBe('floorplanId');
    });

    it('should send the title number', function () {
      floorplan.setTitleInfo('floorplanId', 'titleNum', {StateId: 'CO'});
      httpBackend.flush();
      expect(sentData.TitleNumber).toBe('titleNum');
    });

    it('should send the state id', function () {
      floorplan.setTitleInfo('floorplanId', 'titleNum', {StateName: 'Colorado', StateId: 'CO'});
      httpBackend.flush();
      expect(sentData.TitleStateId).toBe('CO');
    });

    it('should return a promise for the result', function () {
      var promise = floorplan.setTitleInfo('floorplanId', 'titleNum', {StateId: 'CO'}),
        success = jasmine.createSpy('success');
      expect(promise).toBeDefined();
      expect(angular.isFunction(promise.then)).toBe(true);
      promise.then(success);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith('OK');
    });

  });

});
