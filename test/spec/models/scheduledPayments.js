'use strict';

describe('Model: Scheduled Payments', function() {

  // load the service's modeule
  beforeEach(module('nextgearWebApp'));

  var scheduledPayments,
    httpBackend;

  beforeEach(inject(function($httpBackend, ScheduledPaymentsSearch) {
    httpBackend = $httpBackend;
    scheduledPayments = ScheduledPaymentsSearch;
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
      scheduledPayments.loadMoreData();
      httpBackend.flush();
    });

    it('should return a promise', function() {
      var resolveFn = jasmine.createSpy('success');
      scheduledPayments.loadMoreData().then(resolveFn);
      httpBackend.flush();
      expect(resolveFn).toHaveBeenCalled();
    });
  });

});
