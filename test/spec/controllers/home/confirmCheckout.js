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
    run;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $state, Receipts, _segmentio_) {
    receipts = Receipts;
    state = $state;
    segmentio = _segmentio_;

    spyOn(segmentio, 'track');

    scope = $rootScope.$new();
    dialog = {
      close: angular.noop
    };
    queue = {
      fees: {
        'fee1': { id: 'bar', amount: 1 }
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

  it('should attach array of fees to the scope', function () {
    expect(scope.items.fees.length).toBe(1);
    expect(scope.items.fees[0].id).toBe('bar');
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

    it('should return the expected result when only fees were sent', function () {
      queue.payments = {};
      run();
      expect(scope.items.getStatus('submitted', 'scheduled')).toBe('submitted');
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

    it('should track immediate payments (including fees), with a revenue total', function () {
      expect(segmentio.track.calls.length).toBe(2);
      expect(segmentio.track.calls[0].args[0]).toBe('Make Immediate Payment');
      expect(segmentio.track.calls[0].args[1]).toBeDefined();
      expect(segmentio.track.calls[0].args[1].revenue).toBe(9);
    });

    it('should track scheduled payments, leaving revenue for later tracking by server', function () {
      expect(segmentio.track.calls.length).toBe(2);
      expect(segmentio.track.mostRecentCall.args[0]).toBe('Schedule Payment');
      expect(segmentio.track.mostRecentCall.args[1]).not.toBeDefined();
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

  it('viewReceipts function should transition to the receipts state and close modal', function () {
    spyOn(dialog, 'close');
    spyOn(state, 'transitionTo');
    scope.viewReceipts();
    expect(dialog.close).toHaveBeenCalled();
    expect(state.transitionTo).toHaveBeenCalledWith('home.receipts');
  });

  it('close function should transition to the receipts state and close modal', function () {
    spyOn(dialog, 'close');
    spyOn(state, 'transitionTo');
    scope.close();
    expect(dialog.close).toHaveBeenCalled();
    expect(state.transitionTo).toHaveBeenCalledWith('home.payments');
  });

});
