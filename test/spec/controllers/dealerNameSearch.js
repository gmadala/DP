'use strict';

describe('Controller: DealerNameSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var DealerNameSearchCtrl,
    scope,
    model,
    searchResult,
    dialog;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, DealerNameSearch, User, $q) {

    searchResult = {
      data: {
        $paginator: {
          hasMore: function () { return true; }
        },
        SearchResults: []
      }
    };

    model = DealerNameSearch;
    spyOn(model, 'search').andReturn($q.when(searchResult.data));

    spyOn(User, 'getStatics').andReturn($q.when({
      states: ['fooState']
    }));

    dialog = {
      close: angular.noop
    };

    scope = $rootScope.$new();
    DealerNameSearchCtrl = $controller('DealerNameSearchCtrl', {
      $scope: scope,
      dialog: dialog,
      options: {
        dealerName: 'foo',
        city: 'footown',
        state: null
      }
    });
  }));

  it('should attach a proposed query data model object to the scope with expected properties', function () {
    expect(scope.proposedQuery).toBeDefined();
    expect(scope.proposedQuery.name).toBeDefined();
    expect(scope.proposedQuery.city).toBeDefined();
    expect(scope.proposedQuery.state).toBeDefined();
  });

  it('should attach a data model object to the scope with expected defaults', function () {
    var expected = {
      query: {
        name: 'foo',
        city: 'footown',
        state: null
      },
      results: [],
      loading: true, // a load is started automatically
      paginator: null,
      sortBy: 'BusinessName',
      sortDescending: false,
      hitInfiniteScrollMax: false
    };

    expect(angular.equals(scope.data, expected)).toBe(true);
  });

  describe('isQueryValid function', function () {

    it('should return false if the query is missing dealer name', function () {
      var result = scope.isQueryValid({
        name: '',
        city: 'Denver',
        state: 'CO'
      });
      expect(result).toBe(false);
    });

    it('should return false if the query has neither city nor state', function () {
      var result = scope.isQueryValid({
        name: 'Foo Autos',
        city: '',
        state: ''
      });
      expect(result).toBe(false);
    });

    it('should return true if the query has dealer name, and either city or state', function () {
      var result = scope.isQueryValid({
        name: 'Foo Autos',
        city: '',
        state: 'CA'
      });
      expect(result).toBe(true);
    });

  });

  describe('search function', function () {

    it('should clear any prior results', function () {
      scope.data.results = ['foo', 'bar'];
      scope.search();
      expect(scope.data.results.length).toBe(0);
    });

    it('should commit proposedQuery to query', function () {
      scope.data.proposedQuery = {
        dealerName: 'bar',
        city: 'bartown',
        state: 'BA'
      };
      scope.search();
      expect(angular.equals(scope.data.query, scope.proposedQuery)).toBe(true);
    });

    it('should call for data with no paginator to start at beginning, if query is valid', function () {
      model.search.reset();
      spyOn(scope, 'isQueryValid').andReturn(true);
      scope.search();
      expect(model.search).toHaveBeenCalled();
      expect(model.search.mostRecentCall.args[5]).toBe(null);
    });

    it('should not call for data if query is not valid', function () {
      model.search.reset();
      spyOn(scope, 'isQueryValid').andReturn(false);
      scope.search();
      expect(model.search).not.toHaveBeenCalled();
    });

  });

  describe('fetchNextResults function', function () {

    it('should not call for data if the paginator indicates it is already at the end', function () {
      model.search.reset();

      scope.data.paginator = {
        hasMore: function () {
          return false;
        },
        hitMaximumLimit: function() {
          return true;
        }
      };

      scope.fetchNextResults();
      expect(model.search).not.toHaveBeenCalled();
      expect(scope.data.hitInfiniteScrollMax).toBe(true);
    });

    it('should call the search method with the expected parameters', function () {
      scope.data = {
        query: {
          name: 'Foo Autos',
          city: 'Los Angeles',
          state: ''
        },
        results: [],
        loading: false,
        paginator: null,
        sortBy: 'SomeCrazyField',
        sortDescending: true
      };
      scope.fetchNextResults();
      expect(model.search).toHaveBeenCalledWith('Foo Autos', 'Los Angeles', '', 'SomeCrazyField', true, null);
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
      expect(model.search.mostRecentCall.args[5]).toBe(p);
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
      spyOn(scope, 'search');
      scope.sortBy('foo');
      expect(scope.search).toHaveBeenCalled();
    });

  });

  describe('showCreditQuery function', function () {

    var $dialog;

    beforeEach(inject(function (_$dialog_) {
      $dialog = _$dialog_;
      spyOn($dialog, 'dialog').andReturn({ open: angular.noop });
    }));

    it('should invoke the credit query dialog', function () {
      scope.showCreditQuery();
      expect($dialog.dialog).toHaveBeenCalled();
      expect($dialog.dialog.mostRecentCall.args[0].controller).toBe('CreditQueryCtrl');
      expect($dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/creditQuery.html');
    });

    it('should provide the dialog with the selected business information', function () {
      scope.showCreditQuery({
        BusinessId: 'businessId',
        BusinessName: 'businessName',
        BusinessNumber: 'businessNumber',
        AuctionAccessDealershipNumbers: [
          'aa1',
          'aa2'
        ],
        Address: 'address',
        City: 'city',
        State: 'state',
        PostalCode: 'postalCode'
      });
      var options = $dialog.dialog.mostRecentCall.args[0].resolve.options();
      expect(options.businessId).toBe('businessId');
      expect(options.businessNumber).toBe('businessNumber');
      expect(options.auctionAccessNumbers).toBe('aa1, aa2');
      expect(options.businessName).toBe('businessName');
      expect(options.address).toBe('address');
      expect(options.city).toBe('city');
      expect(options.state).toBe('state');
      expect(options.zipCode).toBe('postalCode');
      expect(options.autoQueryCredit).toBe(true);
    });

  });

  it('should have a close function that closes the dialog', function () {
    spyOn(dialog, 'close');
    scope.close();
    expect(dialog.close).toHaveBeenCalledWith();
  });

  it('should kick off a search', function () {
    expect(model.search).toHaveBeenCalled();
  });

  it('should attach the list of states to the scope', function () {
    scope.$apply();
    expect(scope.states).toBeDefined();
    expect(scope.states.length).toBe(1);
    expect(scope.states[0]).toBe('fooState');
  });

});
