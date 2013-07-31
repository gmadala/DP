'use strict';

describe('Service: BusinessSearch', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var BusinessSearch,
      httpBackend;

  beforeEach(inject(function (_BusinessSearch_, $httpBackend) {
    BusinessSearch = new _BusinessSearch_();
    httpBackend = $httpBackend;
    httpBackend.when('GET', '/Dealer/SearchSeller').respond({
      'Data': {
        'DealerInfoList': [
          {
            'BusinessId': '1',
            'BusinessNumber': '1',
            'BusinessName': 'One',
            'IsUniversalSource': true
          }
        ]
      }
    });
  }));

  it('should have results', function() {
    expect(BusinessSearch.results.length).toBe(0);
  });

  it('should not be loading by default', function() {
    expect(BusinessSearch.loading).toBe(false);
  });

  it('should fetch new data', function() {
    expect(BusinessSearch.loadMore).toBeDefined();
    expect(BusinessSearch.results.length).toBe(0);
    BusinessSearch.loadMore();
    httpBackend.flush();
    expect(BusinessSearch.results.length).toBe(1);
  });

  it('should not fetch new data while another request is happening', function() {
    expect(BusinessSearch.loading).toBe(false);
    BusinessSearch.loadMore();
    expect(BusinessSearch.loading).toBe(true);
    BusinessSearch.loadMore();
    expect(BusinessSearch.loading).toBe(true);
    httpBackend.flush();
    expect(BusinessSearch.loading).toBe(false);
  });
});
