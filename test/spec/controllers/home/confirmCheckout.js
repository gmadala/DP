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
    segmentio,
    _window,
    run;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $state, Receipts, _segmentio_, $window) {
    receipts = Receipts;
    state = $state;
    segmentio = _segmentio_;
    _window = $window;

    spyOn(segmentio, 'track');

    scope = $rootScope.$new();
    dialog = {
      close: angular.noop
    };
    queue = {
      fees: {
        'fee1': { id: 'bar1', amount: 1 },
        'fee2': { id: 'bar2', amount: 1, scheduleDate: new Date() }
      },
      payments: {
        'pmt1': { id: 'baz', amount: 10, revenueToTrack: 8 },
        'pmt2': { id: 'biz', scheduleDate: new Date(), amount: 100, revenueToTrack: 80 }
      }
    };
    transactionInfo = {
      FinancialTransactionId: 'abc123',
      UnappliedFundsTransactionId: 'def456'
    };

    run = function () {
      ConfirmCheckoutCtrl = $controller('ConfirmCheckoutCtrl', {
        $scope: scope,
        dialog: dialog,
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

  it('should have a function that calculates the total of items paid today', function () {
    expect(scope.items.todayTotal()).toBe(11);
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

  describe('analytics logic', function () {

    it('should track scheduled payments', function () {
      expect(segmentio.track.calls.length).toBe(1);
      expect(segmentio.track.mostRecentCall.args[0]).toBe('Schedule Payment');
    });

  });

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

  it('viewReceipts function should open the receipts in new windows, close modal and transition to the payments state', function () {
    spyOn(dialog, 'close');
    spyOn(_window, 'open');
    spyOn(state, 'transitionTo');
    scope.viewReceipts();
    expect(dialog.close).toHaveBeenCalled();
    expect(_window.open).toHaveBeenCalledWith(scope.receiptUrls[0]);
    expect(_window.open).toHaveBeenCalledWith(scope.receiptUrls[1]);
    expect(state.transitionTo).toHaveBeenCalledWith('home.payments');
  });

  it('close function should close modal', function () {
    spyOn(dialog, 'close');
    state.current = { name: 'home.checkout' };
    scope.close();
    expect(dialog.close).toHaveBeenCalled();
  });

  it('close function should send user to payments page if they remained on checkout during payment submission', function() {
    state.current = { name: 'home.checkout' };
    spyOn(state, 'transitionTo');
    scope.close();
    expect(state.transitionTo).toHaveBeenCalledWith('home.payments');
  });

  it('close function should not redirect user to payments page if they already navigated elsewhere', function() {
    state.current = { name: 'home.receipts' };
    spyOn(state, 'transitionTo');
    scope.close();
    expect(state.transitionTo).not.toHaveBeenCalled();
  })

});
