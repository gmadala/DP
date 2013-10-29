'use strict';

describe('Controller: PaymentsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var PaymentsCtrl,
    stateParamsMock,
    modelMock,
    userMock,
    searchResult = {
      data: {}
    },
    canPayResult = {
      data: true
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
      },
      canPayNow: function () {
        return $q.when(true);
      },
      isPaymentOnQueue: function () {
        return false;
      }
    };
    userMock = {
      isLoggedIn: function(){ return true; }
    };
    spyOn(modelMock, 'search').andCallThrough();
    spyOn(modelMock, 'fetchFees').andCallThrough();

    PaymentsCtrl = $controller('PaymentsCtrl', {
      $scope: scope,
      $stateParams: stateParamsMock,
      Payments: modelMock,
      User: userMock
    });
  }));

  it('should attach the isPaymentOnQueue function to the scope', function () {
    expect(scope.isPaymentOnQueue).toBe(modelMock.isPaymentOnQueue);
  });

  it('should attach a getDueStatus function to the scope', function () {
    expect(typeof scope.getDueStatus).toBe('function');
  });

  describe('getDueStatus function', function () {

    var clock;

    beforeEach(function () {
      // mock the system clock so we have a predictable current date & time for testing
      // see http://sinonjs.org/docs/#clock
      clock = sinon.useFakeTimers(moment([2013, 0, 1, 11, 15]).valueOf(), 'Date');
    });

    afterEach(function () {
      clock.restore();
    });

    it('should return overdue for past due dates', function () {
      var result = scope.getDueStatus({DueDate: '2012-12-31'});
      expect(result).toBe('overdue');
    });

    it('should return today for same-day due dates', function () {
      var result = scope.getDueStatus({DueDate: '2013-01-01'});
      expect(result).toBe('today');
    });

    it('should return future for future due dates', function () {
      var result = scope.getDueStatus({DueDate: '2013-01-02'});
      expect(result).toBe('future');
    });

  });

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
      expect(scope.payments.hitInfiniteScrollMax).toBe(false);
    });

    it('should commit the proposedSearchCriteria (as a copy)', function () {
      scope.payments.proposedSearchCriteria = {
        query: 'foo',
        startDate: new Date(2013, 4, 4),
        endDate: new Date(),
        filter: 'something'
      };
      scope.payments.search();
      expect(angular.equals(scope.payments.proposedSearchCriteria, scope.payments.searchCriteria)).toBe(true);
      expect(scope.payments.searchCriteria).not.toBe(scope.payments.proposedSearchCriteria);

      scope.payments.proposedSearchCriteria.startDate.setDate(5);
      expect(scope.payments.searchCriteria.startDate.getDate()).toBe(4);
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
        },
        hitMaximumLimit: function() {
          return true;
        }
      };

      scope.payments.fetchNextResults();
      expect(modelMock.search.calls.length).toBe(originalCallCount);
      expect(scope.payments.hitInfiniteScrollMax).toBe(true);
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

  describe('resetSearch function', function () {

    it('should set proposedSearchCriteria with empty search defaults', function () {
      scope.payments.proposedSearchCriteria = null;
      scope.payments.resetSearch();
      expect(scope.payments.proposedSearchCriteria.query).toBe(null);
      expect(scope.payments.proposedSearchCriteria.startDate).toBe(null);
      expect(scope.payments.proposedSearchCriteria.endDate).toBe(null);
    });

    it('should set proposedSearchCriteria filter to ALL if none is provided', function () {
      scope.payments.proposedSearchCriteria = null;
      scope.payments.resetSearch();
      expect(scope.payments.proposedSearchCriteria.filter).toBe(modelMock.filterValues.ALL);
    });

    it('should set proposedSearchCriteria filter to initial filter if one is provided', function () {
      scope.payments.proposedSearchCriteria = null;
      scope.payments.resetSearch('bar');
      expect(scope.payments.proposedSearchCriteria.filter).toBe('bar');
    });

    it('should initiate a search', function () {
      spyOn(scope.payments, 'search');
      scope.payments.resetSearch();
      expect(scope.payments.search).toHaveBeenCalled();
    });

  });

  it('should automatically kick off a search with the filter passed to the state', function () {
    expect(scope.payments.searchCriteria.filter).toBe('fooFilter');
    expect(modelMock.search).toHaveBeenCalled();
  });

  describe('fees retrieval logic', function () {

    it('should attach a fees model to the scope', function () {
      expect(scope.fees).toBeDefined();
      expect(typeof scope.fees.loading).toBe('boolean');
      expect(angular.isArray(scope.fees.results)).toBe(true);
    });

    it('should auto request fees and set loading to true', function () {
      expect(modelMock.fetchFees).toHaveBeenCalled();
      expect(scope.fees.loading).toBe(true);
    });

    it('should set loading to false and attach results to the scope on success', function () {
      scope.$apply();
      expect(scope.fees.loading).toBe(false);
      expect(scope.fees.results).toBe(searchResult.data);
    });

    it('should set loading to false on error', inject(function ($q, $rootScope) {
      searchResult.data.then = function(callback, errback) {
        var result = $q.defer();
        $rootScope.$evalAsync(function() {
          result.resolve(errback('oops'));
        });
        return result.promise;
      };
      scope.$apply();
      expect(scope.fees.loading).toBe(false);
      expect(scope.fees.results.length).toBe(0);
    }));

  });

  it('should attach a value for canPayNow to the scope', function () {
    scope.$apply();
    expect(scope.canPayNow).toBe(true);
  });

});
