'use strict';

describe('Model: TitleReleases', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var titleReleases,
    httpBackend,
    rootScope,
    data,
    TitleAddresses,
    urlParser,
    $q;

  beforeEach(inject(function ($httpBackend, _TitleAddresses_, _$q_, URLParser) {
    httpBackend = $httpBackend;
    TitleAddresses = _TitleAddresses_;
    $q = _$q_;
    urlParser = URLParser;

    data = {
      DealerIsEligibleToReleaseTitles: true,
      TotalReleasesAllowed: 4,
      RemainingReleasesAvailable: 3,
      ReleaseBalanceAvailable: 1000
    };

    httpBackend.whenGET('/titleRelease/getTitleReleaseEligibility').respond({
      Success: true,
      Message: null,
      Data: data
    });

  }));

  beforeEach(inject(function ($rootScope, TitleReleases) {
    titleReleases = TitleReleases;
    rootScope = $rootScope;
  }));

  it('should define filterValues', function() {
    expect(typeof titleReleases.filterValues).toBe('object');
    expect(titleReleases.filterValues.ALL).toBe('all');
    expect(titleReleases.filterValues.OUTSTANDING).toBe('outstanding');
    expect(titleReleases.filterValues.ELIGIBLE).toBe('eligible');
    expect(titleReleases.filterValues.NOT_ELIGIBLE).toBe('not_eligible');
  });

  it('should return the title release eligibility', function() {
    var result;
    httpBackend.expectGET('/titleRelease/getTitleReleaseEligibility');
    titleReleases.getTitleReleaseEligibility().then(function(res){
      result = res;
    });
    expect(httpBackend.flush).not.toThrow();
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

    it('should have a getQueueFinanced method that sums the value of floorplans in queue', function() {
      titleReleases.getQueue().push({AmountFinanced: 100});
      titleReleases.getQueue().push({AmountFinanced: 500});
      titleReleases.getQueue().push({AmountFinanced: 150});
      expect(titleReleases.getQueueFinanced()).toBe(750);
    });

  });

  it('should make request for title releases', function() {

    var request;

    titleReleases.addToQueue({
      FloorplanId: '10',
      overrideAddress: {BusinessAddressId: 1}
    });
    titleReleases.addToQueue({
      FloorplanId: '11',
      overrideAddress: {BusinessAddressId: 2}
    });
    httpBackend.expectPOST('/titleRelease/RequestTitleRelease').respond(function(method, path, data) {
      request = angular.fromJson(data);
      return {
        Success: true,
        Message: null,
        Data: null
      };
    });
    titleReleases.makeRequest();
    rootScope.$apply();
    expect(httpBackend.flush).not.toThrow();
    expect(request).toEqual({
      TitleReleases: [
        {FloorplanId: '10', ReleaseAddressId: 1},
        {FloorplanId: '11', ReleaseAddressId: 2}
      ]
    });
  });

  it('should fetch the default address if one or more floorplans does not have an override address', function() {

    var request;

    spyOn(TitleAddresses, 'getDefaultAddress').andReturn($q.when({BusinessAddressId: 12}));

    titleReleases.addToQueue({
      FloorplanId: '10'
    });
    titleReleases.addToQueue({
      FloorplanId: '11',
      overrideAddress: {BusinessAddressId: 2}
    });
    httpBackend.expectPOST('/titleRelease/RequestTitleRelease').respond(function(method, path, data) {
      request = angular.fromJson(data);
      return {
        Success: true,
        Message: null,
        Data: null
      };
    });
    titleReleases.makeRequest();
    rootScope.$apply();
    expect(TitleAddresses.getDefaultAddress).toHaveBeenCalled();
    expect(httpBackend.flush).not.toThrow();
    expect(request).toEqual({
      TitleReleases: [
        {FloorplanId: '10', ReleaseAddressId: 12},
        {FloorplanId: '11', ReleaseAddressId: 2}
      ]
    });
  });

  describe('search method', function () {

    var paginate,
      defaultCriteria,
      searchResults = [],
      callParams,
      respondFnc = function(method, url) {
        callParams = urlParser.extractParams(url);
        return [200, {
          Success: true,
          Data: {
            FloorplanRowCount: 20,
            Floorplans: searchResults
          }
        }, {}];
      },
      clock;

    beforeEach(inject(function (Paginate, User) {
      paginate = Paginate;
      defaultCriteria = {
        query: '',
        startDate: null,
        endDate: null,
        filter: titleReleases.filterValues.ALL
      };
      httpBackend.whenGET(/\/titleRelease\/search.*/).respond(respondFnc);
      defaultCriteria.filter = titleReleases.filterValues.ALL;
      spyOn(User, 'getInfo').andReturn({ BusinessNumber: '123' });
      clock = sinon.useFakeTimers(moment([2014, 2, 20, 0, 0]).valueOf(), 'Date');
    }));

    afterEach(function () {
      clock.restore();
    });

    it('should call the expected API path', function () {
      httpBackend.expectGET(/\/titleRelease\/search.*/);
      titleReleases.search(defaultCriteria);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should ask for items sorted by most recent FlooringDate first by default', function () {
      titleReleases.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('FlooringDate');
      expect(callParams.OrderByDirection).toBe('DESC');
    });

    it('should ask for items sorted by most recent last if sortDesc is set and is false', function () {
      var tempCriteria = angular.copy(defaultCriteria);
      tempCriteria.sortDesc = false;
      titleReleases.search(tempCriteria);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('FlooringDate');
      expect(callParams.OrderByDirection).toBe('ASC');
    });

    it('should ask for items sorted by an arbitrary column if that column is specified', function () {
      var tempCriteria = angular.copy(defaultCriteria);
      tempCriteria.sortDesc = true;
      tempCriteria.sortField = 'anyGivenField';
      titleReleases.search(tempCriteria);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('anyGivenField');
      expect(callParams.OrderByDirection).toBe('DESC');
    });


    it('should provide a page size', function () {
      titleReleases.search(defaultCriteria);
      httpBackend.flush();
      expect(isNaN(parseInt(callParams.PageSize, 10))).toBe(false);
    });

    it('should start on the first page if a paginator is not provided', function () {
      titleReleases.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.PageNumber).toBe(paginate.firstPage().toString());
    });

    it('should start on the next page if a paginator is provided', function () {
      titleReleases.search(defaultCriteria, {
        nextPage: function () {
          return 11;
        }
      });
      httpBackend.flush();
      expect(callParams.PageNumber).toBe('11');
    });

    it('should add a paginator to the results', function () {
      var output = {};
      titleReleases.search(defaultCriteria).then(function (results) {
        output = results;
      });
      httpBackend.flush();
      expect(output.$paginator).toBeDefined();
      expect(output.$paginator.nextPage()).toBe(2);
    });

    it('should NOT send a Keyword if search term is empty/null', function () {
      titleReleases.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.Keyword).not.toBeDefined();
    });

    it('should send the search term as Keyword, if present', function () {
      titleReleases.search(angular.extend({}, defaultCriteria, {query: 'foo'}));
      httpBackend.flush();
      expect(callParams.Keyword).toBe('foo');
    });

    it('should not send startDate and endDate if not provided', function () {
      titleReleases.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.StartDate).not.toBeDefined();
      expect(callParams.EndDate).not.toBeDefined();
    });

    it('should send startDate and endDate if provided', function () {
      var startDate = moment('2012-01-01', 'YYYY-MM-DD').toDate();
      var endDate = moment('2013-04-01', 'YYYY-MM-DD').toDate();

      titleReleases.search(angular.extend(defaultCriteria, {startDate: startDate, endDate: endDate}));
      httpBackend.flush();
      expect(callParams.StartDate).toBe('2012-01-01');
      expect(callParams.EndDate).toBe('2013-04-01');
    });

    it('should set all filter booleans to true if ALL provided', function () {
      titleReleases.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.SearchOutstandingTitleReleaseProgramRelease).toBe('true');
      expect(callParams.SearchEligibleForRelease).toBe('true');
      expect(callParams.SearchNotEligibleForRelease).toBe('true');
    });

    it('should set only outstanding filter boolean to true if provided', function () {
      titleReleases.search(angular.extend(defaultCriteria, {filter: titleReleases.filterValues.OUTSTANDING}));
      httpBackend.flush();
      expect(callParams.SearchOutstandingTitleReleaseProgramRelease).toBe('true');
      expect(callParams.SearchEligibleForRelease).toBe('false');
      expect(callParams.SearchNotEligibleForRelease).toBe('false');
    });

    it('should set only eligible filter boolean to true if provided', function () {
      titleReleases.search(angular.extend(defaultCriteria, {filter: titleReleases.filterValues.ELIGIBLE}));
      httpBackend.flush();
      expect(callParams.SearchOutstandingTitleReleaseProgramRelease).toBe('false');
      expect(callParams.SearchEligibleForRelease).toBe('true');
      expect(callParams.SearchNotEligibleForRelease).toBe('false');
    });

    it('should set only not eligible filter boolean to true if provided', function () {
      titleReleases.search(angular.extend(defaultCriteria, {filter: titleReleases.filterValues.NOT_ELIGIBLE}));
      httpBackend.flush();
      expect(callParams.SearchOutstandingTitleReleaseProgramRelease).toBe('false');
      expect(callParams.SearchEligibleForRelease).toBe('false');
      expect(callParams.SearchNotEligibleForRelease).toBe('true');
    });

    describe('search results', function() {
      var result;

      beforeEach(function() {
        searchResults.push({
          FlooringDate: '2013-03-20'
        });
        searchResults.push({
          FlooringDate: '2014-03-20'
        });
        searchResults.push({});

        titleReleases.search(defaultCriteria).then(function(res) {
          result = res;
        });
        httpBackend.flush();
      });

      it('should return proper results', function() {
        expect(result.Floorplans.length).toBe(3);
        var today = moment();
        expect(result.Floorplans[0].FlooringDate).toBe('2013-03-20');
        expect(result.Floorplans[0].DaysFloored).toBe(today.diff(moment('2013-03-20', 'YYYY-MM-DD'), 'days'));

        expect(result.Floorplans[1].FlooringDate).toBe('2014-03-20');
        expect(result.Floorplans[1].DaysFloored).toBe(today.diff(moment('2014-03-20', 'YYYY-MM-DD'), 'days'));

        expect(result.Floorplans[2].FlooringDate).not.toBeDefined();
        expect(result.Floorplans[2].DaysFloored).not.toBeDefined();


      });

    });

  });

});
