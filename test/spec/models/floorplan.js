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

});
