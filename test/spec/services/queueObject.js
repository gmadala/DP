'use strict';

describe('Value: queueObject', function () {

  beforeEach(module('nextgearWebApp'));

  var queueObject,
      mockObject;

  beforeEach(inject(function (_queueObject_) {
    queueObject = _queueObject_;

    // mock object has properties of both payments and fees, to simplify testing
    // so that we only need to mock a single object.
    mockObject = {
      Vin: 'vin1',
      Scheduled: false,

      // payment specific
      FloorplanId: 'id1',
      UnitDescription: 'a description',
      StockNumber: 'stock1',
      DueDate: '2014-08-01',
      ScheduledPaymentDate: null,

      // curtailment-specific
      AmountDue: 550,
      PrincipalDue: 350,
      FeesPaymentTotal: 100,
      InterestPaymentTotal: 50,
      CollateralProtectionPaymentTotal: 50,

      // payoff-specific
      CurrentPayoff: 5000,
      PrincipalPayoff: 4000,
      FeesPayoffTotal: 500,
      InterestPayoffTotal: 250,
      CollateralProtectionPayoffTotal: 250,

      // fee-specific
      ScheduledDate: null,
      FinancialRecordId: 'id2',
      FeeType: 'a type of fee',
      Description: 'fee description',
      Balance: 500,
      EffectiveDate: '2014-08-03'
    };

  }));

  it('should return an object with vin, isFee, isPayoff, and scheduleDate properties', function () {
    var result = queueObject(mockObject, false, false);

    expect(typeof result).toBe('object');
    expect(result.vin).toBe('vin1');
    expect(result.isFee).toBe(false);
    expect(result.isPayoff).toBe(false);
    expect(result.scheduled).toBe(false);
  });

  describe('fee object', function() {
    it('should add fee-specific properties to the return object', function() {
      var result = queueObject(mockObject, true);

      expect(result.vin).toBe('vin1');
      expect(result.isFee).toBe(true);
      expect(result.isPayoff).toBe(false);
      expect(result.scheduled).toBe(false);
      expect(result.financialRecordId).toBe('id2');
      expect(result.feeType).toBe('a type of fee');
      expect(result.description).toBe('fee description');
      expect(result.amount).toBe(500);
      expect(result.dueDate).toBe('2014-08-03');

      expect(result.scheduleDate).not.toBeDefined();
    });

    it('should add a scheduleDate property if the fee is scheduled', function() {
      mockObject.Scheduled = true;
      mockObject.ScheduledDate = '2014-08-05';

      var result = queueObject(mockObject, true);

      expect(result.scheduleDate).toBe('2014-08-05');
    });
  });

  describe('payment objects', function() {
    describe('curtailment object', function() {
      it('should create a curtailment object with curtailment amounts', function() {
        var result = queueObject(mockObject, false, false);

        expect(result.vin).toBe('vin1');
        expect(result.isFee).toBe(false);
        expect(result.isPayoff).toBe(false);
        expect(result.scheduled).toBe(false);
        expect(result.id).toBe('id1');
        expect(result.description).toBe('a description');
        expect(result.stockNum).toBe('stock1');
        expect(result.dueDate).toBe('2014-08-01');
        expect(result.amount).toBe(550);
        expect(result.principal).toBe(350);
        expect(result.fees).toBe(100);
        expect(result.interest).toBe(50);
        expect(result.collateralProtection).toBe(50);
        expect(result.overrideAddress).toBe(null);

        expect(result.scheduledDate).not.toBeDefined();
      });

      it('should add and populate a scheduleDate property if the curtailment is scheduled', function() {
        mockObject.Scheduled = true;
        mockObject.ScheduledPaymentDate = '2014-08-06';

        var result = queueObject(mockObject, false, false);
        expect(result.scheduled).toBe(true);
        expect(result.scheduleDate).toBe('2014-08-06');
      });
    });

    describe('payoff object', function() {
      it('should create a payoff object with payoff amounts', function() {
        var result = queueObject(mockObject, false, true);

        expect(result.vin).toBe('vin1');
        expect(result.isFee).toBe(false);
        expect(result.isPayoff).toBe(true);
        expect(result.scheduled).toBe(false);
        expect(result.id).toBe('id1');
        expect(result.description).toBe('a description');
        expect(result.stockNum).toBe('stock1');
        expect(result.dueDate).toBe('2014-08-01');
        expect(result.amount).toBe(5000);
        expect(result.principal).toBe(4000);
        expect(result.fees).toBe(500);
        expect(result.interest).toBe(250);
        expect(result.collateralProtection).toBe(250);
        expect(result.overrideAddress).toBe(null);

        expect(result.scheduledDate).not.toBeDefined();
      });

      it('should add and populate a scheduleDate property if the payoff is scheduled', function() {
        mockObject.Scheduled = true;
        mockObject.ScheduledPaymentDate = '2014-08-06';

        var result = queueObject(mockObject, false, true);
        expect(result.scheduled).toBe(true);
        expect(result.scheduleDate).toBe('2014-08-06');
      });
    });
  });
});
