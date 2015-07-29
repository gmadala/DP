'use strict';

describe('Controller: PaymentsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var PaymentsCtrl,
    stateParamsMock,
    modelMock,
    userMock,
    dialog,
    payments,
    instantiateController,
    shouldSucceed,
    searchResult = {
      data: {}
    },
    canPayResult = {
      data: true
    },
    $q,
    scope,
    BusinessHours,
    inBizHours,
    addressesMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$q_, $dialog, _BusinessHours_) {
    scope = $rootScope.$new();
    $q = _$q_;
    BusinessHours = _BusinessHours_;
    inBizHours = true;

    modelMock = {
      search: function () {
        return $q.when(searchResult.data);
      },
      filterValues: {
        ALL: 'all_mock',
        TODAY: 'today_mock',
        RANGE: 'range_mock',
        THIS_WEEK: 'this_week_mock'
      },
      fetchFees: function () {
        return $q.when(searchResult.data);
      },
      isPaymentOnQueue: function () {
        return false;
      },
      requestExtension: function () {
        return $q.when(true);
      },
      fetchPossiblePaymentDates: function() {
        return {
          then: function() {
            return [ new Date() ];
          }
        };
      }
    };
    stateParamsMock = {
      filter: modelMock.filterValues.TODAY
    };
    userMock = {
      isLoggedIn: function(){ return true; },
      getInfo: function() {
        return $q.when({
          data: {
            AutoPayEnabled: false
          }
        })
      }
    };

    addressesMock = {
      getApprovedFlooredBusinessAddresses: function() {
        return [
          {
            AddressId: '1',
            Line1: '380 NEVADA SW',
            Line2: null,
            City: 'HURON',
            State: 'SD',
            Zip: '57350',
            Phone: '0000000000',
            Fax: '0000000000',
            IsActive: false,
            IsPhysicalInventory: false,
            HasFloorplanFlooredAgainst: true,
            HasApprovedFloorplanFlooredAgainst: true,
            IsTitleReleaseAddress: false,
            IsMailingAddress: false,
            IsPostOfficeBox: false
          },
          {
            AddressId: '3',
            Line1: '22095 392nd Ave.',
            Line2: null,
            City: 'Alpena',
            State: 'SD',
            Zip: '57312',
            Phone: '6053521637',
            Fax: '6053524528',
            IsActive: true,
            IsPhysicalInventory: true,
            HasFloorplanFlooredAgainst: true,
            HasApprovedFloorplanFlooredAgainst: true,
            IsTitleReleaseAddress: false,
            IsMailingAddress: false,
            IsPostOfficeBox: false
          }
        ]
      }
    };

    dialog = $dialog;
    spyOn(modelMock, 'search').andCallThrough();
    spyOn(modelMock, 'fetchFees').andCallThrough();

    spyOn(BusinessHours, 'insideBusinessHours').andCallFake(function() {
      if(inBizHours) {
        return $q.when(true);
      }
      return $q.when(false);
    });

    instantiateController = function() {
      PaymentsCtrl = $controller('PaymentsCtrl', {
        $scope: scope,
        $stateParams: stateParamsMock,
        Payments: modelMock,
        User: userMock,
        Addresses: addressesMock
      });
    };
    instantiateController();
  }));

  it('should attach the isPaymentOnQueue function to the scope', function () {
    expect(scope.isPaymentOnQueue).toBe(modelMock.isPaymentOnQueue);
  });

  it('should attach a getDueStatus function to the scope', function () {
    expect(typeof scope.getDueStatus).toBe('function');
  });

  it('should attach a sortPaymentsBy function to the scope', function () {
    expect(typeof scope.sortPaymentsBy).toBe('function');
  });

  it('should attach a sortFeesBy function to the scope', function () {
    expect(typeof scope.sortFeesBy).toBe('function');
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

    it('should return overdue for past due dates for fees or payments', function () {
      var result = scope.getDueStatus({DueDate: '2012-12-31'}, true);
      expect(result).toBe('overdue');
      result = scope.getDueStatus({EffectiveDate: '2012-12-31'}, false);
      expect(result).toBe('overdue');
    });

    it('should return today for same-day due dates', function () {
      var result = scope.getDueStatus({DueDate: '2013-01-01'}, true);
      expect(result).toBe('today');
      result = scope.getDueStatus({EffectiveDateDate: '2013-01-01'}, false);
      expect(result).toBe('today');
    });

    it('should return future for future due dates', function () {
      var result = scope.getDueStatus({DueDate: '2013-01-02'}, true);
      expect(result).toBe('future');
      result = scope.getDueStatus({EffectiveDate: '2013-01-02'}, false);
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

  describe('__sortBy function', function(){
    var testSortField = function(feeOrPayment){
      it('should set sortField properly', function(){
        scope.__sortBy(feeOrPayment, 'fieldA');
        expect(scope.sortField[feeOrPayment]).toEqual('fieldA');

        scope.__sortBy(feeOrPayment, 'fieldB');
        expect(scope.sortField[feeOrPayment]).toEqual('fieldB');

        scope.__sortBy(feeOrPayment, 'fieldB');
        expect(scope.sortField[feeOrPayment]).toEqual('fieldB');

        scope.__sortBy(feeOrPayment, 'fieldA');
        expect(scope.sortField[feeOrPayment]).toEqual('fieldA');
      });

      it('should set sortDescending true only if __sortBy is called consecutively with the same field name', function(){
        scope.__sortBy(feeOrPayment, 'fieldB');
        expect(scope.sortDescending[feeOrPayment]).toBeFalsy();

        scope.__sortBy(feeOrPayment, 'fieldB');
        expect(scope.sortDescending[feeOrPayment]).toBeTruthy();

        scope.__sortBy(feeOrPayment, 'fieldB');
        expect(scope.sortDescending[feeOrPayment]).toBeFalsy();

        scope.__sortBy(feeOrPayment, 'fieldA');
        expect(scope.sortDescending[feeOrPayment]).toBeFalsy();

        scope.__sortBy(feeOrPayment, 'fieldA');
        expect(scope.sortDescending[feeOrPayment]).toBeTruthy();
        scope.__sortBy(feeOrPayment, 'fieldB');
        expect(scope.sortDescending[feeOrPayment]).toBeFalsy();
      });
    };
    testSortField('payment');
    testSortField('fee');

    it('should not have fee and payment sorting interfere', function(){
      scope.__sortBy('payment', 'fieldA');
      expect(scope.sortField['payment']).toEqual('fieldA');

      scope.__sortBy('fee', 'fieldB');
      expect(scope.sortField['fee']).toEqual('fieldB');
      expect(scope.sortField['payment']).toEqual('fieldA');
    });
  });

  describe('sortPaymentsBy function', function(){
    it('should call search() for payment search', function(){
      spyOn(scope.payments, 'search');
      scope.sortPaymentsBy('fieldA');
      expect(scope.payments.search).toHaveBeenCalled();
    });

    it('should set proposedSearchCriteria properties', function(){
      scope.sortPaymentsBy('fieldA');
      expect(scope.sortField.payment).toEqual(scope.payments.proposedSearchCriteria.sortField);
      expect(scope.sortDescending.payment).toEqual(scope.payments.proposedSearchCriteria.sortDesc);

      scope.sortPaymentsBy('fieldA');
      expect(scope.sortField.payment).toEqual(scope.payments.proposedSearchCriteria.sortField);
      expect(scope.sortDescending.payment).toEqual(scope.payments.proposedSearchCriteria.sortDesc);

      scope.sortPaymentsBy('fieldB');
      expect(scope.sortField.payment).toEqual(scope.payments.proposedSearchCriteria.sortField);
      expect(scope.sortDescending.payment).toEqual(scope.payments.proposedSearchCriteria.sortDesc);
    });

    it('should call __sortBy with a "payment" argument', function() {
      spyOn(scope, '__sortBy').andCallThrough();
      scope.sortPaymentsBy('fieldA');
      expect(scope.__sortBy).toHaveBeenCalledWith('payment', 'fieldA');
    });
  });

  describe('sortFeesBy function', function(){
    it('should not call search() for fee search', function(){
      spyOn(scope.payments, 'search');
      scope.sortFeesBy('fieldA');
      expect(scope.payments.search).not.toHaveBeenCalled();
    });

    it('should call __sortBy with a "fee" argument', function() {
      spyOn(scope, '__sortBy').andCallThrough();
      scope.sortFeesBy('fieldA');
      expect(scope.__sortBy).toHaveBeenCalledWith('fee', 'fieldA');
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

  describe('page load filters', function() {
    it('should filter today', function () {
      stateParamsMock.filter = 'today';
      instantiateController();
      expect(scope.payments.proposedSearchCriteria.filter).toBe(modelMock.filterValues.TODAY);
      expect(scope.payments.proposedSearchCriteria.startDate).toBe(null);
      expect(scope.payments.proposedSearchCriteria.endDate).toBe(null);
    });

    it('should filter overdue', function () {
      stateParamsMock.filter = 'overdue';
      instantiateController();
      expect(scope.payments.proposedSearchCriteria.filter).toBe(modelMock.filterValues.RANGE);
      expect(scope.payments.proposedSearchCriteria.startDate).toBe(null);
      expect(moment(scope.payments.proposedSearchCriteria.endDate).isSame(moment().subtract(1, 'days'), 'day')).toBeTruthy();
    });

    it('should filter this-week', function () {
      stateParamsMock.filter = 'this-week';
      instantiateController();
      expect(scope.payments.proposedSearchCriteria.filter).toBe(modelMock.filterValues.THIS_WEEK);
      expect(scope.payments.proposedSearchCriteria.startDate).toBe(null);
      expect(scope.payments.proposedSearchCriteria.endDate).toBe(null);
    });

    it('should filter specific date', function () {
      stateParamsMock.filter = '2015-10-19';
      instantiateController();
      expect(scope.payments.proposedSearchCriteria.filter).toBe(modelMock.filterValues.RANGE);
      expect(moment(scope.payments.proposedSearchCriteria.startDate).isSame(moment('2015-10-19', 'YYYY-MM-DD'), 'day')).toBeTruthy();
      expect(moment(scope.payments.proposedSearchCriteria.endDate).isSame(moment('2015-10-19', 'YYYY-MM-DD'), 'day')).toBeTruthy();
    });
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

  describe('canPayNow functionality', function() {
    it('should check if we are in business hours on load', function() {
      expect(BusinessHours.insideBusinessHours).toHaveBeenCalled();
      scope.$apply();
      expect(scope.canPayNow).toBe(true);
    });

    it('should check if we are in business hours any time the business hours change event fires', inject(function($rootScope) {
      expect(BusinessHours.insideBusinessHours).toHaveBeenCalled();
      $rootScope.$broadcast(BusinessHours.CHANGE_EVENT);
      scope.$apply();
      expect(BusinessHours.insideBusinessHours).toHaveBeenCalled();
    }));

    it('should find the next business date if we are outside of business hours', inject(function($controller, $rootScope) {
      spyOn(BusinessHours, 'nextBusinessDay').andReturn($q.when('2014-10-02'));
      inBizHours = false;
      $rootScope.$broadcast(BusinessHours.CHANGE_EVENT);
      scope.$apply();
      expect(BusinessHours.nextBusinessDay).toHaveBeenCalled();
      expect(scope.nextBusinessDay).toBe('2014-10-02');
    }));
  });

  it('should only allow payment extensions if payment is in its final curtailment', function() {
    var canShow = scope.showExtendLink({ CurrentPayoff: 100, AmountDue: 100 });
    expect(canShow).toBe(true);
    canShow = scope.showExtendLink({ CurrentPayoff: 100, AmountDue: 60 });
    expect(canShow).toBe(false);
  });
});

describe('Controller: ExtensionRequestCtrl', function() {
  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ExtensionRequestCtrl,
    paymentsMock,
    payMock,
    confirm,
    dialog,
    scope,
    floorplan,
    prevMock;

  beforeEach(inject(function($controller, $rootScope, $q) {
    scope = $rootScope.$new();

    paymentsMock = { // mock for Payments service
      requestExtension: function() {
        return {
          then: function(callback) {
            callback();
          }
        };
      }
    };

    payMock = { // mock for the payment sent in when the dialog is launched
      Vin: 'vin',
      FloorplanId: '1234',
      UnitDescription: 'Description',
      CanExtend: true
    };

    prevMock = {
      PrincipalAmount: 12,
      InterestAmount: 34,
      Fees: [
        { Type: 'fee1', Amount: 56 },
        { Type: 'fee2', Amount: 78 },
      ],
      CollateralProtectionAmount: 91,
      CanExtend: true
    };

    floorplan = {
      getExtensionPreview: function() {
        return $q.when(prevMock);
      },
    };

    dialog = {
      close: angular.noop
    };

    confirm = function() {
      return function() {
        return 'fake function';
      };
    };

    ExtensionRequestCtrl = $controller('ExtensionRequestCtrl', {
      $scope: scope,
      dialog: dialog, // current open instance of dialog
      Payments: paymentsMock,
      payment: payMock,
      onConfirm: confirm,
      Floorplan: floorplan
    });

    spyOn(paymentsMock, 'requestExtension').andCallThrough();
    spyOn(scope, 'onConfirm').andCallThrough();
  }));

  describe('controller', function() {
    it('should attach the payment object to the scope', function() {
      expect(scope.payment).toBe(payMock);
    });

    it('should have an onConfirm function that will close the dialog and confirm request with api', function() {
      expect(scope.onConfirm).toBeDefined();
    });

    it('should make API call to submit request if CanExtend is true', inject(function($rootScope) {
      $rootScope.$digest();

      scope.confirmRequest();
      expect(paymentsMock.requestExtension).toHaveBeenCalled();
      expect(scope.onConfirm).toHaveBeenCalled();
    }));

    it('should NOT make API call to submit request if CanExtend is false', inject(function($rootScope) {
      prevMock.CanExtend = false;
      $rootScope.$digest();

      scope.confirmRequest();
      expect(paymentsMock.requestExtension).not.toHaveBeenCalled();
    }));
  });
});
