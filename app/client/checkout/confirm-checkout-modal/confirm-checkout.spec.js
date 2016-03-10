'use strict';

describe('Controller: ConfirmCheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ConfirmCheckoutCtrl,
    scope,
    dialog,
    queue,
    transactionInfo,
    receipts,
    state,
    _window,
    run;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $state, Receipts, $window) {
    receipts = Receipts;
    state = $state;
    _window = $window;

    scope = $rootScope.$new();
    dialog = {
      close: angular.noop
    };
    queue = {
      fees: {
        'fee1': {
          id: 'bar1',
          getCheckoutAmount: function() {
            return 500;
          },
          amount: 1
        },
        'fee2': {
          id: 'bar2',
          getCheckoutAmount: function() {
            return 60;
          },
          amount: 1,
          scheduleDate: new Date()
        }
      },
      payments: {
        'pmt1': {
          id: 'baz',
          getCheckoutAmount: function() {
            return 1000;
          },
          revenueToTrack: 8
        },
        'pmt2': {
          id: 'biz',
          scheduleDate: new Date(),
          getCheckoutAmount: function() {
            return 4000;
          },
          revenueToTrack: 80
        }
      }
    };
    transactionInfo = {
      FinancialTransactionId: 'abc123',
      UnappliedFundsTransactionId: 'def456'
    };

    run = function () {
      ConfirmCheckoutCtrl = $controller('ConfirmCheckoutCtrl', {
        $scope: scope,
        $uibModalInstance: dialog,
        queue: queue,
        transactionInfo: transactionInfo
      });
    };
    run();
  }));

  it('should attach the current date to the scope', function () {
    expect(moment().isSame(scope.today, 'day')).toBe(true);
  });

  it('should attach array of today fees to the scope', function () {
    expect(scope.items.feesToday.length).toBe(1);
    expect(scope.items.feesToday[0].id).toBe('bar1');
  });

  it('should attach array of scheduled fees to the scope', function () {
    expect(scope.items.feesScheduled.length).toBe(1);
    expect(scope.items.feesScheduled[0].id).toBe('bar2');
  });

  it('should attach array of today payments to the scope', function () {
    expect(scope.items.paymentsToday.length).toBe(1);
    expect(scope.items.paymentsToday[0].id).toBe('baz');
  });

  it('should attach array of scheduled payments to the scope', function () {
    expect(scope.items.paymentsScheduled.length).toBe(1);
    expect(scope.items.paymentsScheduled[0].id).toBe('biz');
  });

  describe('items.getTotals function', function() {
    it('should exist', function() {
      expect(scope.items.getTotals).toBeDefined();
    });

    it('should return an object with totals for payments/fees today and payments/fees that are scheduled', function() {
      var result = scope.items.getTotals();
      expect(result.feesToday).toBe(500);
      expect(result.feesScheduled).toBe(60);
      expect(result.paymentsToday).toBe(1000);
      expect(result.paymentsScheduled).toBe(4000);
    });
  });

  describe('items.getStatus function', function () {

    it('should return the expected result when only same-day fees were sent', function () {
      queue.payments = {};
      delete queue.fees.fee2;
      run();
      expect(scope.items.getStatus('submitted', 'scheduled')).toBe('submitted');
    });

    it('should return the expected result when only scheduled fees were sent', function () {
      queue.payments = {};
      delete queue.fees.fee1;
      run();
      expect(scope.items.getStatus('submitted', 'scheduled')).toBe('scheduled');
    });

    it('should return the expected result when a mix of fees were sent', function () {
      queue.payments = {};
      run();
      expect(scope.items.getStatus('submitted', 'scheduled')).toBe('submitted and scheduled');
    });

    it('should return the expected result when only same-day payments were sent', function () {
      queue.fees = {};
      delete queue.payments.pmt2;
      run();
      expect(scope.items.getStatus('submitted', 'scheduled')).toBe('submitted');
    });

    it('should return the expected result when only scheduled payments were sent', function () {
      queue.fees = {};
      delete queue.payments.pmt1;
      run();
      expect(scope.items.getStatus('submitted', 'scheduled')).toBe('scheduled');
    });

    it('should return the expected result when a mix of items were sent', function () {
      run();
      expect(scope.items.getStatus('submitted', 'scheduled')).toBe('submitted and scheduled');
    });

  });

  describe('receipts logic', function() {
    it('should attach receipt URLs to the scope if present', function () {
      expect(scope.receiptUrls.length).toBe(2);
      expect(scope.receiptUrls[0]).toBe(receipts.getReceiptUrl('abc123'));
      expect(scope.receiptUrls[1]).toBe(receipts.getReceiptUrl('def456'));
    });

    it('should not add receipt URLs to the scope if not present', function () {
      transactionInfo.FinancialTransactionId = null;
      transactionInfo.UnappliedFundsTransactionId = '';
      run();
      expect(scope.receiptUrls.length).toBe(0);
    });

    it('should not add receipt URLs to the scope if parent object is null', function () {
      transactionInfo = null;
      run();
      expect(scope.receiptUrls.length).toBe(0);
    });

    it('viewReceipts - grouped by transaction function should open the receipts in new windows, close modal and transition to the payments state', function () {
      spyOn(dialog, 'close');
      spyOn(_window, 'open');
      spyOn(state, 'transitionTo');
      scope.format = 'grouped';
      scope.viewReceipts();
      expect(dialog.close).toHaveBeenCalled();
      expect(_window.open).toHaveBeenCalledWith('/receipt/viewMultiple/receipts?financialtransactionids=abc123', '_blank');
      expect(state.transitionTo).toHaveBeenCalledWith('payments');
    });
    it('viewReceipts - 1 Vin per page function should open the receipts in new windows, close modal and transition to the payments state', function () {
      spyOn(dialog, 'close');
      spyOn(_window, 'open');
      spyOn(state, 'transitionTo');
      scope.format = 'single';
      scope.viewReceipts();
      expect(dialog.close).toHaveBeenCalled();
      expect(_window.open).toHaveBeenCalledWith('/encodedReceipts?transactions=abc123', '_blank');
      expect(state.transitionTo).toHaveBeenCalledWith('payments');
    });
  });

  describe('close function', function() {
    it('close function should close modal', function () {
      spyOn(dialog, 'close');
      state.current = { name: 'checkout' };
      scope.close();
      expect(dialog.close).toHaveBeenCalled();
    });

    it('close function should send user to payments page if they remained on checkout during payment submission', function() {
      state.current = { name: 'checkout' };
      spyOn(state, 'transitionTo');
      scope.close();
      expect(state.transitionTo).toHaveBeenCalledWith('payments');
    });

    it('close function should not redirect user to payments page if they already navigated elsewhere', function() {
      state.current = { name: 'receipts' };
      spyOn(state, 'transitionTo');
      scope.close();
      expect(state.transitionTo).not.toHaveBeenCalled();
    });
  });
});
