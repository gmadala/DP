'use strict';

describe('Controller: ReceiptsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ReceiptsCtrl,
    scope,
    $q,
    receipts,
    user,
    searchResults, searchSpy;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, Receipts, User) {
    $q = _$q_;
    receipts = Receipts;
    user = User;

    searchResults = {
      Receipts: []
    };
    searchSpy = spyOn(Receipts, 'search').and.returnValue($q.when(searchResults));

    spyOn(user, 'getStatics').and.returnValue($q.when({
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
    }));

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
      spyOn(scope.receipts, 'search');
      scope.sortBy('fieldA');
      expect(scope.receipts.search).toHaveBeenCalled();
    });

    it('should set receipts.proposedSearchCriteria properties', function(){
      scope.sortBy('fieldA');
      expect(scope.sortField).toEqual(scope.receipts.proposedSearchCriteria.sortField);
      expect(scope.sortDescending).toEqual(scope.receipts.proposedSearchCriteria.sortDesc);

      scope.sortBy('fieldA');
      expect(scope.sortField).toEqual(scope.receipts.proposedSearchCriteria.sortField);
      expect(scope.sortDescending).toEqual(scope.receipts.proposedSearchCriteria.sortDesc);

      scope.sortBy('fieldB');
      expect(scope.sortField).toEqual(scope.receipts.proposedSearchCriteria.sortField);
      expect(scope.sortDescending).toEqual(scope.receipts.proposedSearchCriteria.sortDesc);
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
      var initialCallCount = searchSpy.callCount;
      scope.receipts.fetchNextResults();
      expect(searchSpy.callCount).toEqual(initialCallCount); //.not.toHaveBeenCalled()
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
      expect(receipts.search.calls.mostRecent().args[0]).toBe(scope.receipts.searchCriteria);
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
      expect(receipts.search.calls.mostRecent().args[1]).toBe(searchResults.$paginator);
    });

    it('should append new results to the results array', function () {

      // beforeEach runs Receipts.search() when controller is initialized.
      // This creates a promise which is run asynchronously.
      // This scope.$apply() forces that promise to finish, while
      // searchResults.Receipts == []. Otherwise, ['three', 'four']
      // will be pushed onto scope.receipts.results twice in this test
      scope.$apply();

      scope.receipts.results = ['one', 'two'];
      searchResults.Receipts = ['three', 'four'];
      scope.receipts.fetchNextResults();
      scope.$apply();
      expect(angular.equals(scope.receipts.results, ['one', 'two', 'three', 'four'])).toBe(true);
    });

  });

  describe('tooMany function', function() {
    it('should return true if the number of selected receipts exceeds the maximum', function() {
      scope.selectedReceipts = ['one', 'two', 'three', 'four','one', 'two', 'three', 'four','one', 'two', 'three', 'four','one', 'two', 'three', 'four','one', 'two', 'three', 'four', 'one'];
      expect(scope.tooMany()).toBe(true);
    });

    it('should return false if the number of selected receipts is less than the maximum', function() {
      scope.selectedReceipts = ['one', 'two', 'three', 'four'];
      expect(scope.tooMany()).toBe(false);
    });
  });

  describe('selectedReceipts', function() {
    var mockReceipt1,
      mockReceipt2;

    beforeEach(function() {
      mockReceipt1 = {
        TransactionNumber: 1234,
        FinancialTransactionId: 'id123'
      };
      mockReceipt2 = {
        TransactionNumber: 5678,
        FinancialTransactionId: 'id456'
      };
    });

    describe('toggleInQueue function', function() {
      beforeEach(function() {
        // spyOn(scope, 'isSelected');
        spyOn(scope, 'removeReceipt').and.callThrough();
      });

      it('should add a receipt to the list if it is not already on there', function() {
        expect(scope.selectedReceipts.length).toBe(0);
        scope.toggleInQueue(mockReceipt1);
        expect(scope.selectedReceipts[0]).toBe(mockReceipt1);
      });

      it('should remove a receipt from the list if it is already on there', function() {
        scope.toggleInQueue(mockReceipt1);
        expect(scope.selectedReceipts[0]).toBe(mockReceipt1);
        scope.toggleInQueue(mockReceipt1);
        expect(scope.removeReceipt).toHaveBeenCalled();
      });
    });

    describe('viewReceipt function (discover)', function() {
      it('should exist', function() {
        expect(scope.viewReceipt).toBeDefined();
      });

      it('should open a new tab with a pdf of the selected receipts', function() {
        var receipt = { transactionNumber: 1234, FinancialTransactionId: 5656 };

        spyOn(window, 'open');
        scope.viewReceipt(receipt);
        expect(window.open).toHaveBeenCalledWith('/receipt/viewMultiple/receipts?financialtransactionids=5656', '_blank');
      });
    });

    describe('viewReceipt function (ngen)', function() {
      it('should exist', function() {
        expect(scope.viewReceipt).toBeDefined();
      });

      it('should open a new tab with a pdf of the selected receipts', function() {
        var receipt = { transactionNumber: 1234, FinancialTransactionId: 5656 };
        scope.format = 'single';

        spyOn(window, 'open');
        scope.viewReceipt(receipt);
        expect(window.open).toHaveBeenCalledWith('/encodedReceipts?transactions=5656', '_blank');
      });
    });
  });

  describe('onExport function (discover)', function() {
    it('should do nothing if no receipts are selected', function() {
      spyOn(window, 'open').and.returnValue();
      scope.onExport();
      expect(window.open).not.toHaveBeenCalled();
    });

    it('should build a link based on the selected receipts and open it in a new window', function() {
      scope.selectedReceipts = [
        { transactionNumber: 1234, FinancialTransactionId: 5656 },
        { transactionNumber: 5678, FinancialTransactionId: 3434 },
        { transactionNumber: 910, FinancialTransactionId: 1212 }
      ];

      spyOn(window, 'open');
      scope.onExport();
      expect(window.open).toHaveBeenCalledWith('/receipt/viewMultiple/receipts?financialtransactionids=5656,3434,1212', '_blank');
    });
  });

  describe('onExport function (ngen)', function() {
    it('should do nothing if no receipts are selected', function() {
      spyOn(window, 'open').and.returnValue();
      scope.onExport();
      expect(window.open).not.toHaveBeenCalled();
    });

    it('should build a link based on the selected receipts and open it in a new window', function() {
      scope.format = 'single';
      scope.selectedReceipts = [
        { transactionNumber: 1234, FinancialTransactionId: 5656 },
        { transactionNumber: 5678, FinancialTransactionId: 3434 },
        { transactionNumber: 910, FinancialTransactionId: 1212 }
      ];

      spyOn(window, 'open');
      scope.onExport();
      expect(window.open).toHaveBeenCalledWith('/encodedReceipts?transactions=5656,3434,1212', '_blank');
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
      $controller('ReceiptsCtrl', {
        $scope: scope,
        $stateParams: { search: 'fooSearch' }
      });
      scope.$apply();

      expect(scope.receipts.searchCriteria.query).toBe('fooSearch');
      expect(receipts.search).toHaveBeenCalled();
      expect(receipts.search.calls.mostRecent().args[0].query).toBe('fooSearch');
    }));

});
