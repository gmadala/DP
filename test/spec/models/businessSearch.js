'use strict';

describe('Service: BusinessSearch', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var businessSearch,
      httpBackend;

  beforeEach(inject(function ($httpBackend, BusinessSearch) {
    httpBackend = $httpBackend;
    httpBackend.when('GET', '/Dealer/SearchSeller').respond({});
    businessSearch = BusinessSearch;
  }));

  // Not sure how to test this one yet.
});
