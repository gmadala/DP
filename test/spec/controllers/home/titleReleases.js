'use strict';

describe('Controller: TitleReleasesCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var TitleReleasesCtrl,
    titleReleasesMock,
    searchResult = {
      data: {}
    },
    scope,
    initController,
    httpBackend,
    floorplanMock,
    dialogMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, $httpBackend, Floorplan) {
    scope = $rootScope.$new();
    titleReleasesMock = {
      addToQueue: angular.noop,
      removeFromQueue: angular.noop,
      getTitleReleaseEligibility: angular.noop,
      isFloorplanOnQueue: angular.noop
    };
    floorplanMock = {
      search: function(){
        return $q.when(searchResult.data);
      },
      filterValues: Floorplan.filterValues
    };

    dialogMock = {
      messageBox: function() {
        return {
          open: angular.noop
        };
      }
    };

    httpBackend = $httpBackend;

    TitleReleasesCtrl = $controller('TitleReleasesCtrl', {
      $scope: scope,
      TitleReleases: titleReleasesMock,
      Floorplan: floorplanMock,
      $dialog: dialogMock
    });

  }));

  it('should attach a data object to the scope with expected properties', function () {
    expect(scope.data).toBeDefined();
    expect(angular.isArray(scope.data.results)).toBe(true);
    expect(typeof scope.data.loading).toBe('boolean');
  });

  it('should attach a search function to the scope', function () {
    expect(typeof scope.search).toBe('function');
  });

  describe('search function', function() {
    it('should clear any prior results', function () {
      scope.data.results = ['foo', 'bar'];
      scope.search();
      expect(scope.data.results.length).toBe(0);
      expect(scope.data.hitInfiniteScrollMax).toBe(false);
    });

    it('should commit the proposedSearchCriteria (as a copy)', function () {
      scope.searchParams.proposedSearchCriteria = {
        query: 'foo',
        startDate: new Date(2013, 4, 4),
        endDate: new Date(),
        filter: 'something'
      };
      scope.search();
      expect(scope.searchParams.proposedSearchCriteria).toEqual(scope.searchCriteria);
      expect(scope.searchCriteria).not.toBe(scope.searchParams.proposedSearchCriteria);
    });

    it('should call for data with no paginator to start at beginning', function () {
      spyOn(floorplanMock, 'search').andCallThrough();
      scope.search();
      expect(floorplanMock.search).toHaveBeenCalledWith(scope.searchCriteria, null);
    });
  });

  describe('sortBy function', function(){

    it('should set sortField properly', function(){
      scope.sortBy('fieldA');
      expect(scope.sortField).toEqual('fieldA');

      scope.sortBy('fieldB');
      expect(scope.sortField).toEqual('fieldB');

      scope.sortBy('fieldB');
      expect(scope.sortField).toEqual('fieldB');

      scope.sortBy('fieldA');
      expect(scope.sortField).toEqual('fieldA');
    });

    it('should set sortDescending true only if sortBy is called consecutively with the same field name', function(){
      scope.sortBy('fieldB');
      expect(scope.sortDescending).toBeFalsy();

      scope.sortBy('fieldB');
      expect(scope.sortDescending).toBeTruthy();

      scope.sortBy('fieldB');
      expect(scope.sortDescending).toBeFalsy();

      scope.sortBy('fieldA');
      expect(scope.sortDescending).toBeFalsy();

      scope.sortBy('fieldA');
      expect(scope.sortDescending).toBeTruthy();

      scope.sortBy('fieldB');
      expect(scope.sortDescending).toBeFalsy();
    });

    it('should call search()', function(){
      spyOn(scope, 'search');
      scope.sortBy('fieldA');
      expect(scope.search).toHaveBeenCalled();
    });

    it('should set proposedSearchCriteria properties', function(){
      scope.sortBy('fieldA');
      expect(scope.sortField).toEqual(scope.searchParams.proposedSearchCriteria.sortField);
      expect(scope.sortDescending).toEqual(scope.searchParams.proposedSearchCriteria.sortDesc);

      scope.sortBy('fieldA');
      expect(scope.sortField).toEqual(scope.searchParams.proposedSearchCriteria.sortField);
      expect(scope.sortDescending).toEqual(scope.searchParams.proposedSearchCriteria.sortDesc);

      scope.sortBy('fieldB');
      expect(scope.sortField).toEqual(scope.searchParams.proposedSearchCriteria.sortField);
      expect(scope.sortDescending).toEqual(scope.searchParams.proposedSearchCriteria.sortDesc);
    });

  });

  it('should attach a fetchNextResults function to the scope', function () {
    expect(typeof scope.fetchNextResults).toBe('function');
  });


  describe('fetchNextResults function', function () {

    it('should not call for data if the paginator indicates it is already at the end', function () {
      spyOn(floorplanMock, 'search').andCallThrough();

      scope.data.paginator = {
        hasMore: function () {
          return false;
        },
        hitMaximumLimit: function() {
          return true;
        }
      };

      scope.fetchNextResults();
      expect(floorplanMock.search).not.toHaveBeenCalled();
      expect(scope.data.hitInfiniteScrollMax).toBe(true);
    });

    it('should set loading to true while waiting for results', function () {
      scope.fetchNextResults();
      expect(scope.data.loading).toBe(true);
    });

    it('should set loading to false on success', function () {
      scope.fetchNextResults();
      scope.$apply();
      expect(scope.data.loading).toBe(false);
    });

    it('should set loading to false on error', inject(function ($q) {
      searchResult.data = $q.reject('oops!');
      scope.fetchNextResults();
      scope.$apply();
      expect(scope.data.loading).toBe(false);
    }));

    it('should pass back the paginator from previous calls on subsequent ones', function () {
      spyOn(floorplanMock, 'search').andCallThrough();
      var p = {
        hasMore: function () {
          return true;
        },
        hitMaximumLimit: function() {
          return false;
        }
      };
      searchResult.data = {
        $paginator: p
      };
      scope.fetchNextResults();
      scope.$apply();
      scope.fetchNextResults();
      expect(floorplanMock.search.mostRecentCall.args[1]).toBe(p);
    });

    it('should append new results to the results array', function () {
      scope.data.results = ['one', 'two'];
      searchResult.data = {
        Floorplans: ['three', 'four']
      };
      scope.fetchNextResults();
      scope.$apply();
      expect(scope.data.results).toEqual(['one', 'two', 'three', 'four']);
    });

  });

  it('should properly toggle titleRequested property', function() {
    var floorplan = {};
    var inQueue = false;

    spyOn(titleReleasesMock, 'isFloorplanOnQueue').andCallFake(function(){
      return inQueue;
    });

    spyOn(titleReleasesMock, 'addToQueue');
    spyOn(titleReleasesMock, 'removeFromQueue');

    scope.toggleSelected(floorplan);
    expect(titleReleasesMock.addToQueue).toHaveBeenCalled();
    expect(titleReleasesMock.removeFromQueue).not.toHaveBeenCalled();

    inQueue = true;

    scope.toggleSelected(floorplan);
    expect(titleReleasesMock.removeFromQueue).toHaveBeenCalled();

  });

  it('should display message box when release is unavailable', function() {
    spyOn(dialogMock, 'messageBox').andCallThrough();
    scope.titleReleaseUnavailable();
    expect(dialogMock.messageBox).toHaveBeenCalled();
  });

  it('should display message box when release limit method is called', function() {
    spyOn(dialogMock, 'messageBox').andCallThrough();
    scope.titleReleaseLimitReached();
    expect(dialogMock.messageBox).toHaveBeenCalled();
  });

});
