'use strict';

describe('Controller: BusinessSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var BusinessSearchCtrl,
    scope,
    model,
    searchResult,
    dialog,
    closeNow;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, BusinessSearch, $q) {

    searchResult = {
      data: {
        $paginator: {
          hasMore: function () { return true; }
        },
        SearchResults: []
      }
    };

    model = BusinessSearch;
    spyOn(model, 'search').and.returnValue($q.when(searchResult.data));

    dialog = {
      close: angular.noop
    };

    var closeNowFunction = function() {
      return closeNow;
    }

    scope = $rootScope.$new();
    BusinessSearchCtrl = $controller('BusinessSearchCtrl', {
      $scope: scope,
      $uibModalInstance: dialog,
      initialQuery: 'x',
      searchBuyersMode: false,
      closeNow: closeNowFunction
    });
  }));

  it('should attach a data model object to the scope with expected defaults', function () {
    var expected = {
      searchBuyersMode: false,
      proposedQuery: 'x',
      query: 'x',
      results: [],
      loading: true, // a load is started automatically
      paginator: null,
      sortBy: 'BusinessName',
      sortDescending: false,
      hitInfiniteScrollMax: false
    };

    expect(angular.equals(scope.data, expected)).toBe(true);
  });

  describe('search function', function () {

    it('should clear any prior results', function () {
      scope.data.results = ['foo', 'bar'];
      scope.data.proposedQuery = 'foo';
      scope.search();
      expect(scope.data.results.length).toBe(0);
    });

    it('should commit proposedQuery to query', function () {
      scope.data.proposedQuery = 'foo';
      scope.search();
      expect(scope.data.query).toBe('foo');
    });

    it('should call for data with no paginator to start at beginning, if query is present', function () {
      scope.search();
      expect(model.search).toHaveBeenCalled();
      expect(model.search.calls.mostRecent().args[4]).toBe(null);
    });

    it('should not call for data if no query is present', function () {
      model.search.calls.reset();
      scope.data.proposedQuery = '';
      scope.search();
      expect(model.search).not.toHaveBeenCalled();
    });

    it('should only run search if input is valid', function() {
      scope.searchControls = {
        $invalid: false
      };

      scope.data.proposedQuery = 'abc';
      scope.search();
      expect(model.search).toHaveBeenCalled();
    });

    it('should not run search if input is not valid, and should clear previous results', function() {
      model.search.calls.reset(); // clears previous spyOn calls since one is done on controller initialization
      spyOn(scope, 'fetch');
      scope.searchControls = {
        $invalid: true
      };
      scope.data = {
        results: {
          length: 13
        }
      };

      expect(model.search).not.toHaveBeenCalled();
      scope.data.proposedQuery = 'ab';
      scope.search();
      expect(scope.fetch).not.toHaveBeenCalled();
      expect(model.search).not.toHaveBeenCalled();
      expect(scope.data.results.length).toBe(0);
    });

  });

  describe('fetchNextResults function', function () {

    it('should not call for data if the paginator indicates it is already at the end', function () {
      var originalCallCount = model.search.calls.length;

      scope.data.paginator = {
        hasMore: function () {
          return false;
        },
        hitMaximumLimit: function() {
          return true;
        }
      };

      scope.fetchNextResults();
      expect(model.search.calls.length).toBe(originalCallCount);
      expect(scope.data.hitInfiniteScrollMax).toBe(true);
    });

    it('should call the search method with the expected parameters', function () {
      scope.data = {
        searchBuyersMode: true,
        query: 'xyz',
        results: [],
        loading: false,
        paginator: null,
        sortBy: 'SomeCrazyField',
        sortDescending: true
      };
      scope.fetchNextResults();
      expect(model.search).toHaveBeenCalledWith(true, 'xyz', 'SomeCrazyField', true, null);
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
        }
      };
      searchResult.data.$paginator = p;
      scope.fetchNextResults();
      scope.$apply();
      scope.fetchNextResults();
      expect(model.search.calls.mostRecent().args[4]).toBe(p);
    });

    it('should append new results to the results array', function () {
      scope.$apply(); // flush initial load promise
      scope.data.results = ['one', 'two'];
      searchResult.data.SearchResults = ['three', 'four'];
      scope.fetchNextResults();
      scope.$apply();
      expect(angular.equals(scope.data.results, ['one', 'two', 'three', 'four'])).toBe(true);
    });

  });

  describe('sortBy function', function () {

    it('should set the sortBy field and default to ascending if non-current-sort field is passed', function () {
      scope.data.sortDescending = true;
      scope.data.sortBy = 'bar';
      scope.sortBy('foo');
      expect(scope.data.sortBy).toBe('foo');
      expect(scope.data.sortDescending).toBe(false);
    });

    it('should just toggle the direction if current-sort field is passed', function () {
      scope.data.sortDescending = true;
      scope.data.sortBy = 'bar';

      scope.sortBy('bar');
      expect(scope.data.sortBy).toBe('bar');
      expect(scope.data.sortDescending).toBe(false);

      scope.sortBy('bar');
      expect(scope.data.sortBy).toBe('bar');
      expect(scope.data.sortDescending).toBe(true);
    });

    it('should restart the search', function () {
      spyOn(scope, 'fetch');
      scope.sortBy('foo');
      expect(scope.fetch).toHaveBeenCalled();
    });

  });

  it('should have a close function that closes the dialog', function () {
    spyOn(dialog, 'close');
    scope.close();
    expect(dialog.close).toHaveBeenCalledWith();
  });

  it('should have a select function that closes the dialog with the passed item', function () {
    var item = {}
    spyOn(dialog, 'close');
    scope.select(item);
    expect(dialog.close).toHaveBeenCalledWith(item);
  });

  it('should kick off a search', function () {
    expect(model.search).toHaveBeenCalled();
  });

});
