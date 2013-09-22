'use strict';

describe('Controller: CheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var run,
    scope,
    dialog,
    protect,
    User,
    Payments;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $dialog, _protect_, _User_, _Payments_) {
    scope = $rootScope.$new();
    dialog = $dialog;
    protect = _protect_;
    User = _User_;
    Payments = _Payments_;
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
        Balance: 100
      };
      payments.pmtId1 = {
        $scheduleDate: new Date(),
        $queuedAmount: 210.1
      };
      payments.pmtId2 = {
        $queuedAmount: 367.4
      };
      payments.pmtId3 = {
        $scheduleDate: null,
        $queuedAmount: 85.22
      };
      run();
      expect(scope.paymentQueue.sum.todayCount()).toBe(3);
      expect(scope.paymentQueue.sum.todayTotal()).toBe(552.62);
    });

    it('should count and total scheduled payments', function () {
      fees.feeId1 = {
        Balance: 100
      };
      payments.pmtId1 = {
        $scheduleDate: new Date(),
        $queuedAmount: 210.1
      };
      payments.pmtId2 = {
        $scheduleDate: new Date(),
        $queuedAmount: 367.4
      };
      payments.pmtId3 = {
        $scheduleDate: null,
        $queuedAmount: 85.22
      };
      run();
      expect(scope.paymentQueue.sum.scheduledCount()).toBe(2);
      expect(scope.paymentQueue.sum.scheduledTotal()).toBe(577.5);
    });

  });

  it('should attach the removeItem function to the scope', function () {
    run();
    expect(scope.paymentQueue.removeItem).toBe(Payments.removeFromPaymentQueue);
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
        DueDate: '2013-01-01'
      });
      expect(result).toBe(false);
    });

    it('should return true if the payment due date is today', function () {
      var result = scope.paymentQueue.canSchedule({
        DueDate: '2013-01-02'
      });
      expect(result).toBe(true);
    });

    it('should return true if the payment due date is in the future', function () {
      var result = scope.paymentQueue.canSchedule({
        DueDate: '2013-01-03'
      });
      expect(result).toBe(true);
    });

  });

  it('should have a schedule function that hands off to the schedule modal', function () {
    spyOn(dialog, 'dialog').andReturn({ open: angular.noop });
    run();
    var payment = {};
    scope.paymentQueue.schedule(payment);
    expect(dialog.dialog).toHaveBeenCalled();
    expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/scheduleCheckout.html');
    expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('ScheduleCheckoutCtrl');
    expect(dialog.dialog.mostRecentCall.args[0].resolve.payment()).toBe(payment);
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

    it('should default amount to 0', function () {
      run();
      expect(scope.unappliedFunds.useAmount).toBe(0);
    });

  });

  describe('submit function', function () {

    var $q;

    beforeEach(inject(function (_$q_) {
      $q = _$q_;
      run();
      scope.paymentForm = {
        $valid: true
      };
    }));

    it('should clear any existing submitError', function () {
      spyOn(scope, 'validateBusinessHours').andReturn($q.when(false));
      scope.submitError = 'ludicrous speed not supported';
      scope.submit();
      expect(scope.submitError).toBe(null);
    });

    it('should publish a snapshot of the form validation state', function () {
      scope.paymentForm.$valid = false;
      scope.submit();
      expect(angular.equals(scope.validity, scope.paymentForm)).toBe(true);
    });

    it('should not proceed to business hours validation or commit if the form is invalid', function () {
      spyOn(scope, 'validateBusinessHours').andReturn($q.when(false));
      spyOn(scope, 'reallySubmit');
      scope.paymentForm.$valid = false;
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

    it('should proceed to commit if all pre-validation passes', function () {
      spyOn(scope, 'validateBusinessHours').andReturn($q.when(true));
      spyOn(scope, 'reallySubmit');
      scope.submit();
      scope.$apply(); // apply promise resolutions
      expect(scope.reallySubmit).toHaveBeenCalled();
    });

  });

  describe('reallySubmit function', function () {

    var guard,
      $q;

    beforeEach(inject(function (_$q_, protect) {
      guard = protect;
      $q = _$q_;
      run();
      spyOn(dialog, 'dialog').andReturn({ open: angular.noop });
    }));

    it('should throw an error if called without the protect object', function () {
      expect(scope.reallySubmit).toThrow();
    });

    it('should set submitInProgress to true', function () {
      spyOn(Payments, 'checkout').andReturn($q.when('OK'));
      scope.reallySubmit(guard);
      expect(scope.submitInProgress).toBe(true);
    });

    it('should set submitInProgress back to false on completion', function () {
      spyOn(Payments, 'checkout').andReturn($q.when('OK'));
      scope.reallySubmit(guard);
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
    });

    it('should set submitInProgress back to false on error', function () {
      spyOn(Payments, 'checkout').andReturn($q.reject('error'));
      scope.reallySubmit(guard);
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
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

    it('should publish the error on the scope, on error', function () {
      spyOn(Payments, 'checkout').andReturn($q.reject('error123'));
      scope.reallySubmit(guard);
      scope.$apply();
      expect(scope.submitError).toBe('error123');
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

    it('should set submitInProgress back to false, publish the error, and resolve to false on error', function () {
      spyOn(Payments, 'canPayNow').andReturn($q.reject('oops'));
      scope.validateBusinessHours().then(function (result) {
        expect(result).toBe(false);
      });
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(scope.submitError).toBe('oops');
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

    it('should set submitInProgress back to false and publish the error on error', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.reject('no scheduling for you'));
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(scope.submitError).toBe('no scheduling for you');
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

    it('should stop and set submitError if no possible date was found', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when([]));
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(typeof scope.submitError).toBe('string');
      expect(dialog.dialog).not.toHaveBeenCalled();
    });

    it('should remove all fees from the queue', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-01']));
      Payments.addToPaymentQueue({
        FeeType: 'one',
        FinancialRecordId: 'fee1',
        Posted: 'blah'
      });
      Payments.addToPaymentQueue({
        FeeType: 'two',
        FinancialRecordId: 'fee2',
        Posted: 'blah'
      });
      expect(_.map(scope.paymentQueue.contents.fees).length).toBe(2);
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(_.map(scope.paymentQueue.contents.fees).length).toBe(0);
    });

    it('should remove overdue payments from the queue', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-01']));
      Payments.addToPaymentQueue({
        FloorplanId: 'one',
        DueDate: '2013-01-01'
      });
      Payments.addToPaymentQueue({
        FloorplanId: 'two',
        DueDate: '2013-01-03'
      });
      expect(_.map(scope.paymentQueue.contents.payments).length).toBe(2);
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(_.map(scope.paymentQueue.contents.payments).length).toBe(1);
      expect(_.map(scope.paymentQueue.contents.payments)[0].FloorplanId).toBe('two');
    });

    it('should schedule payments that have not been scheduled already for the next avail date', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-06', '2013-01-04']));
      var priorSchedule = new Date();
      Payments.addToPaymentQueue({
        FloorplanId: 'one',
        DueDate: '2013-01-10',
        $scheduleDate: priorSchedule
      });
      Payments.addToPaymentQueue({
        FloorplanId: 'two',
        DueDate: '2013-01-10'
      });
      scope.handleAfterHoursViolation();
      scope.$apply();
      var newQueue = _.map(scope.paymentQueue.contents.payments);
      newQueue = _.sortBy(newQueue, 'FloorplanId');
      var expectedScheduleDate = moment([2013, 0, 4]);
      expect(newQueue.length).toBe(2);
      expect(newQueue[0].$scheduleDate).toBe(priorSchedule);
      expect(expectedScheduleDate.isSame(newQueue[1].$scheduleDate, 'day')).toBe(true);
    });

    it('should invoke the after hours notice modal with ejected items and the auto schedule date', function () {
      spyOn(Payments, 'fetchPossiblePaymentDates').andReturn($q.when(['2013-01-04']));
      var fee1 = {
        FeeType: 'some type',
        FinancialRecordId: 'fee1',
        Posted: 'blah'
      };
      Payments.addToPaymentQueue(fee1);
      var overdue1 = {
        FloorplanId: 'overdue',
        DueDate: '2013-01-01'
      };
      Payments.addToPaymentQueue(overdue1);
      Payments.addToPaymentQueue({
        FloorplanId: 'scheduled',
        DueDate: '2013-01-10',
        $scheduleDate: new Date()
      });
      Payments.addToPaymentQueue({
        FloorplanId: 'regular',
        DueDate: '2013-01-10'
      });
      scope.handleAfterHoursViolation();
      scope.$apply();
      expect(dialog.dialog).toHaveBeenCalled();
      expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/afterHoursCheckout.html');
      expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('AfterHoursCheckoutCtrl');
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedFees().length).toBe(1);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedFees()[0]).toBe(fee1);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedPayments().length).toBe(1);
      expect(dialog.dialog.mostRecentCall.args[0].resolve.ejectedPayments()[0]).toBe(overdue1);
      var date = dialog.dialog.mostRecentCall.args[0].resolve.autoScheduleDate();
      expect(moment([2013, 0, 4]).isSame(date, 'day')).toBe(true);
    });

  });

});
