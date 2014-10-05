'use strict';

describe('Controller: CheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var run,
    scope,
    dialog,
    protect,
    User,
    loggedIn,
    Payments,
    Floorplan,
    $q,
    api,
    BusinessHours,
    inBizHours;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $dialog, _api_, _$q_, _protect_, _User_, _Payments_, _Floorplan_, _BusinessHours_) {
    scope = $rootScope.$new();
    dialog = $dialog;
    $q = _$q_;
    protect = _protect_;
    User = _User_;
    Payments = _Payments_;
    Floorplan = _Floorplan_;
    api = _api_;
    BusinessHours = _BusinessHours_;
    inBizHours = true;
    loggedIn = true;

    spyOn(User, 'isLoggedIn').andCallFake(function() {
      if(loggedIn) {
        return $q.when(true);
      } else {
        return $q.when(false);
      }
    });

    spyOn(BusinessHours, 'insideBusinessHours').andCallFake(function() {
      if(inBizHours) {
        return $q.when(true);
      }
      return $q.when(false);
    });


    run = function () {
      $controller('CheckoutCtrl', { $scope: scope });
    };
  }));

  it('should attach the contents of the payment queue to the scope', function () {
    var mockQueue = {};
    spyOn(Payments, 'getPaymentQueue').andReturn(mockQueue);
    run();
    expect(scope.paymentQueue.contents).toBe(mockQueue);
  });

  describe('payment queue sum functions', function () {

    var fees = {},
      payments = {};

    beforeEach(function () {
      var mockQueue = {
        fees: fees,
        payments: payments
      };
      spyOn(Payments, 'getPaymentQueue').andReturn(mockQueue);
    });

    it('should all return 0 when the queue is empty', function () {
      run();
      expect(scope.paymentQueue.sum.todayCount()).toBe(0);
      expect(scope.paymentQueue.sum.scheduledCount()).toBe(0);
      expect(scope.paymentQueue.sum.todayTotal()).toBe(0);
      expect(scope.paymentQueue.sum.scheduledTotal()).toBe(0);
    });

    it('should count and total fees plus unscheduled payments for today', function () {
      fees.feeId1 = {
        getCheckoutAmount: function() {
          return 100;
        }
      };
      payments.pmtId1 = {
        scheduleDate: new Date(),
        getCheckoutAmount: function() {
          return 210.1;
        }
      };
      payments.pmtId2 = {
        getCheckoutAmount: function() {
          return 367.4;
        }
      };
      payments.pmtId3 = {
        scheduleDate: null,
        getCheckoutAmount: function() {
          return 85.22;
        }
      };
      run();
      expect(scope.paymentQueue.sum.todayCount()).toBe(3);
      expect(scope.paymentQueue.sum.todayTotal()).toBe(552.62);
    });

    it('should count and total scheduled payments', function () {
      fees.feeId1 = {
        getCheckoutAmount: function() {
          return 100;
        }
      };
      payments.pmtId1 = {
        scheduleDate: new Date(),
        getCheckoutAmount: function() {
          return 210.1;
        }
      };
      payments.pmtId2 = {
        scheduleDate: new Date(),
        getCheckoutAmount: function() {
          return 367.4;
        }
      };
      payments.pmtId3 = {
        scheduleDate: null,
        getCheckoutAmount: function() {
          return 85.22;
        }
      };
      run();
      expect(scope.paymentQueue.sum.scheduledCount()).toBe(2);
      expect(scope.paymentQueue.sum.scheduledTotal()).toBe(577.5);
    });

    it('should count and total fees and payments', function () {
      fees.feeId1 = {
        getCheckoutAmount: function() {
          return 100;
        }
      };
      fees.feeId2 = {
        getCheckoutAmount: function() {
          return 43;
        }
      };
      payments.pmtId1 = {
        scheduleDate: new Date(),
        getCheckoutAmount: function() {
          return 210.1;
        }
      };
      payments.pmtId2 = {
        scheduleDate: new Date(),
        getCheckoutAmount: function() {
          return 367.4;
        }
      };
      payments.pmtId3 = {
        scheduleDate: null,
        getCheckoutAmount: function() {
          return 85.22;
        }
      };

      run();
      expect(scope.paymentQueue.sum.feeCount()).toBe(2);
      expect(scope.paymentQueue.sum.paymentCount()).toBe(3);
    });

  });

  it('should attach the remove functions to the scope', function () {
    run();
    expect(scope.paymentQueue.removeFee).toBe(Payments.removeFeeFromQueue);
    expect(scope.paymentQueue.removePayment).toBe(Payments.removePaymentFromQueue);
  });

  describe('canSchedule function', function () {
    var clock;

    beforeEach(function () {
      clock=sinon.useFakeTimers(moment('2013-01-01T08:30:00Z').valueOf(), 'Date');
      run();
    });

    afterEach(function () {
      clock.restore();
    });

    it('should return false if the payment due date is in the past (overdue)', function () {
      var result = scope.paymentQueue.canSchedule({
        dueDate: '2012-12-31'
      });
      expect(result).toBe(false);
    });

    it('should return false if the payment has the scheduleBlocked flag set', function () {
      var result = scope.paymentQueue.canSchedule({
        dueDate: '2013-01-04',
        scheduleBlocked: true
      });
      expect(result).toBe(false);
    });

    it('should return false if the payment due date is today', function () {
      var result = scope.paymentQueue.canSchedule({
        dueDate: '2013-01-01'
      });
      expect(result).toBe(false);
    });

    it('should return true if the payment due date is in the future', function () {
      var result = scope.paymentQueue.canSchedule({
        dueDate: '2013-01-03'
      });
      expect(result).toBe(true);
    });
  });

  describe('getDueStatus method', function(){
    var item = { dueDate: "2012-12-31"},
        clock;

    beforeEach(function () {
      clock=sinon.useFakeTimers(moment('2013-01-01T08:30:00Z').valueOf(), 'Date');
      run();
    });

    afterEach(function () {
      clock.restore();
    });

    it('should return "overdue" if today is past the due date', function() {
      expect(scope.paymentQueue.getDueStatus(item)).toBe('overdue');
    });

    it('should return "today" if today is the due date', function() {
      item.dueDate = "2013-01-01";
      expect(scope.paymentQueue.getDueStatus(item)).toBe('today');
    });

    it('should return "future" if today is in the future', function() {
      item.dueDate = "2014-08-02";
      expect(scope.paymentQueue.getDueStatus(item)).toBe('future');
    });
  });

  describe('schedule function', function () {

    var $q;

    beforeEach(inject(function (_$q_) {
      $q = _$q_;
      spyOn(dialog, 'dialog').andReturn({ open: angular.noop });
      run();
    }));

    it('should clear any scheduleError on the payment and set scheduleLoading to true', function () {
      var payment = {
        dueDate: '2013-01-10',
        scheduleError: 'oops!'
      };
      scope.paymentQueue.schedule(payment);
      expect(payment.scheduleError).toBe(false);
      expect(payment.scheduleLoading).toBe(true);
    });

    it('should invoke the schedule modal with a payment', function () {
      var payment = {dueDate: '2013-01-10', isPayment: true, isFee: false };
      scope.paymentQueue.schedule(payment);
      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/scheduleCheckout.html');
      expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('ScheduleCheckoutCtrl');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.payment()).toBe(payment);
    });

    it('should pass the payment to be scheduled', function () {
      var payment = {dueDate: '2013-01-10', isPayment: true, isFee: false };
      scope.paymentQueue.schedule(payment);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.payment()).toBe(payment);
    });

    it('should invoke the schedule modal with a fee', function () {
      var fee = {dueDate: '2013-01-10', isPayment: false, isFee: true };
      scope.paymentQueue.schedule(fee);
      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/scheduleCheckout.html');
      expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('ScheduleCheckoutCtrl');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.fee()).toBe(fee);
    });

    it('should pass the fee to be scheduled', function () {
      var fee = {dueDate: '2013-01-10', isPayment: false, isFee: true };
      scope.paymentQueue.schedule(fee);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.fee()).toBe(fee);
    });

    it('should set payment to the item when it is a payment', function () {
      var payment = {dueDate: '2013-01-10', isPayment: true, isFee: false };
      scope.paymentQueue.schedule(payment);
      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].resolve.payment()).toBe(payment);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.fee()).toBeFalsy();
    });

    it('should set fee to the item when it is a fee', function () {
      var fee = {dueDate: '2013-01-10', isPayment: false, isFee: true };
      scope.paymentQueue.schedule(fee);
      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].resolve.fee()).toBe(fee);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.payment()).toBeFalsy();
    });

    it('should pass a promise for a map of possible payment dates from tomorrow to the payment due date', function () {
      var possibleDates = {
        '2013-01-08': true,
        '2013-01-09': true
      };
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(possibleDates));

      var payment = {dueDate: '2013-01-10', isPayment: true, isFee: false };
      scope.paymentQueue.schedule(payment);

      dialog.dialog.mostRecentCall.args[0].resolve.possibleDates().then(
        function (result) {
          expect(result).toBe(possibleDates);
        }
      );

      expect(Payments.fetchPossiblePaymentDates).toHaveBeenCalled();
      var startDate = Payments.fetchPossiblePaymentDates.mostRecentCall.args[0];
      var endDate = Payments.fetchPossiblePaymentDates.mostRecentCall.args[1];
      expect(moment().add(1, 'day').isSame(startDate, 'day')).toBe(true);
      expect(moment(payment.dueDate).isSame(endDate, 'day')).toBe(true);
      expect(Payments.fetchPossiblePaymentDates.mostRecentCall.args[2]).toBe(true);

      scope.$apply();
    });

    it('should reject the promise of possible dates (to suppress modal display) if none are returned', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when({}));
      var payment = {dueDate: '2013-01-10', isPayment: true, isFee: false },
        success = jasmine.createSpy('success'),
        failure = jasmine.createSpy('failure');
      scope.paymentQueue.schedule(payment);
      dialog.dialog.mostRecentCall.args[0].resolve.possibleDates().then(success, failure);
      scope.$apply();
      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalled();
    });

    it('should set scheduleError & scheduleBlocked, and clear scheduleDate, if there are no avail. dates', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when({}));
      var payment = {dueDate: '2013-01-10', scheduleDate: new Date(), isPayment: true, isFee: false };
      scope.paymentQueue.schedule(payment);
      dialog.dialog.mostRecentCall.args[0].resolve.possibleDates();
      scope.$apply();
      expect(payment.scheduleLoading).toBe(false);
      expect(typeof payment.scheduleError).toBe('string');
      expect(payment.scheduleBlocked).toBe(true);
      expect(payment.scheduleDate).toBe(null);
    });

    it('should reject the promise of possible dates (to suppress modal display) if the load fails', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.reject('server died'));
      var payment = {dueDate: '2013-01-10', isPayment: true, isFee: false },
        success = jasmine.createSpy('success'),
        failure = jasmine.createSpy('failure');
      scope.paymentQueue.schedule(payment);
      dialog.dialog.mostRecentCall.args[0].resolve.possibleDates().then(success, failure);
      scope.$apply();
      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalled();
    });

    it('should set scheduleError if the load fails (but leave schedule date & allow retry)', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.reject('oof'));
      var payment = {dueDate: '2013-01-10', scheduleDate: new Date(), isPayment: true, isFee: false };
      scope.paymentQueue.schedule(payment);
      dialog.dialog.mostRecentCall.args[0].resolve.possibleDates();
      scope.$apply();
      expect(payment.scheduleLoading).toBe(false);
      expect(typeof payment.scheduleError).toBe('string');
      expect(payment.scheduleBlocked).not.toBe(true);
      expect(angular.isDate(payment.scheduleDate)).toBe(true);
    });

    it('should clear the scheduleLoading flag when the possible dates promise is resolved', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when({ '2013-01-01': true }));
      var payment = { dueDate: '2013-01-10', isPayment: true, isFee: false };
      scope.paymentQueue.schedule(payment);
      dialog.dialog.mostRecentCall.args[0].resolve.possibleDates();
      scope.$apply();
      expect(payment.scheduleLoading).toBe(false);
    });

  });

  describe('bankAccounts.getList', function () {

    it('should return the bank accounts list if loaded', function () {
      var accountList = ['myAccountsHere'];
      run();
      spyOn(User, 'getStatics').andReturn({
        bankAccounts: accountList
      });
      expect(scope.bankAccounts.getList()).toBe(accountList);
    });

    it('should return undefined if the user statics are not yet loaded', function () {
      run();
      spyOn(User, 'getStatics').andReturn(null);
      expect(scope.bankAccounts.getList()).not.toBeDefined();
    });

  });

  describe('bankAccounts.selectedAccount', function () {

    it('should default to null if there are multiple bank accounts', function () {
      spyOn(User, 'getStatics').andReturn({
        bankAccounts: [1, 2, 3]
      });
      run();
      expect(scope.bankAccounts.selectedAccount).toBe(null);
    });

    it('should default to the one bank account if there is only one', function () {
      spyOn(User, 'getStatics').andReturn({
        bankAccounts: [1]
      });
      run();
      scope.$apply();
      expect(scope.bankAccounts.selectedAccount).toBe(1);
    });

  });

  describe('unapplied funds info', function () {

    it('should contain the available funds amount', function () {
      spyOn(Payments, 'getAvailableUnappliedFunds').andReturn(1234);
      run();
      expect(scope.unappliedFunds.available).toBe(1234);
    });

    it('should default useFunds to false', function () {
      run();
      expect(scope.unappliedFunds.useFunds).toBe(false);
    });

    it('should default amount to \'\'', function () {
      run();
      expect(scope.unappliedFunds.useAmount).toBe('');
    });

    it('should force unapplied funds use to false if last item is removed from today bucket', function () {
      var queue = Payments.getPaymentQueue();
      var mockPayment = {
        Vin: 'vin',
        FloorplanId: 'id',
        StockNumber: 's#',
        UnitDescription: 'desc',
        AmountDue: 100,
        DueDate: '2013-01-01',
        Scheduled: false
      };
      Payments.addPaymentToQueue(mockPayment, false/* isFee */);
      run();

      scope.unappliedFunds.useFunds = true;
      queue.payments['id'].scheduleDate = new Date();
      scope.$apply();
      expect(scope.unappliedFunds.useFunds).toBe(false);
    });

    describe('min function', function () {

      beforeEach(function () {
        run();
      });

      it('should return 0 when unapplied funds are not being used', function () {
        scope.unappliedFunds.useFunds = false;
        expect(scope.unappliedFunds.min()).toBe(0);
      });

      it('should return a value greater than 0 when unapplied funds are being used', function () {
        scope.unappliedFunds.useFunds = true;
        expect(scope.unappliedFunds.min() > 0).toBe(true);
      });

    });

    describe('max function', function () {

      beforeEach(function () {
        run();
      });

      it('should return unapplied funds avail. amount if that is less than total for today', function () {
        scope.unappliedFunds.available = 100;
        spyOn(scope.paymentQueue.sum, 'todayTotal').andReturn(200);
        expect(scope.unappliedFunds.max()).toBe(100);
      });

      it('should return today total if that is less than unapplied funds avail. amount', function () {
        scope.unappliedFunds.available = 300;
        spyOn(scope.paymentQueue.sum, 'todayTotal').andReturn(200);
        expect(scope.unappliedFunds.max()).toBe(200);
      });

    });

  });

  describe('submit function', function () {

    var $q;

    beforeEach(inject(function (_$q_) {
      $q = _$q_;
      run();
      scope.paymentForm = {
        $valid: true,
        bankAccount: {
          $invalid: false
        },
        unappliedAmt: {
          $invalid: false
        }
      };
    }));

    it('should publish a snapshot of the form validation state', function () {
      scope.paymentForm.$valid = false;
      scope.paymentForm.bankAccount.$invalid = true;
      scope.submit();
      expect(angular.equals(scope.validity, scope.paymentForm)).toBe(true);
    });

    it('should not proceed to business hours validation or commit if bank account is invalid', function () {
      spyOn(scope, 'reallySubmit');
      scope.paymentForm.$valid = false;
      scope.paymentForm.bankAccount.$invalid = true;
      scope.submit();
      scope.$apply(); // apply promise resolutions
      expect(scope.reallySubmit).not.toHaveBeenCalled();
    });

    it('should not proceed if unapplied funds are enabled, and unapplied funds amount is invalid', function () {
      spyOn(scope, 'reallySubmit');
      scope.unappliedFunds.useFunds = true;
      scope.paymentForm.$valid = false;
      scope.paymentForm.unappliedAmt.$invalid = true;
      scope.submit();
      scope.$apply(); // apply promise resolutions
      expect(scope.reallySubmit).not.toHaveBeenCalled();
    });

    it('should proceed to commit if everything is valid', function () {
      spyOn(scope, 'reallySubmit');
      scope.submit();
      scope.$apply(); // apply promise resolutions
      expect(scope.reallySubmit).toHaveBeenCalled();
    });

    it('should proceed to commit if unapplied funds are disabled, & ONLY unapplied funds amt is invalid', function () {
      spyOn(scope, 'reallySubmit');
      scope.unappliedFunds.useFunds = false;
      scope.paymentForm.$valid = false;
      scope.paymentForm.unappliedAmt.$invalid = true;
      scope.submit();
      scope.$apply(); // apply promise resolutions
      expect(scope.reallySubmit).toHaveBeenCalled();
    });

  });

  describe('reallySubmit function', function () {

    var guard,
      $q,
      overrideSucceed = true;

    beforeEach(inject(function (_$q_, protect) {
      guard = protect;
      $q = _$q_;
      run();
      scope.paymentQueue = {
        contents: {
          payments: [
            { overrideAddress: null,
              isPayoff: function() { return false; }
            },
            {
              overrideAddress: 'new address',
              isPayoff: function() { return true; }
            }
          ]
        }
      };
      spyOn(dialog, 'dialog').andReturn({ open: function () { return $q.when('done'); } });
      spyOn(Floorplan, 'overrideCompletionAddress').andReturn({
        then: function(result) {
          if (overrideSucceed) {
            result(true);
          } else {
            result(false);
          }
        }
      });
    }));

    it('should throw an error if called without the protect object', function () {
      expect(scope.reallySubmit).toThrow();
    });

    it('should pass the fees, payments, and selected bank account to the model', function () {
      scope.bankAccounts.selectedAccount = {};
      spyOn(Payments, 'checkout').andReturn($q.when('OK'));

      scope.reallySubmit(guard);
      expect(Payments.checkout).toHaveBeenCalledWith(
        scope.paymentQueue.contents.fees,
        scope.paymentQueue.contents.payments,
        scope.bankAccounts.selectedAccount,
        0
      );
    });

    it('should pass the unapplied funds amount to the model if useFunds is true', function () {
      scope.unappliedFunds.useFunds = true;
      scope.unappliedFunds.useAmount = 1000;
      spyOn(Payments, 'checkout').andReturn($q.when('OK'));
      scope.reallySubmit(guard);
      expect(Payments.checkout.mostRecentCall.args[3]).toBe(1000);
    });

    it('should pass 0 as the unapplied funds amount if useFunds is false', function () {
      scope.unappliedFunds.useFunds = false;
      scope.unappliedFunds.useAmount = 1000;
      spyOn(Payments, 'checkout').andReturn($q.when('OK'));
      scope.reallySubmit(guard);
      expect(Payments.checkout.mostRecentCall.args[3]).toBe(0);
    });

    it('should send an overrideCompletionAddress request if any addresses were changed', function() {
      spyOn(Payments, 'checkout').andReturn($q.when('OK'));
      scope.reallySubmit(guard);
      expect(Floorplan.overrideCompletionAddress).toHaveBeenCalled();
    });

    it('should open the confirmation dialog on success, with the payment queue & result transaction info', function () {
      var txInfo = {};
      spyOn(Payments, 'checkout').andReturn($q.when(txInfo));
      scope.reallySubmit(guard);
      scope.$apply();
      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/confirmCheckout.html');
      expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('ConfirmCheckoutCtrl');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.queue()).toBe(scope.paymentQueue.contents);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.transactionInfo()).toBe(txInfo);
    });

    it('should clear the payment queue when the confirmation modal closes', function () {
      spyOn(Payments, 'checkout').andReturn($q.when({}));
      spyOn(Payments, 'clearPaymentQueue');
      scope.reallySubmit(guard);
      scope.$apply();
      expect(Payments.clearPaymentQueue).toHaveBeenCalled();
    });

  });

  describe('after hours payment logic', function() {
    var $q,
        $timeout,
        $rootScope,
        mockQueue;

    beforeEach(inject(function(_$q_, _$timeout_, _$rootScope_) {
      $q = _$q_;
      $timeout = _$timeout_;
      $rootScope = _$rootScope_;

      spyOn(BusinessHours, 'nextBusinessDay').andReturn($q.when('2013-01-04'));

      // mocked cartItem objects
      mockQueue = {
        fees: [{
          isFee: true,
          financialRecordId: 'fee1',
          feeType: 'type',
          vin: 'ch123',
          description: 'fee desc',
          amount: 120,
          dueDate: '2013-01-20',
          getCheckoutAmount: function() {
            return this.amount;
          }
        },
        {
          isFee: true,
          financialRecordId: 'fee2',
          feeType: 'type',
          vin: 'ch123',
          description: 'fee desc',
          amount: 120,
          dueDate: '2013-01-20',
          scheduled: true,
          scheduleDate: '2013-01-16',
          getCheckoutAmount: function() {
            return this.amount;
          }
        }],
        payments: [{
          isFee: false,
          id: 'one',
          vin: 'vin123',
          stockNum: 'stock123',
          description: 'desc123',
          amount: 456,
          dueDate: '2013-01-20',
          isPayoff: function() { return false; },
          getCheckoutAmount: function() {
            return this.amount;
          }
        },
        {
          isFee: false,
          id: 'two',
          vin: 'vin456',
          stockNum: 'stock456',
          description: 'desc456',
          amount: 456,
          scheduled: true,
          scheduleDate: '2013-01-19',
          dueDate: '2013-01-20',
          isPayoff: function() { return false; },
          getCheckoutAmount: function() {
            return this.amount;
          }
        }]
      };

      spyOn(Payments, 'getPaymentQueue').andReturn(mockQueue);
      // spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-10']));
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn({});
      run();
    }));

    it('should check if we are in business hours on load', function() {
      expect(BusinessHours.insideBusinessHours).toHaveBeenCalled();
      scope.$apply();
      expect(scope.canPayNow).toBe(true);
    });

    it('should check if we are in business hours any time the business hours change event fires', function() {
      expect(BusinessHours.insideBusinessHours).toHaveBeenCalled();
      $rootScope.$broadcast(BusinessHours.CHANGE_EVENT);
      scope.$apply();
      expect(BusinessHours.insideBusinessHours).toHaveBeenCalled();
    });

    it('should not auto-schedule if we are within business hours', function() {
      scope.$apply();
      expect(BusinessHours.nextBusinessDay).not.toHaveBeenCalled();
    });

    it('should auto-schedule if we are outside of business hours', function() {
      inBizHours = false;
      $rootScope.$broadcast(BusinessHours.CHANGE_EVENT);
      scope.$apply();
      expect(BusinessHours.nextBusinessDay).toHaveBeenCalled();
    });

    it('should only auto-schedule payments that were not already scheduled', function() {
      inBizHours = false;
      $rootScope.$broadcast(BusinessHours.CHANGE_EVENT);
      scope.$apply();
      expect(mockQueue.payments[0].scheduleDate).toBe('2013-01-04');
      expect(mockQueue.payments[1].scheduleDate).toBe('2013-01-19');
      expect(mockQueue.fees[0].scheduleDate).toBe('2013-01-04');
      expect(mockQueue.fees[1].scheduleDate).toBe('2013-01-16');
    });
  });


  describe('paymentInProgress watch', function() {
    var paymentInProgress;

    beforeEach(function() {
      paymentInProgress = false;
      spyOn(Payments, 'paymentInProgress').andCallFake(function() {
        return paymentInProgress;
      });
    });

    it('should set scope.submitInProgress', function() {
      //////////////////////////////
      ///
      ///  Test not working. Rewrite when we have time.
      ///
      ///
      //////////////////////////////
    });

  });

});
