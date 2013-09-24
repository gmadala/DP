'use strict';

describe('Controller: ScheduleCheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ScheduleCheckoutCtrl,
    scope,
    dialog,
    payment,
    possibleDates,
    Payments,
    run;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _Payments_) {
    dialog = {
      close: angular.noop
    };
    payment = {
      dueDate: '2013-09-30'
    };
    possibleDates = {
      '2013-09-30': true,
      '2013-09-29': true,
      '2013-09-28': true,
      '2013-09-27': true
    };
    Payments = _Payments_;

    spyOn(Payments, 'canPayNow').andReturn($q.when(true));

    run = function () {
      scope = $rootScope.$new();

      ScheduleCheckoutCtrl = $controller('ScheduleCheckoutCtrl', {
        $scope: scope,
        dialog: dialog,
        payment: payment,
        possibleDates: possibleDates
      });
    };

    run();
  }));

  it('should attach the payment being scheduled to the scope', function () {
    expect(scope.model.payment).toBe(payment);
  });

  it('should default selected date to the next available date if none is currently set', function () {
    expect(scope.model.selectedDate.toString()).toBe(new Date(2013, 8, 27).toString());
  });

  it('should default selected date to the current scheduled date for the payment if set', function () {
    payment.scheduleDate = new Date(2013, 0, 4);
    run();
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

    it('should set the payment scheduleDate to null', function () {
      payment.scheduleDate = 'foo';
      scope.removeSchedule();
      expect(payment.scheduleDate).toBe(null);
    });

    it('should close the dialog', function () {
      spyOn(dialog, 'close');
      scope.removeSchedule();
      expect(dialog.close).toHaveBeenCalled();
    });

  });

  describe('commit function', function () {

    beforeEach(function () {
      scope.dateForm = {
        $valid: true
      };
    });

    it('should clone form controller state to validity', function () {
      scope.commit();
      expect(angular.equals(scope.validity, scope.dateForm)).toBe(true);
      expect(scope.validity).not.toBe(scope.dateForm);
    });

    it('should abort if form is invalid', function () {
      scope.dateForm.$valid = false;
      scope.commit();
      expect(payment.scheduleDate).not.toBeDefined();
    });

    it('should set schedule date and close if form is valid', function () {
      spyOn(dialog, 'close');
      scope.commit();
      expect(payment.scheduleDate).toBe(scope.model.selectedDate);
      expect(dialog.close).toHaveBeenCalled();
    });

  });

  it('should have a close function that closes the modal without updating payment', function () {
    spyOn(dialog, 'close');
    scope.close();
    expect(payment.scheduleDate).not.toBeDefined();
    expect(dialog.close).toHaveBeenCalled();
  });

});
