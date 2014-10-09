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
