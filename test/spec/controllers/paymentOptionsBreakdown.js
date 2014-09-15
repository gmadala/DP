'use strict';

describe('Controller: PaymentOptionsBreakdownCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var PaymentOptionsBreakdownCtrl,
    scope,
    fromCartItemMock,
    fromVehicleDetailsMock,
    isOnQueueMock,
    dialogMock,
    paymentOptionsHelper,
    Payments,
    run;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _paymentOptionsHelper_) {
    scope = $rootScope.$new();

    fromCartItemMock = {
      id: 'id123',
      payment: {
        amount: 500,
        principal: 300,
        interest: 100,
        fees: 100,
        cpp: 0,
        additionalPrincipal: 0
      },
      payoff: {
        amount: 5000,
        principal: 3000,
        interest: 1000,
        fees: 1000,
        cpp: 0
      },
      interest: {
        amount: 100,
        principal: 0,
        interest: 100,
        fees: 0,
        cpp: 0
      }
    };
    paymentOptionsHelper = _paymentOptionsHelper_;
    fromVehicleDetailsMock = {
      FloorplanId: 'id456',
      AmountDue: 1000,
      PrincipalDue: 800,
      InterestPaymentTotal: 50,
      FeesPaymentTotal: 50,
      CollateralProtectionPaymentTotal: 100,
      CurrentPayoff: 10000,
      PrincipalPayoff: 8000,
      FeesPayoffTotal: 500,
      InterestPayoffTotal: 500,
      CollateralProtectionPayoffTotal: 1000
    };

    dialogMock = {
      close: angular.noop
    };

    spyOn(paymentOptionsHelper, 'fromVehicleDetails').andCallThrough();
    spyOn(paymentOptionsHelper, 'fromCartItem').andCallThrough();

    run = function(givenObject) {
      PaymentOptionsBreakdownCtrl = $controller('PaymentOptionsBreakdownCtrl', {
        $scope: scope,
        dialog: dialogMock,
        object: givenObject,
        isOnQueue: isOnQueueMock
      });
    };

  }));

  it('should attach a given payment object to the scope', function () {
    isOnQueueMock = false;
    run(fromVehicleDetailsMock);

    expect(paymentOptionsHelper.fromVehicleDetails).toHaveBeenCalled();
    expect(scope.paymentObject).toBeDefined();
  });

  it('should attach a given cartItem to the scope', function() {
    isOnQueueMock = true;
    run(fromCartItemMock);

    expect(paymentOptionsHelper.fromCartItem).toHaveBeenCalled();
    expect(scope.paymentObject).toBeDefined();
  });

  it('should have a close function to close the dialog', function() {
    run(fromCartItemMock);
    spyOn(dialogMock, 'close');

    scope.close();
    expect(dialogMock.close).toHaveBeenCalled();
  });

  describe('paymentBreakdown object', function () {
    beforeEach(function() {
      run(fromCartItemMock);
    });

    it('should exist', function () {
      expect(scope.paymentBreakdown).toBeDefined();
    });

    it('should be set to equal the paymentObject\'s payment values if the chosen option is payment', function() {
      expect(scope.paymentBreakdown).toEqual({});

      scope.selector.paymentOption = 'payment';
      scope.$digest();
      expect(scope.paymentBreakdown).toBe(fromCartItemMock.payment);
      expect(scope.total).toBe(500);
    });

    it('should be set to equal the paymentObject\'s payoff values if the chosen option is payoff', function() {
      expect(scope.paymentBreakdown).toEqual({});

      scope.selector.paymentOption = 'payoff';
      scope.$digest();
      expect(scope.paymentBreakdown).toBe(fromCartItemMock.payoff);
      expect(scope.total).toBe(5000);
    });

    it('should be set to equal the paymentObject\'s interest-only values if the chosen option is interest-only payment', function() {
      expect(scope.paymentBreakdown).toEqual({});

      scope.selector.paymentOption = 'interest';
      scope.$digest();
      expect(scope.paymentBreakdown).toBe(fromCartItemMock.interest);
      expect(scope.total).toBe(100);
    });
  });

  describe('additionalAmount value', function() {
    it('should update the total value whenever it changes', function() {
      run(fromCartItemMock);
      scope.selector.paymentOption = 'payment';
      scope.$digest();

      // expect(scope.selector.additionalAmount).toBe(0);
      expect(scope.total).toBe(500);
      scope.selector.additionalAmount = 200;
      scope.$digest();
      expect(scope.total).toBe(700);
    });
  });

  describe('confirm function', function() {
    var shouldBeOnQueue,
        Payments;

    beforeEach(inject(function(_Payments_) {
      Payments = _Payments_;
      shouldBeOnQueue = true;
      spyOn(dialogMock, 'close').andCallThrough();
      spyOn(Payments, 'isPaymentOnQueue').andCallFake(function() {
          return shouldBeOnQueue;
        });
      spyOn(Payments, 'getPaymentFromQueue').andReturn(fromCartItemMock);
      spyOn(Payments, 'addPaymentToQueue').andReturn();
    }));

    it('should do nothing if the form is invalid', function() {
      run(fromCartItemMock);
      scope.paymentOptionsForm = {
        $valid: false
      };

      scope.confirm();
      expect(dialogMock.close).not.toHaveBeenCalled();
    });

    it('should add the payment to the queue if it is not on there already', function() {
      shouldBeOnQueue = false;
      isOnQueueMock = false;
      run(fromVehicleDetailsMock);
      scope.selector.paymentOption = 'payoff';
      scope.$digest();

      scope.paymentOptionsForm = {
        $valid: true
      };

      scope.confirm();
      expect(Payments.isPaymentOnQueue).toHaveBeenCalled();
      expect(Payments.addPaymentToQueue).toHaveBeenCalled();
      expect(Payments.getPaymentFromQueue).toHaveBeenCalled();
    });

    it('should auto-cancel a previously scheduled payment if we are adding a payment to the queue', function() {
      spyOn(Payments, 'cancelScheduled').andReturn();
      fromVehicleDetailsMock.Scheduled = true;
      fromVehicleDetailsMock.WebScheduledPaymentId = 'abc123';
      fromVehicleDetailsMock.ScheduledPaymentDate = '2014-09-05';
      shouldBeOnQueue = false;
      isOnQueueMock = false;

      run(fromVehicleDetailsMock);
      scope.selector.paymentOption = 'payoff';
      scope.$digest();

      scope.paymentOptionsForm = {
        $valid: true
      };

      scope.confirm();
      expect(Payments.cancelScheduled).toHaveBeenCalledWith('abc123');
    });

    it('should not add the payment to the queue if it is already on there', function() {
      shouldBeOnQueue = true;
      isOnQueueMock = true;
      run(fromCartItemMock);
      scope.selector.paymentOption = 'payoff';
      scope.$digest();

      scope.paymentOptionsForm = {
        $valid: true
      };

      scope.confirm();
      expect(Payments.isPaymentOnQueue).toHaveBeenCalled();
      expect(Payments.addPaymentToQueue).not.toHaveBeenCalled();
    });

    it('should add any additional principal amount to the payment object if it is a payment', function() {
      shouldBeOnQueue = true;
      isOnQueueMock = true;
      run(fromCartItemMock);
      scope.selector.paymentOption = 'payment';
      scope.selector.additionalAmount = 500;
      scope.$digest();

      scope.paymentOptionsForm = {
        $valid: true
      };

      scope.confirm();

      expect(fromCartItemMock.payment.additionalPrincipal).toBe(500);
    });
  });
});
