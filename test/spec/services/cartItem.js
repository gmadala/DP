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
      AmountDue: 750,
      PrincipalDue: 350,
      FeesPaymentTotal: 100,
      InterestPaymentTotal: 250,
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
      result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
    });

    it('should add the necessary properties to the object', function() {
      expect(result.id).toBe('id1');
      expect(result.vin).toBe('vin1');
      expect(result.description).toBe('a description');
      expect(result.stockNum).toBe('stock1');

      expect(result.isFee).toBe(false);
      expect(result.paymentOption).toBe(PaymentOptions.TYPE_PAYMENT)

      expect(result.dueDate).toBe('2014-08-01');
      expect(result.scheduleDate).toBe(null);
      expect(result.overrideAddress).toBe(null);

      expect(typeof result.payment).toBe('object');
      expect(result.payment.amount).toBe(750);
      expect(result.payment.principal).toBe(350);
      expect(result.payment.fees).toBe(100);
      expect(result.payment.interest).toBe(250);
      expect(result.payment.cpp).toBe(50);
      expect(result.payment.additionalPrincipal).toBeDefined();

      expect(typeof result.payoff).toBe('object');
      expect(result.payoff.amount).toBe(5000);
      expect(result.payoff.principal).toBe(4000);
      expect(result.payoff.fees).toBe(500);
      expect(result.payoff.interest).toBe(250);
      expect(result.payoff.cpp).toBe(250);

      expect(typeof result.interest).toBe('object');
      expect(result.interest.amount).toBe(250);
      expect(result.interest.principal).toBe(0);
      expect(result.interest.fees).toBe(0);
      expect(result.interest.interest).toBe(250);
      expect(result.interest.cpp).toBe(0);

      expect(result.scheduledValues.payment).toBe(null);
      expect(result.scheduledValues.payoff).toBe(null);
      expect(result.scheduledValues.interest).toBe(null);
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
      it('should return the sum of principal, fees, interest, and cpp values for the selected payment option if none is provided', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYOFF);

        expect(result.getCheckoutAmount()).toBe(5000);
      });

      it('should return the sum of principal, fees, interest, and cpp values for a given payment type', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYOFF);

        expect(result.getCheckoutAmount(PaymentOptions.TYPE_PAYMENT)).toBe(750);
        expect(result.getCheckoutAmount(PaymentOptions.TYPE_PAYOFF)).toBe(5000);
        expect(result.getCheckoutAmount(PaymentOptions.TYPE_INTEREST)).toBe(250);
      })

      it('should return the sum of principal, fees, interest, and cpp values + payment.additionalPrincipal if there is extra principal', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);

        expect(result.getCheckoutAmount()).toBe(750);
        result.payment.additionalPrincipal = 50;
        expect(result.getCheckoutAmount()).toBe(800);
      });

      it('should return undefined if there was no option sent in and the cart item has no valid payment option set', function() {
        var result = CartItem.fromPayment(mockPayment, 'foo');

        expect(result.getCheckoutAmount()).not.toBeDefined();
      })

      it('should use the scheduledValues object for the given option if the payment is set to be scheduled', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
        result.scheduleDate = "2014-01-02";

        result.scheduledValues.payment = {
          principal: 10,
          interest: 5,
          fees: 5,
          cpp: 0
        };
        expect(result.getCheckoutAmount(PaymentOptions.TYPE_PAYMENT)).toBe(20);

        result.scheduledValues.payoff = {
          principal: 100,
          interest: 50,
          fees: 50,
          cpp: 0
        };
        expect(result.getCheckoutAmount(PaymentOptions.TYPE_PAYOFF)).toBe(200);

        result.scheduledValues.interest = {
          principal: 0,
          interest: 50,
          fees: 0,
          cpp: 0
        };
        expect(result.getCheckoutAmount(PaymentOptions.TYPE_INTEREST)).toBe(50);
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

    describe('setExtraPrincipal function', function() {
      beforeEach(function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
      });

      it('should set the additional principal value on the cart item payment object', function() {
        expect(result.payment.additionalPrincipal).toBe(0);
        result.setExtraPrincipal(45);
        expect(result.payment.additionalPrincipal).toBe(45);
      });

      it('should set the additional principal value of the cart item payment object and the scheduledValues object if the item is to be scheduled', function() {
        result.scheduleDate = '2014-10-03';
        result.scheduledValues.payment = {
          principal: 10,
          interest: 5,
          fees: 5,
          cpp: 0,
          additionalPrincipal: 0
        };

        expect(result.payment.additionalPrincipal).toBe(0);
        expect(result.scheduledValues.payment.additionalPrincipal).toBe(0);
        result.setExtraPrincipal(22);
        expect(result.payment.additionalPrincipal).toBe(22);
        expect(result.scheduledValues.payment.additionalPrincipal).toBe(22);
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
          QuotedInterestAmount: 250
        });
      });
    });

    describe('updateAmountsOnDate function', function() {
      var amts = {
          PaymentAmount: 100,
          PrincipalAmount: 4000,
          FeeAmount: 20,
          InterestAmount: 30,
          CollateralProtectionAmount: 10
        },
        myDate = new Date();

      it('should update the scheduleDate', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
        result.scheduleDate = '2013-10-03';

        result.updateAmountsOnDate(amts, myDate);
        expect(result.scheduleDate).toBe(myDate);
      });

      it('should update all 3 scheduledValues objects with the appropriate values', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
        expect(result.scheduledValues.payment).toBe(null);
        expect(result.scheduledValues.payoff).toBe(null);
        expect(result.scheduledValues.interest).toBe(null);

        result.updateAmountsOnDate(amts, '2014-10-04');

        expect(result.scheduledValues.payoff.principal).toBe(4000);
        expect(result.scheduledValues.payoff.fees).toBe(20);
        expect(result.scheduledValues.payoff.interest).toBe(30);
        expect(result.scheduledValues.payoff.cpp).toBe(10);

        expect(result.scheduledValues.payment.principal).toBe(350);
        expect(result.scheduledValues.payment.fees).toBe(20);
        expect(result.scheduledValues.payment.interest).toBe(30);
        expect(result.scheduledValues.payment.cpp).toBe(10);
        expect(result.scheduledValues.payment.additionalPrincipal).toBe(result.payment.additionalPrincipal);

        expect(result.scheduledValues.interest.principal).toBe(0);
        expect(result.scheduledValues.interest.fees).toBe(0);
        expect(result.scheduledValues.interest.interest).toBe(30);
        expect(result.scheduledValues.interest.cpp).toBe(0);

      });
    });

    describe('getBreakdown function', function() {
      it('should return the breakdown of principal/fees/interest/cpp for the given payment type', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYOFF);

        expect(result.getBreakdown(PaymentOptions.TYPE_PAYMENT)).toBe(result.payment);
        expect(result.getBreakdown(PaymentOptions.TYPE_PAYOFF)).toBe(result.payoff);
        expect(result.getBreakdown(PaymentOptions.TYPE_INTEREST)).toBe(result.interest);
      });

      it('should default to use the cart item\'s own paymentOption if the given option is invalid', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYOFF);
        expect(result.getBreakdown('fooOption')).toBe(result.payoff);
      });

      it('should return the scheduledValues breakdown opjects for the given payment type if the cartItem is scheduled', function() {
        var result = CartItem.fromPayment(mockPayment, PaymentOptions.TYPE_PAYMENT);
        result.scheduleDate = '2014-10-10';
        expect(result.getBreakdown(PaymentOptions.TYPE_PAYMENT)).toBe(result.scheduledValues.payment);
        expect(result.getBreakdown(PaymentOptions.TYPE_PAYOFF)).toBe(result.scheduledValues.payoff);
        expect(result.getBreakdown(PaymentOptions.TYPE_INTEREST)).toBe(result.scheduledValues.interest);
      });
    });
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
