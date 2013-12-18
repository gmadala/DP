'use strict';

describe('Service: Receipts', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var receipts,
    httpBackend,
    urlParser;

  beforeEach(inject(function ($httpBackend,_Receipts_, URLParser) {
    httpBackend = $httpBackend;
    receipts = _Receipts_;
    urlParser = URLParser;
  }));

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
            ReceiptRowCount: 20,
            Receipts: searchResults
          }
        }, {}];
      };

    beforeEach(inject(function (Paginate) {
      paginate = Paginate;
      httpBackend.whenGET(/\/receipt\/search.*/).respond(respondFnc);
    }));

    it('should make a GET request to the expected endpoint', function () {
      httpBackend.expectGET(/\/receipt\/search.*/);
      receipts.search(defaultCriteria);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should ask for items sorted by most recent first by default', function () {
      receipts.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('CreateDate');
      expect(callParams.OrderByDirection).toBe('DESC');
    });

    it('should ask for items sorted by an arbitrary column if provided', function(){
      var tempCriteria = angular.copy(defaultCriteria);
      tempCriteria.sortField = 'arbitraryField';
      receipts.search(tempCriteria);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('arbitraryField');
      expect(callParams.OrderByDirection).toBe('DESC');
    });

    it('should ask for items sorted ascending if sortDesc is false', function(){
      var tempCriteria = angular.copy(defaultCriteria);
      tempCriteria.sortDesc = false;
      receipts.search(tempCriteria);
      httpBackend.flush();
      expect(callParams.OrderByDirection).toBe('ASC');
    });

    it('should ask for items sorted descending if sortDesc is true', function(){
      var tempCriteria = angular.copy(defaultCriteria);
      tempCriteria.sortDesc = true;
      receipts.search(tempCriteria);
      httpBackend.flush();
      expect(callParams.OrderByDirection).toBe('DESC');
    });

    it('should provide a page size', function () {
      receipts.search(defaultCriteria);
      httpBackend.flush();
      expect(isNaN(parseInt(callParams.PageSize, 10))).toBe(false);
    });

    it('should start on the first page if a paginator is not provided', function () {
      receipts.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.PageNumber).toBe(paginate.firstPage().toString());
    });

    it('should start on the next page if a paginator is provided', function () {
      receipts.search(defaultCriteria, {
        nextPage: function () {
          return 11;
        }
      });
      httpBackend.flush();
      expect(callParams.PageNumber).toBe('11');
    });

    it('should add a paginator to the results', function () {
      var output = {};
      receipts.search(defaultCriteria).then(function (results) {
        output = results;
      });
      httpBackend.flush();
      expect(output.$paginator).toBeDefined();
      expect(output.$paginator.nextPage()).toBe(2);
    });

    it('should add the appropriate $receiptURL to receipts', function () {
      var output = {};
      searchResults = [
        {
          FinancialTransactionId: 'foo123'
        }
      ];
      receipts.search(defaultCriteria).then(function (results) { output = results; });
      httpBackend.flush();
      expect(output.Receipts[0].$receiptURL).toBe('/receipt/view/foo123/Receipt');
    });

    it('should NOT send a Keyword if search term is empty/null', function () {
      receipts.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.Keyword).not.toBeDefined();
    });

    it('should send the search term as Keyword, if present', function () {
      receipts.search(angular.extend({}, defaultCriteria, {query: 'foo'}));
      httpBackend.flush();
      expect(callParams.Keyword).toBe('foo');
    });

    it('should not send startDate and endDate if not provided', function () {
      receipts.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.StartDate).not.toBeDefined();
      expect(callParams.EndDate).not.toBeDefined();
    });

    it('should send startDate and endDate if provided', function () {
      receipts.search(angular.extend({}, defaultCriteria, {
        startDate: moment([2013, 1, 1]).toDate(),
        endDate: moment([2013, 2, 1]).toDate()
      }));
      httpBackend.flush();
      expect(callParams.StartDate).toBe('2013-02-01');
      expect(callParams.EndDate).toBe('2013-03-01');
    });

    it('should send the filter as PaymentMethods', function () {
      receipts.search(angular.extend({}, defaultCriteria, {
        filter: '1,2,3,4'
      }));
      httpBackend.flush();
      expect(callParams.PaymentMethods).toBe('1,2,3,4');
    });

  });

  describe('getReceiptUrl method', function () {

    it('should append the provided transaction id to the correct path', function () {
      var result = receipts.getReceiptUrl('foo');
      expect(result).toBe('/receipt/view/foo/Receipt');
    });

  });

});
