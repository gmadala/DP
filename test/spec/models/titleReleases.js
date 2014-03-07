'use strict';

describe('Model: TitleReleases', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var titleReleases,
    httpBackend,
    rootScope,
    data;

  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;

    data = {
      DealerIsEligibleToReleaseTitles: true,
      TotalReleasesAllowed: 4,
      RemainingReleasesAvailable: 3,
      ReleaseBalanceAvailable: 1000
    };

    httpBackend.expectGET('/dealer/getTitleReleaseEligibility').respond({
      Success: true,
      Message: null,
      Data: data
    });

  }));

  beforeEach(inject(function ($rootScope, TitleReleases) {
    titleReleases = TitleReleases;
    rootScope = $rootScope;

    expect(httpBackend.flush).not.toThrow();

  }));

  it('should return isEligible properly', function() {
    var result;
    titleReleases.isEligible().then(function(res){
      result = res;
    });
    rootScope.$digest();
    expect(result).toBe(true);
  });

  it('should return the title release eligibility', function() {
    var result;
    titleReleases.getTitleReleaseEligibility().then(function(res){
      result = res;
    });
    rootScope.$digest();
    expect(result).toEqual(data);
  });

  describe('queue', function() {

    it('should have a getQueue method that returns an array', function() {
      expect(titleReleases.getQueue() instanceof Array).toBe(true);
    });

    it('should add and remove from queue properly', function() {
      var floorplan1 = {FloorplanId: 1};
      var floorplan2 = {FloorplanId: 2};
      var floorplan3 = {FloorplanId: 3};
      var floorplan4 = {FloorplanId: 4};

      expect(titleReleases.getQueue().length).toBe(0);
      titleReleases.addToQueue(floorplan1);
      expect(titleReleases.getQueue().length).toBe(1);
      titleReleases.addToQueue(floorplan2);
      expect(titleReleases.getQueue().length).toBe(2);
      titleReleases.addToQueue(floorplan3);
      expect(titleReleases.getQueue().length).toBe(3);
      titleReleases.addToQueue(floorplan4);
      expect(titleReleases.getQueue().length).toBe(4);

      titleReleases.removeFromQueue(floorplan2);
      expect(titleReleases.getQueue().length).toBe(3);
      expect(titleReleases.getQueue()[0]).toBe(floorplan1);
      expect(titleReleases.getQueue()[1]).toBe(floorplan3);
      expect(titleReleases.getQueue()[2]).toBe(floorplan4);

      titleReleases.removeFromQueue(floorplan3);
      expect(titleReleases.getQueue().length).toBe(2);
      expect(titleReleases.getQueue()[0]).toBe(floorplan1);
      expect(titleReleases.getQueue()[1]).toBe(floorplan4);

    });

  });

  it('should make request for title releases', function() {

    var request;

    titleReleases.addToQueue({
      FloorplanId: '10',
      other: 'value'
    });
    titleReleases.addToQueue({
      FloorplanId: '11',
      other: 'value'
    });
    httpBackend.expectPOST('/Floorplan/RequestTitleRelease').respond(function(method, path, data) {
      request = angular.fromJson(data);
      return {
        Success: true,
        Message: null,
        Data: null
      };
    });
    titleReleases.makeRequest();
    expect(httpBackend.flush).not.toThrow();
    expect(request).toEqual({
      ReleaseAddressId: '5',
      TitleReleaseFloorplans: [
        {FloorplanId: '10'},
        {FloorplanId: '11'}
      ]
    });
  });

});
