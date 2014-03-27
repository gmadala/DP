'use strict';

describe('Controller: CheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var run,
    scope,
    dialog,
    protect,
    User,
    Payments,
    Floorplan;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $dialog, _protect_, _User_, _Payments_, _Floorplan_) {
    scope = $rootScope.$new();
    dialog = $dialog;
    protect = _protect_;
    User = _User_;
    Payments = _Payments_;
    Floorplan = _Floorplan_;
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
        amount: 100
      };
      payments.pmtId1 = {
        scheduleDate: new Date(),
        amount: 210.1
      };
      payments.pmtId2 = {
        amount: 367.4
      };
      payments.pmtId3 = {
        scheduleDate: null,
        amount: 85.22
      };
      run();
      expect(scope.paymentQueue.sum.todayCount()).toBe(3);
      expect(scope.paymentQueue.sum.todayTotal()).toBe(552.62);
    });

    it('should count and total scheduled payments', function () {
      fees.feeId1 = {
        amount: 100
      };
      payments.pmtId1 = {
        scheduleDate: new Date(),
        amount: 210.1
      };
      payments.pmtId2 = {
        scheduleDate: new Date(),
        amount: 367.4
      };
      payments.pmtId3 = {
        scheduleDate: null,
        amount: 85.22
      };
      run();
      expect(scope.paymentQueue.sum.scheduledCount()).toBe(2);
      expect(scope.paymentQueue.sum.scheduledTotal()).toBe(577.5);
    });

    it('should count and total fees and payments', function () {
      fees.feeId1 = {
        amount: 100
      };
      fees.feeId2 = {
        amount: 43
      };
      payments.pmtId1 = {
        scheduleDate: new Date(),
        amount: 210.1
      };
      payments.pmtId2 = {
        scheduleDate: new Date(),
        amount: 367.4
      };
      payments.pmtId3 = {
        scheduleDate: null,
        amount: 85.22
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
      clock = sinon.useFakeTimers(moment([2013, 0, 2, 11, 15]).valueOf(), 'Date');
      run();
    });

    afterEach(function () {
      clock.restore();
    });

    it('should return false if the payment due date is in the past (overdue)', function () {
      var result = scope.paymentQueue.canSchedule({
        dueDate: '2013-01-01'
      });
      expect(result).toBe(false);
    });

    it('should return false if the payment has the scheduleBlocked flag set', function () {
      var result = scope.paymentQueue.canSchedule({
        dueDate: '2013-01-03',
        scheduleBlocked: true
      });
      expect(result).toBe(false);
    });

    it('should return false if the payment due date is today', function () {
      var result = scope.paymentQueue.canSchedule({
        dueDate: '2013-01-02'
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
      Payments.addPaymentToQueue('id', 'vin', 's#', 'desc', 100, '2013-01-01', false);
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
      spyOn(scope, 'validateBusinessHours').andReturn($q.when(false));
      spyOn(scope, 'reallySubmit');
      scope.paymentForm.$valid = false;
      scope.paymentForm.bankAccount.$invalid = true;
      scope.submit();
      scope.$apply(); // apply promise resolutions
      expect(scope.validateBusinessHours).not.toHaveBeenCalled();
      expect(scope.reallySubmit).not.toHaveBeenCalled();
    });

    it('should not proceed if unapplied funds are enabled, and unapplied funds amount is invalid', function () {
      spyOn(scope, 'validateBusinessHours').andReturn($q.when(false));
      spyOn(scope, 'reallySubmit');
      scope.unappliedFunds.useFunds = true;
      scope.paymentForm.$valid = false;
      scope.paymentForm.unappliedAmt.$invalid = true;
      scope.submit();
      scope.$apply(); // apply promise resolutions
      expect(scope.validateBusinessHours).not.toHaveBeenCalled();
      expect(scope.reallySubmit).not.toHaveBeenCalled();
    });

    it('should not proceed to commit if form is valid but there is a business hours problem', function () {
      spyOn(scope, 'validateBusinessHours').andReturn($q.when(false));
      spyOn(scope, 'reallySubmit');
      scope.submit();
      scope.$apply(); // apply promise resolutions
      expect(scope.reallySubmit).not.toHaveBeenCalled();
    });

    it('should proceed to commit if everything is valid', function () {
      spyOn(scope, 'validateBusinessHours').andReturn($q.when(true));
      spyOn(scope, 'reallySubmit');
      scope.submit();
      scope.$apply(); // apply promise resolutions
      expect(scope.reallySubmit).toHaveBeenCalled();
    });

    it('should proceed to commit if unapplied funds are disabled, & ONLY unapplied funds amt is invalid', function () {
      spyOn(scope, 'validateBusinessHours').andReturn($q.when(true));
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
              isPayoff: false
            },
            {
              overrideAddress: 'new address',
              isPayoff: true
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

  describe('validateBusinessHours function', function () {

    var $q;

    beforeEach(inject(function (_$q_) {
      $q = _$q_;
      run();
    }));

    it('should set submitInProgress to true', function () {
      spyOn(Payments, 'canPayNow').andReturn($q.when(true));
      scope.validateBusinessHours();
      expect(scope.submitInProgress).toBe(true);
    });

    it('should set submitInProgress back to false on completion', function () {
      spyOn(Payments, 'canPayNow').andReturn($q.when(false));
      scope.validateBusinessHours();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
    });

    it('should set submitInProgress back to false and resolve to false on error', function () {
      spyOn(Payments, 'canPayNow').andReturn($q.reject('oops'));
      scope.validateBusinessHours().then(function (result) {
        expect(result).toBe(false);
      });
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
    });

    it('should resolve to true if user can pay now (during business hours)', function () {
      spyOn(Payments, 'canPayNow').andReturn($q.when(true));
      scope.validateBusinessHours().then(function (result) {
        expect(result).toBe(true);
      });
      scope.$apply();
    });

    it('should resolve to true if after hours, but the queue contains no same-day payments', function () {
      spyOn(Payments, 'canPayNow').andReturn($q.when(false));
      spyOn(scope.paymentQueue.sum, 'todayCount').andReturn(0);
      scope.validateBusinessHours().then(function (result) {
        expect(result).toBe(true);
      });
      scope.$apply();
    });

    it('should resolve to false if after hours and the queue contains same-day payments', function () {
      spyOn(Payments, 'canPayNow').andReturn($q.when(false));
      spyOn(scope.paymentQueue.sum, 'todayCount').andReturn(1);
      spyOn(scope, 'handleAfterHoursViolation');
      scope.validateBusinessHours().then(function (result) {
        expect(result).toBe(false);
      });
      scope.$apply();
    });

    it('should invoke handleAfterHoursViolation if the situation is invalid', function () {
      spyOn(Payments, 'canPayNow').andReturn($q.when(false));
      spyOn(scope.paymentQueue.sum, 'todayCount').andReturn(1);
      spyOn(scope, 'handleAfterHoursViolation');
      scope.validateBusinessHours();
      scope.$apply();
      expect(scope.handleAfterHoursViolation).toHaveBeenCalled();
    });

  });

  describe('handleAfterHoursViolation function', function () {

    var $q,
      clock;

    beforeEach(inject(function (_$q_) {
      $q = _$q_;
      spyOn(dialog, 'dialog').andReturn({ open: angular.noop });
      clock = sinon.useFakeTimers(moment([2013, 0, 2]).valueOf(), 'Date');
      run();
    }));

    afterEach(function () {
      clock.restore();
    });

    it('should set submitInProgress to true', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-01']));
      scope.handleAfterHoursViolation();
      expect(scope.submitInProgress).toBe(true);
    });

    it('should set submitInProgress back to false on completion', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-01']));
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
    });

    it('should set submitInProgress back to false on error', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.reject('no scheduling for you'));
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
    });

    it('should search for possible payments dates between tomorrow and some time out', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-01']));
      scope.handleAfterHoursViolation();

      expect(Payments.fetchPossiblePaymentDates).toHaveBeenCalled();
      var startDate = Payments.fetchPossiblePaymentDates.mostRecentCall.args[0];
      expect(moment().add('days', 1).isSame(startDate, 'day')).toBe(true);
      var endDate = Payments.fetchPossiblePaymentDates.mostRecentCall.args[1];
      expect(moment(endDate).diff(moment(), 'days') > 10).toBe(true);
    });

    it('should stop and create an error message if no possible date was found', inject(function (messages) {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when([]));
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(dialog.dialog).not.toHaveBeenCalled();
      expect(messages.list().length).toBe(1);
    }));

    it('should remove all fees from the queue not schedulable', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-01']));
      Payments.addFeeToQueue('fee1', 'ch123', 'type', 'fee desc', 120, '2013-01-01');
      Payments.addFeeToQueue('fee2', 'ch124', 'type', 'fee desc 2', 130, '2013-01-03');
      expect(_.map(scope.paymentQueue.contents.fees).length).toBe(2);
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(_.map(scope.paymentQueue.contents.fees).length).toBe(1);
    });

    it('should remove overdue payments from the queue', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-01']));
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(true));
      Payments.addPaymentToQueue(
        'one',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-01',
        false
      );
      Payments.addPaymentToQueue(
        'two',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-03',
        false
      );
      expect(_.map(scope.paymentQueue.contents.payments).length).toBe(2);
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate.calls.length).toBe(1);
      expect(_.map(scope.paymentQueue.contents.payments).length).toBe(1);
      expect(_.map(scope.paymentQueue.contents.payments)[0].floorplanId).toBe('two');
    });

    it('should remove overdue fees from the queue', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-01']));
      Payments.addFeeToQueue(
        'one',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-01'
      );
      Payments.addFeeToQueue(
        'two',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-03'
      );
      expect(_.map(scope.paymentQueue.contents.fees).length).toBe(2);
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(_.map(scope.paymentQueue.contents.fees).length).toBe(1);
      expect(_.map(scope.paymentQueue.contents.fees)[0].financialRecordId).toBe('two');
    });

    it('should remove payments that are due before the next available schedule date', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-05', '2013-01-06']));
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(true));
      Payments.addPaymentToQueue(
        'one',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-08',
        false
      );
      Payments.addPaymentToQueue(
        'two',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-04',
        false
      );
      expect(_.map(scope.paymentQueue.contents.payments).length).toBe(2);
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate.calls.length).toBe(1);
      expect(_.map(scope.paymentQueue.contents.payments).length).toBe(1);
      expect(_.map(scope.paymentQueue.contents.payments)[0].floorplanId).toBe('one');
    });

    it('should remove fees that are due before the next available schedule date', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-05', '2013-01-06']));
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(true));
      Payments.addFeeToQueue(
        'one',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-08'
      );
      Payments.addFeeToQueue(
        'two',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-04'
      );
      expect(_.map(scope.paymentQueue.contents.fees).length).toBe(2);
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate.calls.length).toBe(0);
      expect(_.map(scope.paymentQueue.contents.fees).length).toBe(1);
      expect(_.map(scope.paymentQueue.contents.fees)[0].financialRecordId).toBe('one');
    });

    it('should schedule payments that have not been scheduled already for the next avail date', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-06', '2013-01-04']));
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(true));
      var priorSchedule = new Date();
      Payments.addPaymentToQueue(
        'one',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-10',
        false
      );
      Payments.addPaymentToQueue(
        'two',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-10',
        false
      );
      Payments.getPaymentQueue().payments['one'].scheduleDate = priorSchedule;
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate.calls.length).toBe(1);
      var newQueue = _.map(scope.paymentQueue.contents.payments);
      newQueue = _.sortBy(newQueue, 'floorplanId');
      var expectedScheduleDate = moment([2013, 0, 4]);
      expect(newQueue.length).toBe(2);
      expect(newQueue[0].scheduleDate).toBe(priorSchedule);
      expect(expectedScheduleDate.isSame(newQueue[1].scheduleDate, 'day')).toBe(true);
    });

    it('should schedule fees that have not been scheduled already for the next avail date', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-06', '2013-01-04']));
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(true));
      var priorSchedule = new Date();
      Payments.addFeeToQueue(
        'one',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-10'
      );
      Payments.addFeeToQueue(
        'two',
        'ch123',
        's123',
        'desc123',
        123,
        '2013-01-10'
      );
      Payments.getPaymentQueue().fees['one'].scheduleDate = priorSchedule;
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate).not.toHaveBeenCalled();
      var newQueue = _.map(scope.paymentQueue.contents.fees);
      newQueue = _.sortBy(newQueue, 'financialRecordId');
      var expectedScheduleDate = moment([2013, 0, 4]);
      expect(newQueue.length).toBe(2);
      expect(newQueue[0].scheduleDate).toBe(priorSchedule);
      expect(expectedScheduleDate.isSame(newQueue[1].scheduleDate, 'day')).toBe(true);
    });

    it('should invoke the after hours notice modal with ejected items and the auto schedule date', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-04']));
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(true));

      Payments.addFeeToQueue('fee1', 'ch123', 'type', 'desc', 123, '2013-01-03');
      Payments.addPaymentToQueue('overdue', 'v1', 's1', 'd1', 1, '2013-01-01', true);
      Payments.addPaymentToQueue('scheduled', 'v2', 's2', 'd2', 2, '2013-01-10', false);
      Payments.getPaymentQueue().payments['scheduled'].scheduleDate = new Date();
      Payments.addPaymentToQueue('regular', 'v3', 's3', 'd3', 3, '2013-01-10', false);

      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/afterHoursCheckout.html');
      expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('AfterHoursCheckoutCtrl');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedFees().length).toBe(1);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedFees()[0].financialRecordId).toBe('fee1');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedPayments().length).toBe(1);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedPayments()[0].floorplanId).toBe('overdue');
      var date = dialog.dialog.mostRecentCall.args[0].resolve.autoScheduleDate();
      expect(moment([2013, 0, 4]).isSame(date, 'day')).toBe(true);
    });

    it('should invoke the after hours notice modal with ejected items and the auto schedule date for fees', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-04']));
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(true));


      Payments.addFeeToQueue('fee1', 'ch123', 'type', 'desc', 123, '2013-01-10');
      Payments.addPaymentToQueue('overdue', 'v1', 's1', 'd1', 1, '2013-01-01', true);
      Payments.addPaymentToQueue('scheduled', 'v2', 's2', 'd2', 2, '2013-01-10', false);
      Payments.getPaymentQueue().payments['scheduled'].scheduleDate = new Date();
      Payments.addPaymentToQueue('regular', 'v3', 's3', 'd3', 3, '2013-01-10', false);

      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/afterHoursCheckout.html');
      expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('AfterHoursCheckoutCtrl');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedFees().length).toBe(0);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedPayments().length).toBe(1);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedPayments()[0].floorplanId).toBe('overdue');
      var date = dialog.dialog.mostRecentCall.args[0].resolve.autoScheduleDate();
      expect(moment([2013, 0, 4]).isSame(date, 'day')).toBe(true);
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
