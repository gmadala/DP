'use strict';

describe('Controller: ScheduleCheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ScheduleCheckoutCtrl,
    scope,
    dialog,
    payment,
    fee,
    possibleDates,
    Payments,
    PaymentOptions,
    CartItem,
    run;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _Payments_, _PaymentOptions_, _CartItem_) {
    dialog = {
      close: angular.noop
    };

    PaymentOptions = _PaymentOptions_;
    CartItem = _CartItem_;
    payment = CartItem.fromPayment({
      FloorplanId: 'floorplan123',
      DueDate: '2013-09-30',
      CurrentPayoff: 10000,
      PrincipalPayoff: 8000,
      FeesPayoffTotal: 800,
      InterestPayoffTotal: 900,
      CollateralProtectionPayoffTotal: 300,
      AmountDue: 1000,
      PrincipalDue: 800,
      FeesPaymentTotal: 80,
      InterestPaymentTotal: 90,
      CollateralProtectionPaymentTotal: 30
    }, PaymentOptions.TYPE_PAYMENT);

    fee = CartItem.fromFee({
      FinancialRecordId: 'feeId',
      EffectiveDate: '2013-09-29',
      FeeType: 'type of fee',
      Balance: 100
    });

    possibleDates = {
      '2013-09-30': true,
      '2013-09-29': true,
      '2013-09-28': true,
      '2013-09-27': true
    };

    Payments = _Payments_;

    // Some tests change items and reinject into controller (overriding first time this is run)
    run = function (type) {
      scope = $rootScope.$new();

      ScheduleCheckoutCtrl = $controller('ScheduleCheckoutCtrl', {
        $scope: scope,
        $uibModalInstance: dialog,
        payment: type === 'payment' && payment,
        fee: type === 'fee' && fee,
        possibleDates: possibleDates
      });
    };

    run('payment');
  }));

  it('should attach A COPY OF the payment being scheduled to the scope', function () {
    run('payment')
    expect(scope.model.payment).toBeDefined();
    expect(scope.model.payment).not.toBe(CartItem.fromPayment(payment, PaymentOptions.TYPE_PAYMENT));
    expect(scope.model.fee).toBeFalsy();
  });

  it('should attach the payment being scheduled to the scope', function () {
    run('fee');
    expect(scope.model.fee).toBeDefined();
    expect(scope.model.pay).toBeFalsy();
  });

  it('should attach an isPayment flag to the scope', function() {
    run('payment');
    expect(scope.isPayment).toBe(true);

    run('fee');
    expect(scope.isPayment).toBe(false);
  });

  it('should attach a getPaymentTotal function to the scope', function() {
    run('payment');
    expect(scope.model.getPaymentTotal).toBeDefined();
    expect(scope.model.getPaymentTotal()).toBe(1000);
  });

  it('should default selected date to the next available date if none is currently set', function () {
    expect(scope.model.selectedDate.toString()).toBe(new Date(2013, 8, 27).toString());
  });

  it('should default selected date to the current scheduled date for the payment if set', function () {
    payment.scheduleDate = new Date(2013, 0, 4);
    run('payment');
    expect(scope.model.selectedDate.toString()).toBe(new Date(2013, 0, 4).toString());
  });

  it('should store possible dates on the scope', function () {
    expect(scope.model.possibleDates).toBe(possibleDates);
  });

  describe('selectedDate watch functionality', function() {
    var $q,
        $httpBackend,
        clock,
        shouldSucceed;

    beforeEach(inject(function(_$q_, _$httpBackend_) {
      $q = _$q_;
      $httpBackend = _$httpBackend_;
      clock = sinon.useFakeTimers(moment([2013, 8, 1, 11, 18]).valueOf(), 'Date');
      shouldSucceed = true;

      spyOn(Payments, 'updatePaymentAmountOnDate').and.callFake(function() {
        if (shouldSucceed) {
          return $q.when({
            PaymentAmount: 64,
            PrincipalAmount: 36,
            FeeAmount: 16,
            InterestAmount: 8,
            CollateralProtectionAmount: 4
          });
        } else {
          return $q.reject(false);
        }
      });
    }));

    afterEach(function () {
      clock.restore();
    })

    it('should do nothing if the item we are scheduling is a fee', function() {
      run('fee');

      scope.model.selectedDate = new Date(2013, 8, 28);
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate).not.toHaveBeenCalled();
    });

    it('should do nothing if the new date is the same as the old date', function() {
      run('payment');

      scope.model.selectedDate = new Date(2013, 8, 27);
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate).not.toHaveBeenCalled();
    });

    it('should do nothing if the new date is not valid', function() {
      run('payment');
      scope.model.selectedDate = '2013-06-05';
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate).not.toHaveBeenCalled();
    });

    it('should call the updatePaymentAmountOnDate function if the date is valid', function() {
      run('payment');
      scope.$apply();

      expect(scope.model.breakdown.amount).toBe(1000);
      expect(scope.model.breakdown.principal).toBe(800);
      expect(scope.model.breakdown.fees).toBe(80);
      expect(scope.model.breakdown.interest).toBe(90);
      expect(scope.model.breakdown.cpp).toBe(30);

      scope.model.selectedDate = new Date(2013, 8, 29);
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate).toHaveBeenCalled();
      expect(scope.model.breakdown.amount).toBe(64);
      expect(scope.model.breakdown.principal).toBe(36);
      expect(scope.model.breakdown.fees).toBe(16);
      expect(scope.model.breakdown.interest).toBe(8);
      expect(scope.model.breakdown.cpp).toBe(4);
    });

    it('should properly update return payment amounts if interest-only', function() {
      run('payment');
      scope.model.payment.paymentOption = PaymentOptions.TYPE_INTEREST;
      scope.$apply();

      expect(scope.model.breakdown.amount).toBe(1000);
      expect(scope.model.breakdown.principal).toBe(800);
      expect(scope.model.breakdown.fees).toBe(80);
      expect(scope.model.breakdown.interest).toBe(90);
      expect(scope.model.breakdown.cpp).toBe(30);

      scope.model.selectedDate = new Date(2013, 8, 29);
      scope.$apply();
      expect(Payments.updatePaymentAmountOnDate).toHaveBeenCalled();
      expect(scope.model.breakdown.amount).toBe(8);
      expect(scope.model.breakdown.principal).toBe(0);
      expect(scope.model.breakdown.fees).toBe(0);
      expect(scope.model.breakdown.interest).toBe(8);
      expect(scope.model.breakdown.cpp).toBe(0);
    });

    it('should set updateInProgress to false on failure', function () {
      // spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.reject('whatever'));
      shouldSucceed = false;

      run('payment');
      scope.$apply();
      scope.model.selectedDate = new Date(2013, 8, 29);

      scope.$apply();

      expect(Payments.updatePaymentAmountOnDate).toHaveBeenCalled();
      expect(scope.updateInProgress).toBe(false);

    });

    // it('should set updateInProgress to false on success', function () {
      // spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));
      // spyOn(dialog, 'close');
      // scope.finalize(null);
      // scope.$apply();
      // expect(scope.submitInProgress).toBe(false);
      // expect(dialog.close).toHaveBeenCalled();
    // });
  });

  describe('checkDate function', function () {
    var clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers(moment([2013, 8, 1, 11, 18]).valueOf(), 'Date');
    });

    afterEach(function () {
      clock.restore();
    })

    it('should return true if called with a null date', function () {
      expect(scope.checkDate(null)).toBe(true);
      expect(scope.checkDate()).toBe(true);
    });

    it('should return false if called with a date before tomorrow', function () {
      expect(scope.checkDate(new Date())).toBe(false);
      expect(scope.checkDate(new Date(2000, 0, 1))).toBe(false);
    });

    it('should return false if called with a date after the payment due date', function () {
      expect(scope.checkDate(new Date(2013, 9, 1))).toBe(false);
    });

    it('should return false if called with a date in valid range but not listed in possible dates', function () {
      expect(scope.checkDate(new Date(2013, 8, 26))).toBe(false);
    });

    it('should return true if called with a date in valid range and listed in possible dates', function () {
      expect(scope.checkDate(new Date(2013, 8, 28))).toBe(true);
    });

  });


  describe('commit function', function () {

    beforeEach(function () {
      scope.dateForm = {
        $valid: false
      };
    });

    it('should clone form controller state to validity', function () {
      scope.commit();
      expect(angular.equals(scope.validity, scope.dateForm)).toBe(true);
      expect(scope.validity).not.toBe(scope.dateForm);
    });

    it('should abort if form is invalid', function () {
      spyOn(scope, 'finalize');
      scope.commit();
      expect(scope.finalize).not.toHaveBeenCalled();
    });

    it('should invoke finalize with selected date if form is valid', function () {
      var date = new Date();
      spyOn(scope, 'finalize');
      scope.dateForm.$valid = true;
      scope.model.selectedDate = date;
      scope.commit();
      expect(scope.finalize).toHaveBeenCalledWith(date);
    });

  });

  describe('finalize function', function () {
    var $q;

    beforeEach(inject(function (_$q_) {
      $q = _$q_;
    }));

    it('should set submitInProgress to true', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));
      scope.finalize();
      expect(scope.submitInProgress).toBe(true);
    });

    it('should invoke the model method to get new payment amount based on date', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));
      scope.finalize();
      expect(Payments.updatePaymentAmountOnDate).toHaveBeenCalled();
    });

    it('should not invoke the model method if it is a fee', function() {
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));
      run('fee');
      scope.finalize();
      expect(Payments.updatePaymentAmountOnDate).not.toHaveBeenCalled();
    })

    it('should pass the floorplan Id', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));
      scope.finalize();
      expect(Payments.updatePaymentAmountOnDate.calls.mostRecent().args[0].id).toBe('floorplan123');
    });

    it('should pass the provided date if present', function () {
      var date = new Date(2013, 1, 1);
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));
      scope.finalize(date);
      expect(Payments.updatePaymentAmountOnDate.calls.mostRecent().args[1]).toBe(date);
    });

    it('should pass the current date if no date is provided', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));
      scope.finalize(null);
      var date = Payments.updatePaymentAmountOnDate.calls.mostRecent().args[1];
      expect(moment().isSame(date, 'day')).toBe(true);
    });

    it('should pass the isPayoff value of the payment', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));

      var myIsPayoff = true;
      spyOn(payment, 'isPayoff').and.callFake(function() {
        return myIsPayoff;
      });
      scope.finalize();
      expect(Payments.updatePaymentAmountOnDate.calls.mostRecent().args[2]).toBe(true);

      myIsPayoff = false;
      scope.finalize();
      expect(Payments.updatePaymentAmountOnDate.calls.mostRecent().args[2]).toBe(false);
    });

    it('should set submitInProgress to false on failure and leave dialog open & payment unmodified', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.reject('whatever'));
      spyOn(dialog, 'close');
      payment.amount = 999;
      payment.scheduleDate = new Date();
      scope.finalize(null);
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialog.close).not.toHaveBeenCalled();
      expect(payment.amount).toBe(999);
      expect(payment.scheduleDate).not.toBe(null);
    });

    it('should set submitInProgress to false on success and close dialog', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));
      spyOn(dialog, 'close');
      scope.finalize(null);
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialog.close).toHaveBeenCalled();
    });

    it('should update payment scheduleDate to the provided value on success', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').and.returnValue($q.when(100));
      spyOn(dialog, 'close');
      payment.scheduleDate = new Date();
      scope.finalize(null);
      scope.$apply();
      expect(payment.scheduleDate).toBe(null);
    });

  });

  it('should have a close function that closes the modal without updating payment', function () {
    spyOn(dialog, 'close');
    scope.close();
    expect(payment.scheduleDate).toBeFalsy();
    expect(dialog.close).toHaveBeenCalled();
  });

});
