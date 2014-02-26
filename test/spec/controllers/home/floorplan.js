'use strict';

describe('Controller: FloorplanCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorplanCtrl,
    stateParamsMock,
    modelMock,
    searchResult = {
      data: {}
    },
    scope,
    initController,
    httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, Floorplan, $httpBackend) {
    scope = $rootScope.$new();
    stateParamsMock = {
      filter: 'fooFilter'
    };
    modelMock = {
      search: function () {
        return $q.when(searchResult.data);
      },
      filterValues: Floorplan.filterValues,
      sellerHasTitle: Floorplan.sellerHasTitle
    };
    httpBackend = $httpBackend;

    spyOn(modelMock, 'search').andCallThrough();

    initController = function () {
      FloorplanCtrl = $controller('FloorplanCtrl', {
        $scope: scope,
        $stateParams: stateParamsMock,
        Floorplan: modelMock
      });
    };

  }));

  // shared tests that need to be run for both dealer and auction mode
  var registerCommonTests = function () {

    it('should attach a getVehicleDescription function to the scope that concatenates vehicle info', function () {
      expect(typeof scope.getVehicleDescription).toBe('function');
      var floorplan = {
        UnitMake: 'Ford',
        UnitModel: 'Pinto',
        UnitYear: 1970,
        UnitStyle: 'Turbo',
        Color: 'Green'
      };
      expect(scope.getVehicleDescription(floorplan)).toBe('1970 Ford Pinto Turbo Green');
    });

    it('should attach a data object to the scope with expected properties', function () {
      expect(scope.data).toBeDefined();
      expect(angular.isArray(scope.data.results)).toBe(true);
      expect(typeof scope.data.loading).toBe('boolean');
    });

    it('should attach a search function to the scope', function () {
      expect(typeof scope.search).toBe('function');
    });

    describe('search function', function () {

      it('should clear any prior results', function () {
        scope.data.results = ['foo', 'bar'];
        scope.search();
        expect(scope.data.results.length).toBe(0);
        expect(scope.data.hitInfiniteScrollMax).toBe(false);
      });

      it('should commit the proposedSearchCriteria (as a copy)', function () {
        scope.proposedSearchCriteria = {
          query: 'foo',
          startDate: new Date(2013, 4, 4),
          endDate: new Date(),
          filter: 'something'
        };
        scope.search();
        expect(angular.equals(scope.proposedSearchCriteria, scope.searchCriteria)).toBe(true);
        expect(scope.searchCriteria).not.toBe(scope.proposedSearchCriteria);

        scope.proposedSearchCriteria.startDate.setDate(5);
        expect(scope.searchCriteria.startDate.getDate()).toBe(4);
      });

      it('should call for data with no paginator to start at beginning', function () {
        expect(modelMock.search).toHaveBeenCalledWith(scope.searchCriteria, null);
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
        expect(scope.sortField).toEqual(scope.proposedSearchCriteria.sortField);
        expect(scope.sortDescending).toEqual(scope.proposedSearchCriteria.sortDesc);

        scope.sortBy('fieldA');
        expect(scope.sortField).toEqual(scope.proposedSearchCriteria.sortField);
        expect(scope.sortDescending).toEqual(scope.proposedSearchCriteria.sortDesc);

        scope.sortBy('fieldB');
        expect(scope.sortField).toEqual(scope.proposedSearchCriteria.sortField);
        expect(scope.sortDescending).toEqual(scope.proposedSearchCriteria.sortDesc);
      });

    });

    it('should attach a fetchNextResults function to the scope', function () {
      expect(typeof scope.fetchNextResults).toBe('function');
    });


    describe('fetchNextResults function', function () {

      it('should not call for data if the paginator indicates it is already at the end', function () {
        var originalCallCount = modelMock.search.calls.length;

        scope.data.paginator = {
          hasMore: function () {
            return false;
          },
          hitMaximumLimit: function() {
            return true;
          }
        };

        scope.fetchNextResults();
        expect(modelMock.search.calls.length).toBe(originalCallCount);
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
        expect(modelMock.search.mostRecentCall.args[1]).toBe(p);
      });

      it('should append new results to the results array', function () {
        scope.data.results = ['one', 'two'];
        searchResult.data = {
          Floorplans: ['three', 'four']
        };
        scope.fetchNextResults();
        scope.$apply();
        expect(angular.equals(scope.data.results, ['one', 'two', 'three', 'four'])).toBe(true);
      });

    });

    it('should attach a resetSearch function to the scope', function () {
      expect(typeof scope.resetSearch).toBe('function');
    });

    describe('resetSearch function', function () {

      it('should set proposedSearchCriteria with empty search defaults', function () {
        scope.proposedSearchCriteria = null;
        scope.resetSearch();
        expect(scope.proposedSearchCriteria.query).toBe(null);
        expect(scope.proposedSearchCriteria.startDate).toBe(null);
        expect(scope.proposedSearchCriteria.endDate).toBe(null);
      });

      it('should set proposedSearchCriteria filter to ALL if none is provided', function () {
        scope.proposedSearchCriteria = null;
        scope.resetSearch();
        expect(scope.proposedSearchCriteria.filter).toBe(modelMock.filterValues.ALL);
      });

      it('should set proposedSearchCriteria filter to initial filter if one is provided', function () {
        scope.proposedSearchCriteria = null;
        scope.resetSearch('bar');
        expect(scope.proposedSearchCriteria.filter).toBe('bar');
      });

      it('should initiate a search', function () {
        spyOn(scope, 'search');
        scope.resetSearch();
        expect(scope.search).toHaveBeenCalled();
      });

    });

    describe('sellerHasTitle function', function() {
      var fl = {
        TitleLocation: 'Buyer',
        FloorplanId: 1234
      };

      beforeEach(function() {
        spyOn(modelMock, 'sellerHasTitle').andCallThrough();

        httpBackend.expectPOST('/floorplan/SellerHasTitle')
          .respond({
            Success: true,
            Message: null,
            Data: []
          });

        spyOn(angular, 'element').andReturn({
          scope: function() {
            return { tt_isOpen: '' };
          }
        });
      });

      it('set title location to Seller if they have the title', function() {
        scope.sellerHasTitle(fl, true);
        httpBackend.flush();
        expect(modelMock.sellerHasTitle).toHaveBeenCalled();
        expect(fl.TitleLocation).toBe('Seller');
      });

      it('set title location to Title Absent if seller does not have the title', function() {
        scope.sellerHasTitle(fl, false);
        httpBackend.flush();
        expect(modelMock.sellerHasTitle).toHaveBeenCalled();
        expect(fl.TitleLocation).toBe('Title Absent');
      });
    });

    it('should automatically kick off a search with the filter passed to the state', function () {
      expect(scope.searchCriteria.filter).toBe('fooFilter');
      expect(modelMock.search).toHaveBeenCalled();
    });

  };

  describe('(in dealer mode)', function () {

    var floorplan;

    beforeEach(inject(function (User, Floorplan) {
      spyOn(User, 'isDealer').andReturn(true);
      floorplan = Floorplan;
      initController();
    }));

    registerCommonTests();

    it('should attach the dealer list of filter options to the scope', function () {
      expect(angular.isArray(scope.filterOptions)).toBe(true);

      expect(scope.filterOptions[0].label).toBe('View All');
      expect(scope.filterOptions[0].value).toBe(floorplan.filterValues.ALL);

      expect(scope.filterOptions[1].label).toBe('Pending');
      expect(scope.filterOptions[1].value).toBe(floorplan.filterValues.PENDING);

      expect(scope.filterOptions[2].label).toBe('Denied');
      expect(scope.filterOptions[2].value).toBe(floorplan.filterValues.DENIED);

      expect(scope.filterOptions[3].label).toBe('Approved');
      expect(scope.filterOptions[3].value).toBe(floorplan.filterValues.APPROVED);

      expect(scope.filterOptions[4].label).toBe('Completed');
      expect(scope.filterOptions[4].value).toBe(floorplan.filterValues.COMPLETED);
    });

  });

  describe('(in auction seller floorplan mode)', function () {

    var floorplan;

    beforeEach(inject(function (User, Floorplan) {
      spyOn(User, 'isDealer').andReturn(false);
      floorplan = Floorplan;
      initController();
    }));

    registerCommonTests();

    it('should attach the auction list of filter options to the scope', function () {
      expect(angular.isArray(scope.filterOptions)).toBe(true);

      expect(scope.filterOptions[0].label).toBe('View All');
      expect(scope.filterOptions[0].value).toBe(floorplan.filterValues.ALL);

      expect(scope.filterOptions[1].label).toBe('Pending/Not Paid');
      expect(scope.filterOptions[1].value).toBe(floorplan.filterValues.PENDING_NOT_PAID);

      expect(scope.filterOptions[2].label).toBe('Denied/Not Paid');
      expect(scope.filterOptions[2].value).toBe(floorplan.filterValues.DENIED_NOT_PAID);

      expect(scope.filterOptions[3].label).toBe('Approved/Paid');
      expect(scope.filterOptions[3].value).toBe(floorplan.filterValues.APPROVED_PAID);

      expect(scope.filterOptions[4].label).toBe('Approved/Not Paid');
      expect(scope.filterOptions[4].value).toBe(floorplan.filterValues.APPROVED_NOT_PAID);

      expect(scope.filterOptions[5].label).toBe('Completed/Paid');
      expect(scope.filterOptions[5].value).toBe(floorplan.filterValues.COMPLETED_PAID);

      expect(scope.filterOptions[6].label).toBe('Completed/Not Paid');
      expect(scope.filterOptions[6].value).toBe(floorplan.filterValues.COMPLETED_NOT_PAID);
    });

  });

});
