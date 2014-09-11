'use strict';

describe('Controller: ScheduledCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ScheduledCtrl,
    loadShouldSucceed = true,
    canPayShouldSucceed = true,
    timeoutCallback,
    errMock = {
      dismiss: angular.noop
    },
    timeout = function(callback, timeoutTime) {
      timeoutCallback = callback;
    },
    scope,
    dialog,
    scheduledPaymentsSearchMock = {
      search: function() {
        return {
          then: function(success) {
            success([{
              vin: '',
              description: '',
              stockNumber: '',
              status: '',
              scheduledDate: '',
              setupDate: '',
              payoffAmount: 1000,
              curtailmentAmount: 1000,
              scheduledBy: ''
            }]);
          }
        };
      },
      loadMoreData: function() {
        return {
          then: function(success, failure) {
            if(loadShouldSucceed){
              success([{
                vin: '',
                description: '',
                stockNumber: '',
                status: '',
                scheduledDate: '',
                setupDate: '',
                payoffAmount: 1000,
                curtailmentAmount: 1000,
                scheduledBy: ''
              }]);
            } else {
              failure(false);
            }
          }
        };
      },
      hasMoreRecords: function() {
        return false;
      },
      fetchFees: function() {
        return {
          then: function(success) {
            success({
              ScheduledAccountFees: {
                WebScheduledAccountFeeId: '',
                Description: '',
                ScheduledDate: '',
                Balance: '',
                FeeType: ''
              }
            });
          }
        };
      }
    },
    paymentsMock = {
      canPayNow: function() {
        return {
          then: function(success, failure) {
            if(canPayShouldSucceed) {
              success(true);
            } else {
              failure(errMock);
            }
          }
        };
      },
      isPaymentOnQueue: function(shouldPass) {
        if (!shouldPass) {
          return false;
        }
        return true;
      },
      addPaymentToQueue: angular.noop,
      paymentInProgress: angular.noop
    },
    mockPayment = {
      floorplanId: 123,
      vin: '',
      stockNumber: 123,
      description: '',
      payoffAmount: 1234,
      curtailmentDueDate: '',
      principalPayoff: '12345'
    },
    userMock = {
      isLoggedIn: function() {
        return true;
      },
      getInfo: function() {
        return {
          businessId: "12345"
        }
      }
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $dialog) {
    scope = $rootScope.$new();
    dialog = $dialog;

    ScheduledCtrl = $controller('ScheduledCtrl', {
      $scope: scope,
      ScheduledPaymentsSearch: scheduledPaymentsSearchMock,
      Payments: paymentsMock,
      User: userMock,
      $timeout: timeout
    });
  }));

  it('should attach scheduledPayments.results and fees.results to the scope', function () {
    expect(scope.scheduledPayments.results).toBeDefined();
    expect(scope.fees.results).toBeDefined();
  });

  it('should attach scheduledPayments.searchCriteria to the scope', function () {
    expect(scope.scheduledPayments.searchCriteria).toBeDefined();
  });

  it('should attach scheduledPayments.loading to the scope', function () {
    expect(scope.scheduledPayments.loading).toBeDefined();
  });

  it('should attach isCollapsed to the scope', function () {
    expect(scope.isCollapsed).toBeDefined();
  });

  describe('__sortBy function', function(){
    it('should have a __sortBy function', function(){
      expect(typeof scope.__sortBy).toEqual('function');
    });

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
  });

  describe('sortFeesBy function', function(){
    it('should not call search() for fee search', function(){
      spyOn(scope.scheduledPayments, 'search');
      scope.sortFeesBy('fieldA');
      expect(scope.scheduledPayments.search).not.toHaveBeenCalled();
    });

    it('should call __sortBy with a "fee" argument', function() {
      spyOn(scope, '__sortBy').andCallThrough();
      scope.sortFeesBy('fieldA');
      expect(scope.__sortBy).toHaveBeenCalledWith('fee', 'fieldA');
    });
  });
  describe('sortPaymentsBy function', function(){
    it('should call search()', function(){
      spyOn(scope.scheduledPayments, 'search');
      scope.sortPaymentsBy('fieldA');
      expect(scope.scheduledPayments.search).toHaveBeenCalled();
    });

    it('should call __sortBy with a "payment" argument', function() {
      spyOn(scope, '__sortBy').andCallThrough();
      scope.sortPaymentsBy('fieldA');
      expect(scope.__sortBy).toHaveBeenCalledWith('payment', 'fieldA');
    });
  });

  describe('loadMoreData function', function() {
    it('shouldn\'t run if there are no more scheduled payments to show', function() {
      spyOn(scheduledPaymentsSearchMock, 'loadMoreData');
      scope.scheduledPayments.loadMoreData();
      scope.$apply();
      expect(scheduledPaymentsSearchMock.loadMoreData).not.toHaveBeenCalled();
    });

    it('should grab new data if there is more', function() {
      spyOn(scheduledPaymentsSearchMock, 'loadMoreData').andCallThrough();
      scheduledPaymentsSearchMock.hasMoreRecords = function() { return true; };
      scope.scheduledPayments.loadMoreData();
      scope.$apply();
      expect(scheduledPaymentsSearchMock.loadMoreData).toHaveBeenCalled();
    });

    it('should set its own hitInfiniteScrollMax to true if we reach the limit', function() {
      loadShouldSucceed = false;
      scope.scheduledPayments.loadMoreData();
      scope.$apply();
      expect(scope.hitInfiniteScrollMax).toBe(true);
    });
  });

  describe('isOnPaymentQueue function', function() {
    it('should return true if the payment is in the queue', function() {
      spyOn(paymentsMock, 'isPaymentOnQueue').andCallFake(
        function() {
          return true;
        }
      );

      var res = scope.scheduledPayments.isOnPaymentQueue(1);
      expect(paymentsMock.isPaymentOnQueue).toHaveBeenCalled();
      expect(res).toBe(true);
    });

    it('should return false if the payment is not in the queue', function() {
      spyOn(paymentsMock, 'isPaymentOnQueue').andCallFake(
        function() {
          return false;
        }
      );

      var res = scope.scheduledPayments.isOnPaymentQueue(1);
      expect(paymentsMock.isPaymentOnQueue).toHaveBeenCalled();
      expect(res).toBe(false);
    });
  });

  describe('refreshCanPayNow function', function() {
    it('should refresh whether the user can pay now if user is logged in', function() {
      spyOn(paymentsMock, 'canPayNow').andCallThrough();
      timeoutCallback();
      expect(paymentsMock.canPayNow).toHaveBeenCalled();
    });

    it('should set local canPayNow variables based on results', function() {
      scope.canPayNow = false;
      timeoutCallback();
      expect(scope.canPayNow).toBe(true);
      expect(scope.canPayNowLoaded).toBe(true);
    });

    it('should set local canPayNow variables to false if there is an error', function() {
      canPayShouldSucceed = false;
      scope.canPayNow = true;
      scope.canPayNowLoaded = true;

      timeoutCallback();
      expect(scope.canPayNow).toBe(false);
      expect(scope.canPayNowLoaded).toBe(false);
    });

    it('should do nothing if user is not logged in', inject(function($controller) {
      spyOn(userMock, 'isLoggedIn').andCallFake(
        function() {
          return false;
        }
      );

      spyOn(paymentsMock, 'canPayNow').andCallThrough();
      timeoutCallback();
      expect(paymentsMock.canPayNow).not.toHaveBeenCalled();
    }));
  });

  it('should have a payOff function to add a payoff to the payment queue', function() {
    spyOn(paymentsMock, 'addPaymentToQueue').andReturn();
    scope.scheduledPayments.payOff(mockPayment);
    expect(paymentsMock.addPaymentToQueue).toHaveBeenCalled();
  });

  it('should have a cancelPayment function that opens a dialog', function() {
    expect(scope.scheduledPayments.cancelPayment).toBeDefined();
    expect(typeof scope.scheduledPayments.cancelPayment).toBe('function');

    spyOn(dialog, 'dialog').andReturn({ open: angular.noop });
    scope.scheduledPayments.cancelPayment();
    expect(dialog.dialog).toHaveBeenCalled();
  });

  it('should have a cancelFee function that opens a dialog', function() {
    expect(scope.scheduledPayments.cancelFee).toBeDefined();
    expect(typeof scope.scheduledPayments.cancelFee).toBe('function');

    spyOn(dialog, 'dialog').andReturn({ open: angular.noop });
    scope.scheduledPayments.cancelFee();
    expect(dialog.dialog).toHaveBeenCalled();
  });

  it('should have a paymentInProgress method', function() {
    expect(scope.paymentInProgress).toBe(paymentsMock.paymentInProgress);
  });

});
