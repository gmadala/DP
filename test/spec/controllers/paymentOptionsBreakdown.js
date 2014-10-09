'use strict';

describe('Controller: PaymentOptionsBreakdownCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var PaymentOptionsBreakdownCtrl,
    scope,
    CartItem,
    fromCartItemMock,
    fromVehicleDetailsMock,
    isOnQueueMock,
    dialogMock,
    PaymentOptions,
    paymentOptionsHelper,
    Payments,
    mockPayment,
    $httpBackend,
    run;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _paymentOptionsHelper_, _CartItem_, _PaymentOptions_, _Payments_, _$httpBackend_) {
    scope = $rootScope.$new();
    CartItem = _CartItem_;
    PaymentOptions = _PaymentOptions_;
    Payments = _Payments_;
    $httpBackend = _$httpBackend_;

    mockPayment = {
      Vin: 'vin1',
      FloorplanId: 'id123',
      AmountDue: 500,
      PrincipalDue: 300,
      FeesPaymentTotal: 100,
      InterestPaymentTotal: 100,
      CollateralProtectionPaymentTotal: 0,
      CurrentPayoff: 5000,
      PrincipalPayoff: 3000,
      FeesPayoffTotal: 1000,
      InterestPayoffTotal: 1000,
      CollateralProtectionPayoffTotal: 0,
    };

    fromCartItemMock = CartItem.fromPayment(mockPayment);

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

    // it('should not be set and an error should be thrown if the selected payment option is invalid', function() {
    //   var fn = function() {
    //     scope.selector.paymentOption = 'foo';
    //     scope.$digest();
    //   };

    //   expect(function() { fn(); }).toThrow('Invalid payment type');
    // });

    // it('should be set to equal the paymentObject\'s payment values if the chosen option is payment', function() {
    //   expect(scope.paymentBreakdown).toEqual({});

    //   scope.selector.paymentOption = PaymentOptions.TYPE_PAYMENT;
    //   scope.$digest();
    //   expect(scope.paymentBreakdown).toBe(fromCartItemMock.payment);
    //   expect(scope.total).toBe(500);
    // });

    // it('should be set to equal the paymentObject\'s payoff values if the chosen option is payoff', function() {
    //   expect(scope.paymentBreakdown).toEqual({});

    //   scope.selector.paymentOption = PaymentOptions.TYPE_PAYOFF;
    //   scope.$digest();
    //   expect(scope.paymentBreakdown).toBe(fromCartItemMock.payoff);
    //   expect(scope.total).toBe(5000);
    // });

    // it('should be set to equal the paymentObject\'s interest-only values if the chosen option is interest-only payment', function() {
    //   expect(scope.paymentBreakdown).toEqual({});

    //   scope.selector.paymentOption = PaymentOptions.TYPE_INTEREST;
    //   scope.$digest();
    //   expect(scope.paymentBreakdown).toBe(fromCartItemMock.interest);
    //   expect(scope.total).toBe(100);
    // });

    // it('should call updatePaymentAmountOnDate if the item is schedule and we do not have scheduled values for the chosen option', function() {
    //   fromCartItemMock.scheduleDate = moment('2014-10-03');
    //   run(fromCartItemMock);

    //   spyOn(Payments, 'updatePaymentAmountOnDate').andReturn();
    //   spyOn(scope.paymentObject, 'scheduledValuesForType').andReturn(false);
    //   spyOn(scope.paymentObject, 'getBreakdown').andReturn({
    //     principal: 64,
    //     fees: 32,
    //     interest: 16,
    //     cpp: 8
    //   });

    //   scope.selector.paymentOption = PaymentOptions.TYPE_PAYOFF;
    //   scope.$digest();
    //   expect(Payments.updatePaymentAmountOnDate).toHaveBeenCalled();
    //   expect(scope.paymentObject.getBreakdown).toHaveBeenCalledWith(scope.selector.paymentOption);
    // });
  });

  describe('additionalAmount value', function() {
    // it('should update the total value whenever it changes', function() {
    //   run(fromCartItemMock);
    //   scope.selector.paymentOption = PaymentOptions.TYPE_PAYMENT;
    //   scope.$digest();

    //   expect(scope.total).toBe(500);
    //   scope.selector.additionalAmount = 200;
    //   scope.$digest();
    //   expect(scope.total).toBe(700);
    // });

    // it('should be retained if the user switches to a different payment option and then returns to \'payment\'', function() {
    //   run(fromCartItemMock);
    //   scope.selector.paymentOption = PaymentOptions.TYPE_PAYMENT;
    //   scope.$digest();

    //   expect(scope.total).toBe(500);
    //   scope.selector.additionalAmount = 200;
    //   scope.$digest();
    //   expect(scope.total).toBe(700);

    //   scope.selector.paymentOption = PaymentOptions.TYPE_INTEREST;
    //   scope.$digest();
    //   expect(scope.total).toBe(100);

    //   scope.selector.paymentOption = PaymentOptions.TYPE_PAYMENT;
    //   scope.$digest();
    //   expect(scope.total).toBe(700);
    // });
  });

  describe('confirm function', function() {
    var shouldBeOnQueue;

    beforeEach(function() {
      shouldBeOnQueue = true;
      spyOn(dialogMock, 'close').andCallThrough();
      spyOn(Payments, 'isPaymentOnQueue').andCallFake(function() {
          return shouldBeOnQueue;
        });
      spyOn(Payments, 'getPaymentFromQueue').andReturn(fromCartItemMock);
      spyOn(Payments, 'addPaymentTypeToQueue').andReturn();
    });

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
      scope.selector.paymentOption = PaymentOptions.TYPE_PAYOFF;
      scope.$digest();

      scope.paymentOptionsForm = {
        $valid: true
      };

      scope.confirm();
      expect(Payments.isPaymentOnQueue).toHaveBeenCalled();
      expect(Payments.addPaymentTypeToQueue).toHaveBeenCalled();
      expect(Payments.getPaymentFromQueue).toHaveBeenCalled();
    });

    it('should not add the payment to the queue if it is already on there', function() {
      shouldBeOnQueue = true;
      isOnQueueMock = true;
      run(fromCartItemMock);
      scope.selector.paymentOption = PaymentOptions.TYPE_PAYOFF;
      scope.$digest();

      scope.paymentOptionsForm = {
        $valid: true
      };

      scope.confirm();
      expect(Payments.isPaymentOnQueue).toHaveBeenCalled();
      expect(Payments.addPaymentTypeToQueue).not.toHaveBeenCalled();
    });

    it('should update the additional principal if we chose the payment option', function() {
      shouldBeOnQueue = true;
      isOnQueueMock = true;
      run(fromCartItemMock);
      spyOn(fromCartItemMock, 'setExtraPrincipal').andCallThrough();

      scope.selector.paymentOption = PaymentOptions.TYPE_PAYMENT;

      scope.$digest();
      scope.paymentOptionsForm = {
        $valid: true
      };

      scope.confirm();
      expect(scope.paymentObject.setExtraPrincipal).toHaveBeenCalled();
    });
  });
});
