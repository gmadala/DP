'use strict';

describe('Controller: PaymentsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var PaymentsCtrl,
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
        return $q.when(searchResult.data);
      },
      filterValues: {
        ALL: 'all'
      },
      fetchFees: function () {
        return $q.when(searchResult.data);
      }
    };

    spyOn(modelMock, 'search').andCallThrough();
    spyOn(modelMock, 'fetchFees').andCallThrough();

    PaymentsCtrl = $controller('PaymentsCtrl', {
      $scope: scope,
      $stateParams: stateParamsMock,
      Payments: modelMock
    });
  }));

  it('should attach a payments view model to the scope', function () {
    expect(scope.payments).toBeDefined();
    expect(angular.isArray(scope.payments.results)).toBe(true);
    expect(typeof scope.payments.loading).toBe('boolean');
  });

  it('should attach a list of payment filter options to the payments view model', function () {
    expect(angular.isArray(scope.payments.filterOptions)).toBe(true);
  });

  it('should attach a payments search function to the scope', function () {
    expect(typeof scope.payments.search).toBe('function');
  });

  describe('payments search function', function () {

    it('should clear any prior results', function () {
      scope.payments.results = ['foo', 'bar'];
      scope.payments.search();
      expect(scope.payments.results.length).toBe(0);
    });

    it('should call for data with no paginator to start at beginning', function () {
      expect(modelMock.search).toHaveBeenCalledWith(scope.payments.searchCriteria, null);
    });

  });

  it('should attach a fetchNextResults function to the scope', function () {
    expect(typeof scope.payments.fetchNextResults).toBe('function');
  });

  describe('fetchNextResults function', function () {

    it('should not call for data if the paginator indicates it is already at the end', function () {
      var originalCallCount = modelMock.search.calls.length;

      scope.payments.paginator = {
        hasMore: function () {
          return false;
        }
      };

      scope.payments.fetchNextResults();
      expect(modelMock.search.calls.length).toBe(originalCallCount);
    });

    it('should set loading to true while waiting for results', function () {
      scope.payments.fetchNextResults();
      expect(scope.payments.loading).toBe(true);
    });

    it('should set loading to false on success', function () {
      scope.payments.fetchNextResults();
      scope.$apply();
      expect(scope.payments.loading).toBe(false);
    });

    it('should set loading to false on error', inject(function ($q) {
      searchResult.data = $q.reject('oops!');
      scope.payments.fetchNextResults();
      scope.$apply();
      expect(scope.payments.loading).toBe(false);
    }));

    it('should pass back the paginator from previous calls on subsequent ones', function () {
      var p = {
        hasMore: function () {
          return true;
        }
      };
      searchResult.data = {
        $paginator: p
      };
      scope.payments.fetchNextResults();
      scope.$apply();
      scope.payments.fetchNextResults();
      expect(modelMock.search.mostRecentCall.args[1]).toBe(p);
    });

    it('should append new results to the results array', function () {
      scope.payments.results = ['one', 'two'];
      searchResult.data = {
        SearchResults: ['three', 'four']
      };
      scope.payments.fetchNextResults();
      scope.$apply();
      expect(angular.equals(scope.payments.results, ['one', 'two', 'three', 'four'])).toBe(true);
    });

  });

  it('should attach a resetSearch function to the scope', function () {
    expect(typeof scope.payments.resetSearch).toBe('function');
  });

  it('should automatically kick off a search with the filter passed to the state', function () {
    expect(scope.payments.searchCriteria.filter).toBe('fooFilter');
    expect(modelMock.search).toHaveBeenCalled();
  });

  it('should request fees and attach a promise of the results to the scope', function () {
    expect(modelMock.fetchFees).toHaveBeenCalled();
    var out = null;
    scope.fees.then(function (results) {
      out = results;
    });
    scope.$apply();
    expect(out).toBe(searchResult.data);
  });

});
