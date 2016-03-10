'use strict';

describe('Controller: FloorplanCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorplanCtrl,
    stateParamsMock,
    floorplan,
    floorplanUtil,
    myPlan,
    filterOpts,
    defaultSort,
    searchSpy,
    shouldSucceed = true,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $q, Floorplan, FloorplanUtil) {
    scope = $rootScope.$new();
    stateParamsMock = {
      filter: 'fooFilter'
    };
    floorplanUtil = FloorplanUtil;

    searchSpy = spyOn(Floorplan, 'search').and.callFake(function() {
      if(shouldSucceed) {
        return $q.when({ Floorplans: ['one', 'two'] });
      } else {
        return $q.reject(false);
      }
    });

    defaultSort = 'FlooringDate';
    filterOpts = [
      { label: 'foo', value: 1 },
      { label: 'bar', value: 2 }
    ];

    myPlan = new FloorplanUtil(defaultSort, filterOpts);
  }));

  it('should create a FloorplanUtil object with default properties', function() {
    expect(angular.isArray(myPlan.results)).toBe(true);
    expect(typeof myPlan.loading).toBe('boolean');
    expect(myPlan.paginator).toBeDefined();
    expect(myPlan.hitInfiniteScrollMax).toBe(false);
    expect(myPlan.defaultSort).toBe(defaultSort);
    expect(typeof myPlan.searchCriteria).toBe('object');
    expect(myPlan.searchCriteria.filter).toBe(filterOpts);
    expect(myPlan.searchCriteria.sortField).toBe(defaultSort);
  });

  it('should attach a search function to the scope', function() {
    expect(typeof myPlan.search).toBe('function');
  });

  describe('search function', function() {
    it('should clear any prior results', function() {
      myPlan.results = ['foo', 'bar'];
      myPlan.search(myPlan.searchCriteria);
      expect(myPlan.results.length).toBe(0);
      expect(myPlan.hitInfiniteScrollMax).toBe(false);
    });
  });

  describe('sortBy function', function(){

    it('should set sortField properly', function(){
      myPlan.sortBy('fieldA');
      expect(myPlan.searchCriteria.sortField).toEqual('fieldA');

      myPlan.sortBy('fieldB');
      expect(myPlan.searchCriteria.sortField).toEqual('fieldB');

      myPlan.sortBy('fieldB');
      expect(myPlan.searchCriteria.sortField).toEqual('fieldB');

      myPlan.sortBy('fieldA');
      expect(myPlan.searchCriteria.sortField).toEqual('fieldA');
    });

    it('should set sortDescending true only if sortBy is called consecutively with the same field name', function(){
      myPlan.sortBy('fieldB');
      expect(myPlan.searchCriteria.sortDescending).toBeFalsy();

      myPlan.sortBy('fieldB');
      expect(myPlan.searchCriteria.sortDescending).toBeTruthy();

      myPlan.sortBy('fieldB');
      expect(myPlan.searchCriteria.sortDescending).toBeFalsy();

      myPlan.sortBy('fieldA');
      expect(myPlan.searchCriteria.sortDescending).toBeFalsy();

      myPlan.sortBy('fieldA');
      expect(myPlan.searchCriteria.sortDescending).toBeTruthy();

      myPlan.sortBy('fieldB');
      expect(myPlan.searchCriteria.sortDescending).toBeFalsy();
    });

    it('should call search()', function(){
      spyOn(myPlan, 'search');
      myPlan.sortBy('fieldA');
      expect(myPlan.search).toHaveBeenCalled();
    });
  });

  it('should have a fetchNextResults function', function() {
    expect(typeof myPlan.fetchNextResults).toBe('function');
  });

  describe('fetchNextResults function', function() {
    it('should not call for data if the paginator indicates it is already at the end', inject(function(Floorplan) {
      var originalCallCount = Floorplan.search.calls.length;

      myPlan.paginator = {
        hasMore: function() {
          return false;
        },
        hitMaximumLimit: function() {
          return true;
        }
      };

      myPlan.fetchNextResults();
      expect(Floorplan.search.calls.length).toBe(originalCallCount);
      expect(myPlan.hitInfiniteScrollMax).toBe(true);
    }));

    it('should set loading to true while waiting for results', function() {
      myPlan.fetchNextResults();
      expect(myPlan.loading).toBe(true);
    });

    it('should set loading to false on success', inject(function($rootScope) {
      shouldSucceed = true;
      myPlan.fetchNextResults();
      $rootScope.$apply();
      expect(myPlan.loading).toBe(false);
    }));

    it('should set loading to false on error', inject(function($rootScope) {
      shouldSucceed = false;
      myPlan.fetchNextResults();
      $rootScope.$apply();
      expect(myPlan.loading).toBe(false);
    }));

    it('should pass back the paginator from previous calls on subsequent ones', inject(function(Floorplan, $q, $rootScope) {
      var p = {
        hasMore: function() {
          return true;
        },
        hitMaximumLimit: function() {
          return false;
        }
      };

      searchSpy.and.returnValue( $q.when({ $paginator: p }) );
      myPlan.fetchNextResults();
      $rootScope.$apply();
      myPlan.fetchNextResults();
      expect(Floorplan.search.calls.mostRecent().args[1]).toBe(p);
    }));

    it('should append new results to the results array', inject(function($rootScope) {
      shouldSucceed = true;
      myPlan.results = ['three', 'four'];
      myPlan.fetchNextResults();
      $rootScope.$digest();
      expect(myPlan.results).toEqual(['three', 'four', 'one', 'two']);
    }));

  });

  it('should have a resetSearch function', function() {
    expect(typeof myPlan.resetSearch).toBe('function');
  });

  describe('resetSearch function', function() {

    it('should reset the searchCriteria object with search defaults', function() {
      myPlan.searchCriteria = null;
      myPlan.resetSearch();
      expect(myPlan.searchCriteria.query).toBe(null);
      expect(myPlan.searchCriteria.startDate).toBe(null);
      expect(myPlan.searchCriteria.endDate).toBe(null);
      // expect(myPlan.searchCriteria.filter).toBe(filterOpts);
      expect(myPlan.searchCriteria.inventoryLocation).not.toBeDefined();
      expect(myPlan.searchCriteria.sortField).toBe(myPlan.defaultSort);
      expect(myPlan.searchCriteria.sortDescending).toBe(true);
    });

    it('should set searchCriteria filter to ALL if none is provided', inject(function(Floorplan) {
      myPlan.searchCriteria = null;
      myPlan.resetSearch();
      expect(myPlan.searchCriteria.filter).toBe(Floorplan.filterValues.ALL);
    }));

    // it('should set proposedSearchCriteria filter to initial filter if one is provided', function() {
    //   scope.proposedSearchCriteria = null;
    //   scope.resetSearch('bar');
    //   expect(scope.proposedSearchCriteria.filter).toBe('bar');
    // });

    it('should initiate a search', function() {
      spyOn(myPlan, 'search');
      myPlan.resetSearch();
      expect(myPlan.search).toHaveBeenCalled();
    });
  });
});
