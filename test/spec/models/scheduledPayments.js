'use strict';

describe('Model: Scheduled Payments', function() {

  // load the service's modeule
  beforeEach(module('nextgearWebApp'));

  var scheduledPayments,
    httpBackend,
    config,
    q, rootScope;

  beforeEach(inject(function($httpBackend, ScheduledPaymentsSearch, nxgConfig, $q, $rootScope) {
    httpBackend = $httpBackend;
    config = nxgConfig;
    scheduledPayments = ScheduledPaymentsSearch;
    q = $q;
    rootScope = $rootScope;
  }));

  it('should exist', function() {
    expect(scheduledPayments).toBeDefined();
  });

  describe('search method', function() {

    beforeEach(function() {
      httpBackend.expectGET(/\/payment\/searchscheduled\?.+/)
        .respond({
          Success: true,
          Data: {
            SearchResults: []
          }
        });
    });

    it('should make a GET request to the expected endpoint', function() {
      scheduledPayments.search();
      httpBackend.flush();
    });

    it('should return a promise', function() {
      var resolveFn = jasmine.createSpy('success');
      scheduledPayments.search().then(resolveFn);
      httpBackend.flush();
      expect(resolveFn).toHaveBeenCalled();
    });
  });

  describe('loadMoreData method', function() {

    var response, requestUrl;

    beforeEach(function() {
      response = {
        Success: true,
        Data: {
          SearchResults: [
            {
              "WebScheduledPaymentId": "1003",
              "FloorplanId": "2049",
              "StockNumber": "34075",
              "Vin": "SDKJFHWOIHGLK",
              "VehicleDescription": "2003 Chevrolet Monte Carlo SS Black",
              "ScheduledForDate": "2013-08-30",
              "ScheduledByUserAccountId": "u10002",
              "ScheduledByBusinessContactId": "b1002",
              "ScheduledByUserDisplayname": "John Smith",
              "Processed": false,
              "ProcessedOnDate": "",
              "Cancelled": false,
              "CancelledDate": "",
              "CancelledByUserAccountId": "",
              "CancelledByBusinessContactId": "",
              "CancelledByUserDisplayname": "",
              "FinancialTransactionId": "1000001",
              "Voided": false,
              "VoidedDate": null,
              "CurtailmentPayment": true,
              "CurtailmentDueDate": "2013-08-13",
              "ScheduledPaymentAmount": 14098.00,
              "CurrentPayoff": 23211.98,
              "PrincipalPayoff": 84022,
              "SetupDate": "2013-08-01"
            },
            {
              "WebScheduledPaymentId": "1004",
              "FloorplanId": "2050",
              "StockNumber": "34075",
              "Vin": "SDKJFHWOIHGLK",
              "VehicleDescription": "2013 Toyota Land Cruiser Red",
              "ScheduledForDate": "2013-08-30",
              "ScheduledByUserAccountId": "u10003",
              "ScheduledByBusinessContactId": "b1003",
              "ScheduledByUserDisplayname": "Ramón Valdez",
              "Processed": true,
              "ProcessedOnDate": "2013-08-02",
              "Cancelled": false,
              "CancelledDate": "",
              "CancelledByUserAccountId": "",
              "CancelledByBusinessContactId": "",
              "CancelledByUserDisplayname": "",
              "FinancialTransactionId": "1000002",
              "Voided": false,
              "VoidedDate": null,
              "CurtailmentPayment": true,
              "CurtailmentDueDate": "2013-08-13",
              "ScheduledPaymentAmount": 3098.00,
              "CurrentPayoff": 54551.98,
              "PrincipalPayoff": 34022,
              "SetupDate": "2013-06-06"
            },
            {
              "WebScheduledPaymentId": "1005",
              "FloorplanId": "2063",
              "StockNumber": "34075",
              "Vin": "SDKJFHWOIHGLK",
              "VehicleDescription": "2007 Porsche Boxster S Gray",
              "ScheduledForDate": "2013-08-30",
              "ScheduledByUserAccountId": "u10004",
              "ScheduledByBusinessContactId": "b1004",
              "ScheduledByUserDisplayname": "Stephen Hawking",
              "Processed": false,
              "ProcessedOnDate": "",
              "Cancelled": true,
              "CancelledDate": "2013-08-02",
              "CancelledByUserAccountId": "",
              "CancelledByBusinessContactId": "",
              "CancelledByUserDisplayname": "John Denver",
              "FinancialTransactionId": "1000003",
              "Voided": false,
              "VoidedDate": null,
              "CurtailmentPayment": true,
              "CurtailmentDueDate": "2013-08-13",
              "ScheduledPaymentAmount": 4098.00,
              "CurrentPayoff": 188211.98,
              "PrincipalPayoff": 52131.50,
              "SetupDate": "2013-03-28"
            },
            {
              "WebScheduledPaymentId": "1006",
              "FloorplanId": "2064",
              "StockNumber": "34076",
              "Vin": "SDKJFHWOISDFK",
              "VehicleDescription": "2010 Porsche Boxster S Black",
              "ScheduledForDate": "2013-08-30",
              "ScheduledByUserAccountId": "u10005",
              "ScheduledByBusinessContactId": "b1005",
              "ScheduledByUserDisplayname": "John Rambo",
              "Processed": false,
              "ProcessedOnDate": "",
              "Cancelled": false,
              "CancelledDate": null,
              "CancelledByUserAccountId": "",
              "CancelledByBusinessContactId": "",
              "CancelledByUserDisplayname": "John Denver",
              "FinancialTransactionId": "1000003",
              "Voided": true,
              "VoidedDate": "2013-08-13",
              "CurtailmentPayment": true,
              "CurtailmentDueDate": null,
              "ScheduledPaymentAmount": 40498.00,
              "CurrentPayoff": 84545.00,
              "PrincipalPayoff": 131455.15,
              "SetupDate": "2013-03-28"
            }
          ]
        }
      };
      httpBackend.expectGET(/\/payment\/searchscheduled\?.+/).respond(function (method, url, data) {
        requestUrl = url;
        return [200, JSON.stringify(response), {}];
      });
    });

    it('should make a GET request to the expected endpoint', function() {
      scheduledPayments.loadMoreData();
      httpBackend.flush();
    });

    it('should return a promise', function() {
      var resolveFn = jasmine.createSpy('success');
      scheduledPayments.loadMoreData().then(resolveFn);
      httpBackend.flush();
      expect(resolveFn).toHaveBeenCalled();
    });

    it('should make a request the second time loadMoreData is called', function() {
      scheduledPayments.loadMoreData();
      httpBackend.flush();
      httpBackend.expectGET(/\/payment\/searchscheduled\?.+/).respond(response);
      scheduledPayments.loadMoreData();
      httpBackend.flush();
    });

    it('should return a promise the second time loadMoreData is called', function() {
      scheduledPayments.loadMoreData();
      httpBackend.flush();
      httpBackend.expectGET(/\/payment\/searchscheduled\?.+/).respond(response);
      var resolveFn = jasmine.createSpy('success');
      scheduledPayments.loadMoreData().then(resolveFn);
      httpBackend.flush();
      expect(resolveFn).toHaveBeenCalled();
    });

    describe('filter searches', function() {

      it('should filter by all when filterBy is empty string', function() {
        scheduledPayments.search('', new Date(), new Date(), '');
        httpBackend.flush();
        expect(requestUrl.indexOf('SearchPending=true')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchProcessed=true')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchCancelled=true')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchVoided=true')).not.toBe(-1);

      });

      it('should filter by pending', function() {
        scheduledPayments.search('', new Date(), new Date(), scheduledPayments.FILTER_BY_PENDING);
        httpBackend.flush();
        expect(requestUrl.indexOf('SearchPending=true')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchProcessed=false')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchCancelled=false')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchVoided=false')).not.toBe(-1);
      });

      it('should filter by processed', function() {
        scheduledPayments.search('', new Date(), new Date(), scheduledPayments.FILTER_BY_PROCESSED);
        httpBackend.flush();
        expect(requestUrl.indexOf('SearchPending=false')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchProcessed=true')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchCancelled=false')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchVoided=false')).not.toBe(-1);
      });

      it('should filter by cancelled', function() {
        scheduledPayments.search('', new Date(), new Date(), scheduledPayments.FILTER_BY_CANCELLED);
        httpBackend.flush();
        expect(requestUrl.indexOf('SearchPending=false')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchProcessed=false')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchCancelled=true')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchVoided=false')).not.toBe(-1);
      });

      it('should filter by voided', function() {
        scheduledPayments.search('', new Date(), new Date(), scheduledPayments.FILTER_BY_VOIDED);
        httpBackend.flush();
        expect(requestUrl.indexOf('SearchPending=false')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchProcessed=false')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchCancelled=false')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchVoided=true')).not.toBe(-1);
      });

      it('should filter by all', function() {
        scheduledPayments.search('', new Date(), new Date(), scheduledPayments.FILTER_BY_ALL);
        httpBackend.flush();
        expect(requestUrl.indexOf('SearchPending=true')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchProcessed=true')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchCancelled=true')).not.toBe(-1);
        expect(requestUrl.indexOf('SearchVoided=true')).not.toBe(-1);
      });

    });

    describe('PhysicalInventoryId filtering', function() {
      it('should filter by PhysicalInventoryAddressId', function() {
        scheduledPayments.search('', new Date(), new Date(), scheduledPayments.FILTER_BY_ALL, {BusinessAddressId: 'testBusinessId'});
        httpBackend.flush();
        expect(requestUrl.indexOf('PhysicalInventoryAddressId=testBusinessId')).not.toBe(-1);
      });

      it('should not filter by PhysicalInventoryAddressId', function() {
        scheduledPayments.search('', new Date(), new Date(), scheduledPayments.FILTER_BY_ALL);
        httpBackend.flush();
        expect(requestUrl.indexOf('PhysicalInventoryAddressId=testBusinessId')).toBe(-1);
      });

    });

    describe('isPending, toStatus, and getStatusDate', function() {

      it('should set isPending correctly', function() {
        var result;
        scheduledPayments.search('', new Date(), new Date()).then(function(res) {
          result = res;
        });
        httpBackend.flush();

        expect(result[0].isPending).toBe(true);
        expect(result[1].isPending).toBe(false);
        expect(result[2].isPending).toBe(false);
        expect(result[3].isPending).toBe(false);

      });

      it('should set status correctly', function() {
        var result;
        scheduledPayments.search('', new Date(), new Date()).then(function(res) {
          result = res;
        });
        httpBackend.flush();

        expect(result[0].status).toBe('Pending');
        expect(result[1].status).toBe('Processed');
        expect(result[2].status).toBe('Cancelled');
        expect(result[3].status).toBe('Voided');

      });

      it('should set status date correctly', function() {
        var result;
        scheduledPayments.search('', new Date(), new Date()).then(function(res) {
          result = res;
        });
        httpBackend.flush();

        expect(result[0].statusDate).toBe('2013-08-01');
        expect(result[1].statusDate).toBe('2013-08-02');
        expect(result[2].statusDate).toBe('2013-08-02');
        expect(result[3].statusDate).toBe('2013-08-13');

      });

    });

    it('should reject the search promise if result is past the infiniteScrollingMax', function() {
      config.infiniteScrollingMax = 1;
      var failureFn = jasmine.createSpy('failure');
      scheduledPayments.search('', new Date(), new Date()).then(
        function(){}, failureFn
      );
      rootScope.$digest();
      expect(httpBackend.flush).toThrow();
      expect(failureFn).toHaveBeenCalled();

    });


  });

});
