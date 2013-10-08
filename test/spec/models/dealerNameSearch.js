'use strict';

describe('Service: DealerNameSearch', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var ds,
    httpBackend,
    urlParser;

  beforeEach(inject(function ($httpBackend, DealerNameSearch, URLParser) {
    httpBackend = $httpBackend;
    ds = DealerNameSearch;
    urlParser = URLParser;
  }));

  describe('search function', function () {

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
      ds.search('foo', 'denver', { StateId: 'CO' }, 'BusinessName', false);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the requested sort field and order', function () {
      ds.search('foo', 'denver', { StateId: 'CO' }, 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('BusinessName');
      expect(callParams.OrderDirection).toBe('ASC');

      ds.search('foo', 'denver', { StateId: 'CO' }, 'City', true);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('City');
      expect(callParams.OrderDirection).toBe('DESC');
    });

    it('should provide a page size', function () {
      ds.search('foo', 'denver', { StateId: 'CO' }, 'BusinessName', false);
      httpBackend.flush();
      expect(isNaN(parseInt(callParams.PageSize, 10))).toBe(false);
    });

    it('should start on the first page if a paginator is not provided', function () {
      ds.search('foo', 'denver', { StateId: 'CO' }, 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.PageNumber).toBe(paginate.firstPage().toString());
    });

    it('should start on the next page if a paginator is provided', function () {
      ds.search('foo', 'denver', { StateId: 'CO' }, 'BusinessName', false, {
        nextPage: function () {
          return 11;
        }
      });
      httpBackend.flush();
      expect(callParams.PageNumber).toBe('11');
    });

    it('should add a paginator to the results', function () {
      var output = {};
      ds.search('foo', 'denver', { StateId: 'CO' }, 'BusinessName', false).then(function (results) {
        output = results;
      });
      httpBackend.flush();
      expect(output.$paginator).toBeDefined();
      expect(output.$paginator.nextPage()).toBe(2);
    });

    it('should NOT send City param if city is not provided', function () {
      ds.search('foo', '', { StateId: 'CO' }, 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.City).not.toBeDefined();
    });

    it('should NOT send StateId param if state is not provided', function () {
      ds.search('foo', 'denver', null, 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.StateId).not.toBeDefined();
    });

    it('should throw an error if both city and state are missing', function () {
      expect(function () {
        ds.search('foo', '', null, 'BusinessName', false);
      }).toThrow();
    });

    it('should send BusinessName, City, and StateId if provided', function () {
      ds.search('foo', 'denver', { StateId: 'CO' }, 'BusinessName', false);
      httpBackend.flush();
      expect(callParams.BusinessName).toBe('foo');
      expect(callParams.City).toBe('denver');
      expect(callParams.StateId).toBe('CO');
    });

  });

});
