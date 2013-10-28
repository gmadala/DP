'use strict';

describe('Controller: ReceiptsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ReceiptsCtrl,
    scope,
    $q,
    receipts,
    user,
    searchResults;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, Receipts, User) {
    $q = _$q_;
    receipts = Receipts;
    user = User;

    searchResults = {
      Receipts: []
    };

    spyOn(Receipts, 'search').andReturn($q.when(searchResults));

    scope = $rootScope.$new();
    ReceiptsCtrl = $controller('ReceiptsCtrl', {
      $scope: scope
    });
  }));

  describe('getReceiptStatus function', function () {

    it('should return nsf if nsf flag is set', function () {
      var receipt = {
        IsNsf: true,
        IsVoided: true
      };
      var result = scope.getReceiptStatus(receipt);
      expect(result).toBe('nsf');
    });

    it('should return void if voided flag is set', function () {
      var receipt = {
        IsNsf: false,
        IsVoided: true
      };
      var result = scope.getReceiptStatus(receipt);
      expect(result).toBe('void');
    });

    it('should return normal otherwise', function () {
      var receipt = {
        IsNsf: false,
        IsVoided: false
      };
      var result = scope.getReceiptStatus(receipt);
      expect(result).toBe('normal');
    });

  });

  describe('filterOptions', function () {

    it('should default to an empty list', function () {
      expect(angular.isArray(scope.filterOptions)).toBe(true);
      expect(scope.filterOptions.length).toBe(0);
    });

    it('should populate with payment methods from the User static model, plus an "all" option', function () {
      spyOn(user, 'getStatics').andReturn({
        paymentMethods: [
          {
            PaymentMethodName: 'Foo',
            PaymentMethodId: 'fooId'
          },
          {
            PaymentMethodName: 'Bar',
            PaymentMethodId: 'barId'
          }
        ]
      });
      scope.$apply();
      expect(scope.filterOptions.length).toBe(3);
      expect(scope.filterOptions[0].label).toBe('View All');
      expect(scope.filterOptions[0].value).toBe('fooId,barId');
      expect(scope.filterOptions[1].label).toBe('Foo');
      expect(scope.filterOptions[1].value).toBe('fooId');
    });

  });

  it('should attach a receipts view model to the scope', function () {
    expect(scope.receipts).toBeDefined();
    expect(angular.isArray(scope.receipts.results)).toBe(true);
    expect(typeof scope.receipts.loading).toBe('boolean');
  });

  describe('search function', function () {

    it('should clear any prior results', function () {
      scope.receipts.results = ['foo', 'bar'];
      scope.receipts.search();
      expect(scope.receipts.results.length).toBe(0);
      expect(scope.receipts.hitInfiniteScrollMax).toBe(false);
    });

    it('should commit the proposedSearchCriteria (as a copy)', function () {
      scope.receipts.proposedSearchCriteria = {
        query: 'foo',
        startDate: new Date(2013, 4, 4),
        endDate: new Date(),
        filter: 'something'
      };
      scope.receipts.search();
      expect(angular.equals(scope.receipts.proposedSearchCriteria, scope.receipts.searchCriteria)).toBe(true);
      expect(scope.receipts.searchCriteria).not.toBe(scope.receipts.proposedSearchCriteria);

      scope.receipts.proposedSearchCriteria.startDate.setDate(5);
      expect(scope.receipts.searchCriteria.startDate.getDate()).toBe(4);
    });

    it('should call for data with no paginator to start at beginning', function () {
      scope.receipts.search();
      expect(receipts.search).toHaveBeenCalledWith(scope.receipts.searchCriteria, null);
    });

  });

  describe('fetchNextResults function', function () {

    it('should not call for data if the paginator indicates it is already at the end', function () {
      scope.receipts.paginator = {
        hasMore: function () {
          return false;
        },
        hitMaximumLimit: function() {
          return true;
        }
      };

      scope.receipts.fetchNextResults();
      expect(receipts.search).not.toHaveBeenCalled();
      expect(scope.receipts.hitInfiniteScrollMax).toBe(true);
    });

    it('should set loading to true while waiting for results', function () {
      scope.receipts.fetchNextResults();
      expect(scope.receipts.loading).toBe(true);
    });

    it('should set loading to false on success', function () {
      scope.receipts.fetchNextResults();
      scope.$apply();
      expect(scope.receipts.loading).toBe(false);
    });

    it('should set loading to false on error', function () {
      searchResults = $q.reject('oops!');
      scope.receipts.fetchNextResults();
      scope.$apply();
      expect(scope.receipts.loading).toBe(false);
    });

    it('should pass the current search criteria', function () {
      scope.receipts.fetchNextResults();
      expect(receipts.search.mostRecentCall.args[0]).toBe(scope.receipts.searchCriteria);
    });

    it('should pass back the paginator from previous calls on subsequent ones', function () {
      searchResults.$paginator = {
        hasMore: function () {
          return true;
        }
      };
      scope.receipts.fetchNextResults();
      scope.$apply();
      scope.receipts.fetchNextResults();
      expect(receipts.search.mostRecentCall.args[1]).toBe(searchResults.$paginator);
    });

    it('should append new results to the results array', function () {
      scope.receipts.results = ['one', 'two'];
      searchResults.Receipts = ['three', 'four'];
      scope.receipts.fetchNextResults();
      scope.$apply();
      expect(angular.equals(scope.receipts.results, ['one', 'two', 'three', 'four'])).toBe(true);
    });

  });

  describe('resetSearch function', function () {

    it('should set up a receipts proposedSearchCriteria object on the scope', function () {
      scope.receipts.resetSearch();
      expect(scope.receipts.proposedSearchCriteria).toBeDefined();
    });

    it('should set query, startDate and endDate to null', function () {
      scope.receipts.resetSearch();
      expect(scope.receipts.proposedSearchCriteria.query).toBe(null);
      expect(scope.receipts.proposedSearchCriteria.startDate).toBe(null);
      expect(scope.receipts.proposedSearchCriteria.endDate).toBe(null);
    });

    it('should set filter to null if no filters are available', function () {
      scope.receipts.resetSearch();
      expect(scope.receipts.proposedSearchCriteria.filter).toBe(null);
    });

    it('should set filter to first item value if filters are available', function () {
      scope.filterOptions = [
        {
          label: 'Foo',
          value: 'foo'
        },
        {
          label: 'Bar',
          value: 'bar'
        }
      ];
      scope.receipts.resetSearch();
      expect(scope.receipts.proposedSearchCriteria.filter).toBe('foo');
    });

    it('should trigger a search', function () {
      spyOn(scope.receipts, 'search');
      scope.receipts.resetSearch();
      expect(scope.receipts.search).toHaveBeenCalled();
    });

  });

  it('should automatically kick off a search with the query passed to the state, once filters are ready',
    inject(function ($controller) {

      spyOn(user, 'getStatics').andReturn({
        paymentMethods: [
          {
            Name: 'Foo',
            Id: 'fooId'
          },
          {
            Name: 'Bar',
            Id: 'barId'
          }
        ]
      });

      $controller('ReceiptsCtrl', {
        $scope: scope,
        $stateParams: { search: 'fooSearch' }
      });
      scope.$apply();

      expect(scope.receipts.searchCriteria.query).toBe('fooSearch');
      expect(receipts.search).toHaveBeenCalled();
      expect(receipts.search.mostRecentCall.args[0].query).toBe('fooSearch');
  }));

});
