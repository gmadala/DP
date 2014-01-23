'use strict';

describe('Model: DealerNumberSearch', function() {

  beforeEach(module('nextgearWebApp'));

  var dealerNumberSearch,
    httpBackend,
    urlParser,
    businessSearchResults = {
      "SearchResults": [
        {
          "BusinessId": "1addd16e-0e12-40a5-8558-3b926b4c9049",
          "BusinessName": "Cortese Chrysler Jeep Dodge Ram",
          "BusinessLegalName": "Cortese Auto Group.",
          "BusinessNumber": 72694,
          "AuctionAccessDealershipNumbers": [ 12345, 23455 ],
          "Address": "2400 W Henrietta Rd",
          "City": "Rochester",
          "State": "New York",
          "PostalCode": "14623",
          "IsBuyer": true
        },
        {
          "BusinessId": "1addd16e-0e12-40a5-85aa-350555555049",
          "BusinessName": "Cortese Lincoln",
          "BusinessLegalName": "Cortese Auto Group.",
          "BusinessNumber": 72695,
          "AuctionAccessDealershipNumbers": [ 12346, 23456 ],
          "Address": "2452 West Henrietta Road",
          "City": "Rochester",
          "State": "New York",
          "PostalCode": "14623",
          "IsBuyer": true
        }
      ]
    };

  beforeEach(inject(function($httpBackend, DealerNumberSearch, URLParser) {
    dealerNumberSearch = DealerNumberSearch;
    httpBackend = $httpBackend;
    urlParser = URLParser;
  }));

  describe('searchByDealerNumber method', function() {
    var params;

    beforeEach(function() {
      httpBackend.expectGET(/\/dealer\/search\/buyer.*/).respond(
        function(method, url, data) {
          params = urlParser.extractParams(url);
          return [200, {
            "Success": true,
            "Message": null,
            "Data": businessSearchResults
          }, {}];
        }
      );
    });

    it('should send the expected data', function() {
      dealerNumberSearch.searchByDealerNumber('1234');
      httpBackend.flush();
      expect(params.BusinessNumber).toBe('1234');
    });

    it('should return a promise', function() {
      var ret = dealerNumberSearch.searchByDealerNumber('1234');
      expect(typeof ret.then).toBe('function');
    });

    it('should return a promise that resolves to an object', function() {
      var out = null;
      dealerNumberSearch.searchByDealerNumber('1234').then(
        function(result) {
          out = result;
        });
      httpBackend.flush();
      expect(typeof out).toBe('object');
    });

    it('should return a promise that resolves to the first item of the SearchResults property of the returned data', function() {
      var out = null;
      dealerNumberSearch.searchByDealerNumber('1234').then(
        function(result) {
          out = result;
        });
      httpBackend.flush();
      expect(out).toBe(businessSearchResults.SearchResults[0]);
    });
  });

  describe('searchByAuctionAccessNumber method', function() {
    var params;

    beforeEach(function() {
      httpBackend.expectGET(/\/dealer\/search\/buyer.*/).respond(
        function(method, url, data) {
          params = urlParser.extractParams(url);
          return [200, {
            "Success": true,
            "Message": null,
            "Data": businessSearchResults
          }, {}];
        }
      );
    });

    it('should send the expected data', function() {
      dealerNumberSearch.searchByAuctionAccessNumber('1234');
      httpBackend.flush();
      expect(params.AuctionAccessNumber).toBe('1234');
    });

    it('should return a promise', function() {
      var ret = dealerNumberSearch.searchByAuctionAccessNumber('1234');
      expect(typeof ret.then).toBe('function');
    });

    it('should return a promise that resolves to an Array', function() {
      var out = null;
      dealerNumberSearch.searchByAuctionAccessNumber('1234').then(
        function(result) {
          out = result;
        });
      httpBackend.flush();
      expect(typeof out).toBe('object');
    });

    it('should return a promise that resolves to the first item of the SearchResults property of the returned data', function() {
      var out = null;
      dealerNumberSearch.searchByAuctionAccessNumber('1234').then(
        function(result) {
          out = result;
        });
      httpBackend.flush();
      expect(out).toBe(businessSearchResults.SearchResults[0]);
    });

    it('should return null if there were no SearchResults returned', function() {
      // Store old value of businessSearchResults so after the test we can put it back
      var resultsStore = businessSearchResults;

      businessSearchResults = {SearchResults: []};

      var out = 'something defined';
      dealerNumberSearch.searchByAuctionAccessNumber('1234').then(
        function(result) {
          out = result;
        });
      httpBackend.flush();
      expect(out).toBe(null);

      // Replace businessSearchResults
      businessSearchResults = resultsStore;

    });
  });

});
