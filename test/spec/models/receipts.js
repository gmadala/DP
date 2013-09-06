'use strict';

describe('Service: Receipts', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var receipts,
    httpBackend;

  beforeEach(inject(function ($httpBackend,_Receipts_) {
    httpBackend = $httpBackend;
    receipts = _Receipts_;
  }));

  it('should exist', function () {
    expect(!!receipts).toBe(true);
  });

  describe('search method', function () {

    beforeEach(function () {
      httpBackend.expectGET(/receipt\/search.*/)
        .respond({Success: true, Data: {Receipts: []}});
    });

    it('should make a GET request to the expected endpoint', function () {
      receipts.search({});
      httpBackend.flush();
    });

    it('should return a promise', function () {
      var resolveFn = jasmine.createSpy('success');
      receipts.search({}).then(resolveFn);
      httpBackend.flush();
      expect(resolveFn).toHaveBeenCalled();
    });

  });

});
