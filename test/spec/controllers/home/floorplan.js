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
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {
    scope = $rootScope.$new();
    stateParamsMock = {
      filter: 'fooFilter'
    };
    modelMock = {
      search: function () {
        return $q.resolved(searchResult.data);
      },
      filterValues: {
        ALL: 'allFilter'
      }
    };

    spyOn(modelMock, 'search').andCallThrough();

    FloorplanCtrl = $controller('FloorplanCtrl', {
      $scope: scope,
      $stateParams: stateParamsMock,
      Floorplan: modelMock
    });
  }));

  it('should attach a list of filter options to the scope', function () {
    expect(angular.isArray(scope.filterOptions)).toBe(true);
  });

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
    });

    it('should call for data with no paginator to start at beginning', function () {
      expect(modelMock.search).toHaveBeenCalledWith(scope.searchCriteria, null);
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
        }
      };

      scope.fetchNextResults();
      expect(modelMock.search.calls.length).toBe(originalCallCount);
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
      var p = null;
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

  it('should automatically kick off a search with the filter passed to the state', function () {
    expect(scope.searchCriteria.filter).toBe('fooFilter');
    expect(modelMock.search).toHaveBeenCalled();
  });

});
