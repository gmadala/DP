'use strict';

describe('Controller: AuctionDealerSearchCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AuctionDealerSearchCtrl,
    scope,
    $uibModal,
    dealerSearch,
    searchResult,
    User,
    UserInfo,
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$uibModal_, _dealerSearch_, _$q_) {
    $q = _$q_;
    $uibModal = _$uibModal_;
    searchResult = {
      data: {
        $paginator: {
          hasMore: function () { return true; }
        },
        SearchResults: []
      }
    };

    UserInfo = {
      BusinessId: 16088
    };

    User = {
      getInfo: function() {
        return $q.when(UserInfo);
      }
    };

    dealerSearch = _dealerSearch_;
    spyOn(dealerSearch, 'search').and.returnValue($q.when(searchResult.data));

    scope = $rootScope.$new();
    AuctionDealerSearchCtrl = $controller('AuctionDealerSearchCtrl', {
      $scope: scope,
      $uibModel: $uibModal,
      User: User
    });
    scope.$apply();
  }));

  it('should attach a data model object to the scope with expected defaults', function () {
    var expected = {
      query: null,
      results: [],
      loading: false,
      paginator: null,
      auction: 16088,
      sortBy: 'BusinessName',
      sortDescending: false,
      hitInfiniteScrollMax: false
    };
    expect(scope.data).toEqual(expected);
  });

  describe('search function', function () {

    it('should clear any prior results', function () {
      scope.data.results = ['foo', 'bar'];
      scope.data.proposedQuery = 'foo';
      scope.search();
      expect(scope.data.results.length).toBe(0);
    });

    it('should commit proposedQuery to query', function () {
      scope.proposedQuery = 'foo';
      scope.search();
      expect(scope.data.query).toBe('foo');
    });

    it('should call for data with no paginator to start at beginning, if query is present', function () {
      scope.search();
      expect(dealerSearch.search).toHaveBeenCalled();
      expect(dealerSearch.search.calls.mostRecent().args[4]).toBe(null);
    });

    it('should not call for data if query is invalid', function () {
      dealerSearch.search.calls.reset();
      scope.dealerSearchForm = {
        $invalid: true
      };
      scope.search();
      expect(dealerSearch.search).not.toHaveBeenCalled();
    });

    it('should only run search if input is valid', function() {
      scope.dealerSearchForm = {
        $invalid: false
      };

      scope.data.proposedQuery = 'abc';
      scope.search();
      expect(dealerSearch.search).toHaveBeenCalled();
    });

    it('should not run search if input is not valid, and should clear previous results', function() {
      dealerSearch.search.calls.reset();
      scope.dealerSearchForm = {
        $invalid: true
      };
      scope.data = {
        results: {
          length: 13
        }
      };

      expect(dealerSearch.search).not.toHaveBeenCalled();
      scope.data.proposedQuery = 'ab';
      scope.search();
      expect(dealerSearch.search).not.toHaveBeenCalled();
      expect(scope.data.results.length).toBe(0);
    });

  });

  describe('fetchNextResults function', function () {

    it('should not call for data if the paginator indicates it is already at the end', function () {
      var originalCallCount = dealerSearch.search.calls.length;

      scope.data.paginator = {
        hasMore: function () {
          return false;
        },
        hitMaximumLimit: function() {
          return true;
        }
      };

      scope.fetchNextResults();
      expect(dealerSearch.search.calls.length).toBe(originalCallCount);
      expect(scope.data.hitInfiniteScrollMax).toBe(true);
    });

    it('should call the search method with the expected parameters', function () {
      scope.data = {
        query: 'xyz',
        results: [],
        loading: false,
        auction: 16088,
        paginator: null,
        sortBy: 'SomeCrazyField',
        sortDescending: true
      };
      scope.fetchNextResults();
      expect(dealerSearch.search).toHaveBeenCalledWith('xyz', 16088, 'SomeCrazyField', true, null);
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
      expect(dealerSearch.search.calls.mostRecent().args[4]).toBe(p);
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

  });
});
