'use strict';

describe('Service: cartItem', function () {

  beforeEach(module('nextgearWebApp'));

  var CartItem,
  VehicleCartItem,
  FeeCartItem,
  mockFee,
  mockPayment,
  mockScheduled,
  PaymentOptions;

  beforeEach(inject(function (_CartItem_, _VehicleCartItem_, _FeeCartItem_, _PaymentOptions_) {
    CartItem = _CartItem_;
    PaymentOptions = _PaymentOptions_;

    // mock object has properties of both payments and fees, to simplify testing
    // so that we only need to mock a single object.
    mockFee = {
      Vin: 'vin1',
      Scheduled: false,
      FinancialRecordId: 'id2',
      FeeType: 'a type of fee',
      Description: 'fee description',
      Balance: 500,
      EffectiveDate: '2014-08-03'
    };

    mockPayment = {
      Vin: 'vin1',
      Scheduled: false,
      DueDate: '2014-08-01',
      ScheduledPaymentDate: null,
      FloorplanId: 'id1',
      UnitDescription: 'a description',
      StockNumber: 'stock1',
      AmountDue: 550,
      PrincipalDue: 350,
      FeesPaymentTotal: 100,
      InterestPaymentTotal: 50,
      CollateralProtectionPaymentTotal: 50,
      CurrentPayoff: 5000,
      PrincipalPayoff: 4000,
      FeesPayoffTotal: 500,
      InterestPayoffTotal: 250,
      CollateralProtectionPayoffTotal: 250,
    };

    mockScheduled = {
      vin: 'vin2',
      scheduledDate: '2014-09-01',
      floorplanId: 'id2',
      description: 'a scheduled payment',
      stockNumber: 'stock2',
      curtailmentDueDate: '2014-08-27',
      payoffAmount: 5000,
      principalPayoff: 4000,
      PrincipalDue: 2000,
      FeesPayoffTotal: 500,
      InterestPayoffTotal: 250,
      CollateralProtectionPayoffTotal: 250,
    };
  }));

  describe('FeeCartItem object', function() {
    var result;

    beforeEach(function() {
      result = CartItem.fromFee(mockFee);
    });

    it('should add the necessary properties to the object', function() {
      expect(result.vin).toBe('vin1');
      expect(result.isFee).toBe(true);
      expect(result.scheduled).toBe(false);
      expect(result.financialRecordId).toBe('id2');
      expect(result.feeType).toBe('a type of fee');
      expect(result.description).toBe('fee description');
      expect(result.amount).toBe(500);
      expect(result.dueDate).toBe('2014-08-03');

      expect(result.scheduleDate).not.toBeDefined();
    });

    it('should have a getCheckoutAmount function that returns the fee balance', function() {
      expect(typeof result.getCheckoutAmount).toBe('function');
      expect(result.getCheckoutAmount()).toBe(500);
    });

    describe('getApiRequestObject function', function() {
      it('should return a properly formatted object that can be sent to the api', function() {
        result.scheduled = true;
        result.scheduleDate = moment('2014-10-12');

        expect(result.getApiRequestObject()).toEqual({
          FinancialRecordId: 'id2',
          ScheduledPaymentDate: '2014-10-12'
        });
      });

      it('should return null if the fee is not scheduled', function() {
        result.scheduled = false;
        result.scheduleDate = null;

        expect(result.getApiRequestObject()).toEqual({
          FinancialRecordId: 'id2',
          ScheduledPaymentDate: null
        });
      });
    });
  });

  describe('VehicleCartItem object', function() {
    var result;

    beforeEach(function() {
      result = CartItem.fromPayment(mockPayment, false);
    });

    it('should add the necessary properties to the object', function() {
      expect(result.id).toBe('id1');
      expect(result.vin).toBe('vin1');
      expect(result.description).toBe('a description');
      expect(result.stockNum).toBe('stock1');

      expect(result.isFee).toBe(false);

      expect(result.dueDate).toBe('2014-08-01');
      expect(result.scheduled).toBe(false);
      expect(result.overrideAddress).toBe(null);

      expect(typeof result.payment).toBe('object');
      expect(result.payment.amount).toBe(550);
      expect(result.payment.principal).toBe(350);
      expect(result.payment.fees).toBe(100);
      expect(result.payment.interest).toBe(50);
      expect(result.payment.cpp).toBe(50);
      expect(result.payment.additionalPrincipal).toBeDefined();

      expect(typeof result.payoff).toBe('object');
      expect(result.payoff.amount).toBe(5000);
      expect(result.payoff.principal).toBe(4000);
      expect(result.payoff.fees).toBe(500);
      expect(result.payoff.interest).toBe(250);
      expect(result.payoff.cpp).toBe(250);
    });

    describe('isPayoff function', function() {
      it('should return true if the payment is a payoff', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYOFF);

        expect(result.isPayoff()).toBe(true);
      });

      it('should return false if the payment is a curtailment or interest-only payment', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
        expect(result.isPayoff()).toBe(false);

        result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_INTEREST);
        expect(result.isPayoff()).toBe(false);
      });
    });

    describe('getCheckoutAmount function', function() {
      it('should return the payoff.amount value for a payoff', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYOFF);

        expect(result.getCheckoutAmount()).toBe(5000);
      });

      it('should return the interest amount value for an interest-only payment', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_INTEREST);

        expect(result.getCheckoutAmount()).toBe(50);
      });

      it('should return payment.amount + payment.additionalPrincipal for a curtailment payment (with no params)', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);

        expect(result.getCheckoutAmount()).toBe(550);
        result.payment.additionalPrincipal = 50;
        expect(result.getCheckoutAmount()).toBe(600);
      });

      it('should return only payment.amount (no principal) for a curtailment payment (with noAdditionalPrincipal flag set to true)', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);

        result.payment.additionalPrincipal = 50;
        expect(result.getCheckoutAmount()).toBe(600);
        expect(result.getCheckoutAmount(true)).toBe(550);
      });
    });

    describe('getExtraPrincipal function', function() {
      it('should return a falsy value if this is a payoff', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYOFF);
        expect(result.getExtraPrincipal()).toBeFalsy();
      });

      it('should return 0 if this is a payment but we have no additionalPrincipal added', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
        expect(result.getExtraPrincipal()).toBe(0);
      });

      it('should return our extra principal value if any has been added', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
        result.payment.additionalPrincipal = 45;
        expect(result.getExtraPrincipal()).toBe(45);
      });
    });

    describe('getApiRequestObject function', function() {
      it('should return a properly formatted object that can be sent to the api', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYOFF);
        result.scheduled = true;
        result.scheduleDate = moment('2014-10-15');

        expect(result.getApiRequestObject()).toEqual({
          FloorplanId: 'id1',
          ScheduledPaymentDate: '2014-10-15',
          IsPayoff: true,
          IsInterestOnly: false,
          AdditionalPrincipalAmount: 0,
          QuotedInterestAmount: 0
        });

        var resultTwo = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
        resultTwo.payment.additionalPrincipal = 500;
        expect(resultTwo.getApiRequestObject()).toEqual({
          FloorplanId: 'id1',
          ScheduledPaymentDate: null,
          IsPayoff: false,
          IsInterestOnly: false,
          AdditionalPrincipalAmount: 500,
          QuotedInterestAmount: 0
        });

        var resultThree = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_INTEREST);
        expect(resultThree.getApiRequestObject()).toEqual({
          FloorplanId: 'id1',
          ScheduledPaymentDate: null,
          IsPayoff: false,
          IsInterestOnly: true,
          AdditionalPrincipalAmount: 0,
          QuotedInterestAmount: 50
        });
      });
    });

    describe('updateAmountsOnDate function', function() {
      var amts = {
        PaymentAmount: 100,
        PrincipalAmount: 40,
        FeeAmount: 20,
        InterestAmount: 20,
        CollateralProtectionAmount: 20
      };

      it('should set the payoff amounts to the given amounts if item is a payoff', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYOFF);
        result.updateAmountsOnDate(amts);
        expect(result.payoff.amount).toBe(100);
        expect(result.payoff.principal).toBe(40);
        expect(result.payoff.fees).toBe(20);
        expect(result.payoff.interest).toBe(20);
        expect(result.payoff.cpp).toBe(20);
      });

      it('should set the payment amounts to the given amounts if item is a curtailment payment', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
        result.updateAmountsOnDate(amts);
        expect(result.payment.amount).toBe(100);
        expect(result.payment.principal).toBe(40);
        expect(result.payment.fees).toBe(20);
        expect(result.payment.interest).toBe(20);
        expect(result.payment.cpp).toBe(20);
      });

      it('should set the interest-only amounts to the given amounts if item is an interest-only payment', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_INTEREST);
        result.updateAmountsOnDate(amts);
        expect(result.interest.amount).toBe(20);
        expect(result.interest.principal).toBe(0);
        expect(result.interest.fees).toBe(0);
        expect(result.interest.interest).toBe(20);
        expect(result.interest.cpp).toBe(0);
      });
    })
  });

  describe('scheduled payment scenario', function() {
    it('should map the property names to make a payment object, and use that to create a new VehicleCartItem', function() {
      spyOn(CartItem, 'fromScheduledPayment').andCallThrough();
      var result = CartItem.fromScheduledPayment(mockScheduled);

      expect(result.id).toBe('id2');
      expect(result.payment).toBeDefined();
      expect(result.payoff).toBeDefined();
    });
  });
});
