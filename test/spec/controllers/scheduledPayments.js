'use strict';

describe('Controller: ScheduledCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ScheduledCtrl,
    loadShouldSucceed = true,
    canPayShouldSucceed = true,
    timeoutCallback,
    BusinessHours,
    $q,
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
      isPaymentOnQueue: function(shouldPass) {
        if (!shouldPass) {
          return false;
        }
        return true;
      },
      addPaymentToQueue: angular.noop,
      addPayoffToQueue: angular.noop,
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
  beforeEach(inject(function ($controller, $rootScope, $dialog, _BusinessHours_, _$q_) {
    scope = $rootScope.$new();
    dialog = $dialog;
    BusinessHours = _BusinessHours_;
    $q = _$q_;

    spyOn(BusinessHours, 'insideBusinessHours').andCallFake(function() {
      if(canPayShouldSucceed) {
        return $q.when(true);
      }
      return $q.when(false);
    });

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
  });

  it('should have a payOff function to add a payoff to the payment queue', function() {
    spyOn(paymentsMock, 'addPayoffToQueue').andReturn();
    scope.scheduledPayments.payOff(mockPayment);
    expect(paymentsMock.addPayoffToQueue).toHaveBeenCalled();
  });

  it('should have a cancelPayment function that opens a dialog', function() {
    expect(scope.scheduledPayments.cancelPayment).toBeDefined();
    expect(typeof scope.scheduledPayments.cancelPayment).toBe('function');

    spyOn(dialog, 'dialog').andReturn({ open: angular.noop });

    scope.scheduledPayments.cancelPayment({
      webScheduledPaymentId: '1234',
      vin: 'vin1',
      description: 'description',
      stockNumber: 's#',
      scheduledDate: '2014-10-02',
      isCurtailment: true,
      payoffAmount: 1000,
      paymentAmount: 100
    });
    expect(dialog.dialog).toHaveBeenCalled();
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.webScheduledPaymentId).toBe('1234');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.vin).toBe('vin1');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.description).toBe('description');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.stockNumber).toBe('s#');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.scheduledDate).toBe('2014-10-02');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.isPayOff).toBe(false);
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.currentPayOff).toBe(1000);
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().payment.amountDue).toBe(100);
    expect(typeof dialog.dialog.mostRecentCall.args[0].resolve.options().onCancel).toBe('function');
  });

  it('should have a cancelFee function that opens a dialog', function() {
    expect(scope.scheduledPayments.cancelFee).toBeDefined();
    expect(typeof scope.scheduledPayments.cancelFee).toBe('function');

    spyOn(dialog, 'dialog').andReturn({ open: angular.noop });
    scope.scheduledPayments.cancelFee({
      WebScheduledAccountFeeId: '1234',
      FinancialRecordId: 'fId',
      FeeType: 'a type of fee',
      Description: 'description',
      ScheduledDate: '2014-10-02',
      Balance: 100
    });
    expect(dialog.dialog).toHaveBeenCalled();
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.webScheduledAccountFeeId).toBe('1234');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.financialRecordId).toBe('fId');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.feeType).toBe('a type of fee');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.description).toBe('description');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.scheduledDate).toBe('2014-10-02');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.options().fee.balance).toBe(100);
    expect(typeof dialog.dialog.mostRecentCall.args[0].resolve.options().onCancel).toBe('function');
  });

  it('should have a paymentInProgress method', function() {
    expect(scope.paymentInProgress).toBe(paymentsMock.paymentInProgress);
  });

});
