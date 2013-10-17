'use strict';

describe('Service: BusinessSearch', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var bs,
    httpBackend,
    urlParser;

  beforeEach(inject(function ($httpBackend, BusinessSearch, URLParser) {
    httpBackend = $httpBackend;
    bs = BusinessSearch;
    urlParser = URLParser;
  }));

  describe('search function, seller mode', function () {

    var paginate,
      searchResults = [],
      callParams,
      respondFnc = function(method, url) {
        callParams = urlParser.extractParams(url);
        return [200, {
          Success: true,
          Data: {
            SellerCount: 20,
            SearchResults: searchResults
          }
        }, {}];
      };

    beforeEach(inject(function (Paginate) {
      paginate = Paginate;
      httpBackend.whenGET(/\/dealer\/search\/seller.*/).respond(respondFnc);
    }));

    it('should call the expected API path', function () {
      httpBackend.expectGET(/\/dealer\/search\/seller.*/);
      bs.search(false, 'foo', 'BusinessName', false);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the requested sort field and order', function () {
      bs.search(false, 'foo', 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('BusinessName');
      expect(callParams.OrderByDirection).toBe('ASC');

      bs.search(false, 'foo', 'City', true);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('City');
      expect(callParams.OrderByDirection).toBe('DESC');
    });

    it('should provide a page size', function () {
      bs.search(false, 'foo', 'BusinessName', false);
      httpBackend.flush();
      expect(isNaN(parseInt(callParams.PageSize, 10))).toBe(false);
    });

    it('should start on the first page if a paginator is not provided', function () {
      bs.search(false, 'foo', 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.PageNumber).toBe(paginate.firstPage().toString());
    });

    it('should start on the next page if a paginator is provided', function () {
      bs.search(false, 'foo', 'BusinessName', false, {
        nextPage: function () {
          return 11;
        }
      });
      httpBackend.flush();
      expect(callParams.PageNumber).toBe('11');
    });

    it('should add a paginator to the results', function () {
      var output = {};
      bs.search(false, 'foo', 'BusinessName', false).then(function (results) {
        output = results;
      });
      httpBackend.flush();
      expect(output.$paginator).toBeDefined();
      expect(output.$paginator.nextPage()).toBe(2);
    });

    it('should NOT send a SearchCriteria if search term is empty/null', function () {
      bs.search(false, '', 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.SearchCriteria).not.toBeDefined();
    });

    it('should send the search term as SearchCriteria, if present', function () {
      bs.search(false, 'foobar', 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.SearchCriteria).toBe('foobar');
    });

  });

  describe('search function, buyer mode', function () {

    var paginate,
      searchResults = [],
      callParams,
      respondFnc = function(method, url) {
        callParams = urlParser.extractParams(url);
        return [200, {
          Success: true,
          Data: {
            DealerRowCount: 20,
            SearchResults: searchResults
          }
        }, {}];
      };

    beforeEach(inject(function (Paginate) {
      paginate = Paginate;
      httpBackend.whenGET(/\/dealer\/search\/buyer.*/).respond(respondFnc);
    }));

    it('should call the expected API path', function () {
      httpBackend.expectGET(/\/dealer\/search\/buyer.*/);
      bs.search(true, 'foo', 'BusinessName', false);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the requested sort field and order', function () {
      bs.search(true, 'foo', 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('BusinessName');
      expect(callParams.OrderByDirection).toBe('ASC');

      bs.search(true, 'foo', 'City', true);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('City');
      expect(callParams.OrderByDirection).toBe('DESC');
    });

    it('should provide a page size', function () {
      bs.search(true, 'foo', 'BusinessName', false);
      httpBackend.flush();
      expect(isNaN(parseInt(callParams.PageSize, 10))).toBe(false);
    });

    it('should start on the first page if a paginator is not provided', function () {
      bs.search(true, 'foo', 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.PageNumber).toBe(paginate.firstPage().toString());
    });

    it('should start on the next page if a paginator is provided', function () {
      bs.search(true, 'foo', 'BusinessName', false, {
        nextPage: function () {
          return 11;
        }
      });
      httpBackend.flush();
      expect(callParams.PageNumber).toBe('11');
    });

    it('should add a paginator to the results', function () {
      var output = {};
      bs.search(true, 'foo', 'BusinessName', false).then(function (results) {
        output = results;
      });
      httpBackend.flush();
      expect(output.$paginator).toBeDefined();
      expect(output.$paginator.nextPage()).toBe(2);
    });

    it('should NOT send BusinessName or BusinessNumber if search term is empty/null', function () {
      bs.search(true, '', 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.BusinessName).not.toBeDefined();
      expect(callParams.BusinessNumber).not.toBeDefined();
    });

    it('should send search term as BusinessName if non-numeric', function () {
      bs.search(true, 'foo', 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.BusinessName).toBe('foo');
      expect(callParams.BusinessNumber).not.toBeDefined();
    });

    it('should send search term as BusinessNumber if numeric', function () {
      bs.search(true, '1234', 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.BusinessName).not.toBeDefined();
      expect(callParams.BusinessNumber).toBe('1234');
    });

  });

});
