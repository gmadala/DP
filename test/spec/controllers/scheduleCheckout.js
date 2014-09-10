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
    run;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _Payments_) {
    dialog = {
      close: angular.noop
    };
    payment = {
      id: 'floorplan123',
      dueDate: '2013-09-30',
      isFee: false,
      updateAmountsOnDate: angular.noop
    };

    fee = {
      financialRecordId: 'feeId',
      dueDate: '2013-09-29',
      isFee: true,
      updateAmountsOnDate: angular.noop
    };

    possibleDates = {
      '2013-09-30': true,
      '2013-09-29': true,
      '2013-09-28': true,
      '2013-09-27': true
    };
    Payments = _Payments_;

    spyOn(Payments, 'canPayNow').andReturn($q.when(true));

    // Some tests change items and reinject into controller (overriding first time this is run)
    run = function (type) {
      scope = $rootScope.$new();

      ScheduleCheckoutCtrl = $controller('ScheduleCheckoutCtrl', {
        $scope: scope,
        dialog: dialog,
        payment: type === 'payment' && payment,
        fee: type === 'fee' && fee,
        possibleDates: possibleDates
      });
    };

    run('payment');
  }));

  it('should attach the payment being scheduled to the scope', function () {
    run('payment')
    expect(scope.model.payment).toBe(payment);
    expect(scope.model.fee).toBeFalsy();
  });

  it('should attach the payment being scheduled to the scope', function () {
    run('fee');
    expect(scope.model.fee).toBe(fee);
    expect(scope.model.pay).toBeFalsy();
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

  it('should default canPayNow to false', function () {
    expect(scope.model.canPayNow).toBe(false);
  });

  it('should call to determine if we are within business hours', function () {
    expect(Payments.canPayNow).toHaveBeenCalled();
  });

  it('should update canPayNow with results of call', function () {
    scope.$apply();
    expect(scope.model.canPayNow).toBe(true);
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

  describe('removeSchedule function', function () {

    it('should invoke finalize with a null schedule date', function () {
      spyOn(scope, 'finalize');
      scope.removeSchedule();
      expect(scope.finalize).toHaveBeenCalledWith(null);
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
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(100));
      debugger;
      scope.finalize();
      expect(scope.submitInProgress).toBe(true);
    });

    it('should invoke the model method to get new payment amount based on date', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(100));
      scope.finalize();
      expect(Payments.updatePaymentAmountOnDate).toHaveBeenCalled();
    });

    it('should pass the floorplan Id', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(100));
      scope.finalize();
      expect(Payments.updatePaymentAmountOnDate.mostRecentCall.args[0].id).toBe('floorplan123');
    });

    it('should pass the provided date if present', function () {
      var date = new Date(2013, 1, 1);
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(100));
      scope.finalize(date);
      expect(Payments.updatePaymentAmountOnDate.mostRecentCall.args[1]).toBe(date);
    });

    it('should pass the current date if no date is provided', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(100));
      scope.finalize(null);
      var date = Payments.updatePaymentAmountOnDate.mostRecentCall.args[1];
      expect(moment().isSame(date, 'day')).toBe(true);
    });

    it('should pass the isPayoff value of the payment', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(100));
      payment.isPayoff = true;
      scope.finalize();
      expect(Payments.updatePaymentAmountOnDate.mostRecentCall.args[2]).toBe(true);

      payment.isPayoff = false;
      scope.finalize();
      expect(Payments.updatePaymentAmountOnDate.mostRecentCall.args[2]).toBe(false);
    });

    it('should set submitInProgress to false on failure and leave dialog open & payment unmodified', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.reject('whatever'));
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
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(100));
      spyOn(dialog, 'close');
      scope.finalize(null);
      scope.$apply();
      expect(scope.submitInProgress).toBe(false);
      expect(dialog.close).toHaveBeenCalled();
    });

    it('should update payment scheduleDate to the provided value on success', function () {
      spyOn(Payments, 'updatePaymentAmountOnDate').andReturn($q.when(100));
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
    expect(payment.scheduleDate).not.toBeDefined();
    expect(dialog.close).toHaveBeenCalled();
  });

});
