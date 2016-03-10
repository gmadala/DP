'use strict';

describe("Model: Payments", function () {

  beforeEach(module('nextgearWebApp'));

  var payments,
    httpBackend,
    urlParser,
    cartItem,
    PaymentOptions;

  beforeEach(inject(function ($httpBackend, Payments, URLParser, CartItem, _PaymentOptions_) {
    payments = Payments;
    httpBackend = $httpBackend;
    urlParser = URLParser;
    cartItem = CartItem;
    PaymentOptions = _PaymentOptions_;
  }));

  describe('requestUnappliedFundsPayout method', function () {
    var request;

    beforeEach(function () {
      httpBackend.expectPOST('/payment/payoutUnappliedFunds').respond(function(method, url, data) {
        request = angular.fromJson(data);
        return [200, {
          "Success": true,
          "Message": null
        }, {}];
      });
    });

    it('should return a promise', function () {
      var ret = payments.requestUnappliedFundsPayout();
      expect(typeof ret.then).toBe('function');
    });

    it('should make the expected http request', function () {
      payments.requestUnappliedFundsPayout();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the expected data', function () {
      payments.requestUnappliedFundsPayout('200', 'foo');
      httpBackend.flush();
      expect(request.RequestAmount).toBe(200);
      expect(request.BankAccountId).toBe('foo');
    });
  });

  describe('filterValues property', function () {
    it('should have the expected values', function () {
      expect(payments.filterValues).toBeDefined();
      expect(payments.filterValues.ALL).toBeDefined();
      expect(payments.filterValues.TODAY).toBeDefined();
      expect(payments.filterValues.THIS_WEEK).toBeDefined();
      expect(payments.filterValues.RANGE).toBeDefined();
    });
  });

  describe('search method', function () {
    var paginate,
      $q,
      defaultCriteria = {
        query: '',
        startDate: null,
        endDate: null,
        filter: ''
      },
      searchResults = [],
      callParams,
      respondFnc = function(method, url) {
        callParams = urlParser.extractParams(url);
        return [200, {
          Success: true,
          Data: {
            PaymentRowCount: 20,
            AvailableUnappliedFundsBalance: 21.6,
            SearchResults: searchResults
          }
        }, {}];
      };

    beforeEach(inject(function (Paginate, User, _$q_) {
      paginate = Paginate;
      $q = _$q_;
      httpBackend.whenGET(/\/payment\/search.*/).respond(respondFnc);
      spyOn(User, 'getInfo').and.returnValue($q.when({ BusinessNumber: '123' }));
    }));

    it('should call the expected API path', function () {
      httpBackend.expectGET(/\/payment\/search.*/);
      payments.search(defaultCriteria);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should ask for items sorted by earliest due first', function () {
      payments.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('DueDate');
      expect(callParams.OrderByDirection).toBe('ASC');
    });

    it('should ask for items sorted by latest due first if sortDesc is true', function () {
      var tempCriteria = angular.copy(defaultCriteria);
      tempCriteria.sortDesc = true;
      payments.search(tempCriteria);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('DueDate');
      expect(callParams.OrderByDirection).toBe('DESC');
    });

    it('should ask for items sorted by arbitrary column if sortField is set', function () {
      var tempCriteria = angular.copy(defaultCriteria);
      tempCriteria.sortField = 'arbitraryField';
      payments.search(tempCriteria);
      httpBackend.flush();
      expect(callParams.OrderBy).toBe('arbitraryField');
      expect(callParams.OrderByDirection).toBe('ASC');
    });

    it('should provide a page size', function () {
      payments.search(defaultCriteria);
      httpBackend.flush();
      expect(isNaN(parseInt(callParams.PageSize, 10))).toBe(false);
    });

    it('should start on the first page if a paginator is not provided', function () {
      payments.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.PageNumber).toBe(paginate.firstPage().toString());
    });

    it('should start on the next page if a paginator is provided', function () {
      payments.search(defaultCriteria, {
        nextPage: function () {
          return 11;
        }
      });
      httpBackend.flush();
      expect(callParams.PageNumber).toBe('11');
    });

    it('should save the unapplied funds available from results', function () {
      payments.search(defaultCriteria);
      httpBackend.flush();
      expect(payments.getAvailableUnappliedFunds()).toBe(21.6);
    });

    it('should add a paginator to the results', function () {
      var output = {};
      payments.search(defaultCriteria).then(function (results) {
        output = results;
      });
      httpBackend.flush();
      expect(output.$paginator).toBeDefined();
      expect(output.$paginator.nextPage()).toBe(2);
    });

    it('should add the appropriate $titleURL to payments', function () {
      var output = {};
      searchResults = [
        {
          StockNumber: '456'
        }
      ];
      payments.search(defaultCriteria).then(function (results) { output = results; });
      httpBackend.flush();
      expect(output.SearchResults[0].$titleURL).toBe('/floorplan/title/123-456/0/Title_456');
    });

    it('should NOT send a Keyword if search term is empty/null', function () {
      payments.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.Keyword).not.toBeDefined();
    });

    it('should send the search term as Keyword, if present', function () {
      payments.search(angular.extend({}, defaultCriteria, {query: 'foo'}));
      httpBackend.flush();
      expect(callParams.Keyword).toBe('foo');
    });

    it('should not send startDate or endDate if filter is all', function () {
      payments.search(angular.extend({}, defaultCriteria, {
        startDate: new Date(),
        endDate: new Date(),
        filter: payments.filterValues.ALL
      }));
      httpBackend.flush();
      expect(callParams.DueDateStart).not.toBeDefined();
      expect(callParams.DueDateEnd).not.toBeDefined();
    });

    it('should send the current date for startDate and endDate if filter is today', function () {
      payments.search(angular.extend({}, defaultCriteria, {
        filter: payments.filterValues.TODAY
      }));
      httpBackend.flush();
      expect(callParams.DueDateStart).toBe(moment().format('YYYY-MM-DD'));
      expect(callParams.DueDateEnd).toBe(moment().format('YYYY-MM-DD'));
    });

    it('should send the start and end of the current week if filter is this week', function () {
      payments.search(angular.extend({}, defaultCriteria, {
        filter: payments.filterValues.THIS_WEEK
      }));
      httpBackend.flush();
      expect(callParams.DueDateStart).toBe(moment().startOf('week').format('YYYY-MM-DD'));
      expect(callParams.DueDateEnd).toBe(moment().endOf('week').format('YYYY-MM-DD'));
    });

    it('should send whatever dates are passed if filter is range', function () {
      payments.search(angular.extend({}, defaultCriteria, {
        startDate: moment([2013, 0 , 1]).toDate(),
        endDate: moment([2013, 0 , 2]).toDate(),
        filter: payments.filterValues.RANGE
      }));
      httpBackend.flush();
      expect(callParams.DueDateStart).toBe('2013-01-01');
      expect(callParams.DueDateEnd).toBe('2013-01-02');
    });

    it('should gracefully omit missing dates if filter is range', function () {
      payments.search(angular.extend({}, defaultCriteria, {
        startDate: new Date(2013, 0 , 1),
        endDate: null,
        filter: payments.filterValues.RANGE
      }));
      httpBackend.flush();
      expect(callParams.DueDateStart).toBe('2013-01-01');
      expect(callParams.DueDateEnd).not.toBeDefined();
    });

    it('should include inventory location', function () {
      payments.search(angular.extend({}, defaultCriteria, {
        inventoryLocation: {AddressId: 'businessID'}
      }));
      httpBackend.flush();
      expect(callParams.PhysicalInventoryAddressIds).toBe('businessID');
    });

    it('should not include inventory location', function () {
      payments.search(angular.extend({}, defaultCriteria, {
      }));
      httpBackend.flush();
      expect(callParams.PhysicalInventoryAddressIds).not.toBeDefined();
    });
  });

  describe('fetchFees function', function () {
    beforeEach(function () {
      httpBackend.whenGET('/payment/getaccountfees').respond({
        Success: true,
        Data: [
          'bar'
        ]
      });
    });

    it('should make the expected HTTP request', function () {
      httpBackend.expectGET('/payment/getaccountfees');
      payments.fetchFees();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise that resolves to the returned data', function () {
      var out = null;
      payments.fetchFees().then(function (result) {
        out = result;
      });
      httpBackend.flush();
      expect(out.length).toBe(1);
      expect(out[0]).toBe('bar');
    });

  });

  describe('get/setAvailableUnappliedFunds functions', function () {
    it('should store the value and return it when asked', function () {
      payments.setAvailableUnappliedFunds(234.56);
      expect(payments.getAvailableUnappliedFunds()).toBe(234.56);
    });
  });

  describe('addPaymentToQueue function + isPaymentOnQueue', function () {
    it('should add payments to the queue', function () {
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        StockNumber: 's123',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        PrincipalDue: 800,
        DueDate: '2013-01-01'
      };
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
      payments.addPaymentToQueue(payment, false);
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(PaymentOptions.TYPE_PAYMENT);
    });

    it('should add payoffs to the queue', function () {
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        StockNumber: 's123',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        PrincipalPayoff: 4600,
        DueDate: '2013-01-01'
      };
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
      payments.addPayoffToQueue(payment, false);

      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(PaymentOptions.TYPE_PAYOFF);
    });

    xit('should track payments/payoffs being added to the queue', inject(function (segmentio) {
      spyOn(segmentio, 'track');
      payments.addPaymentToQueue({});
      expect(segmentio.track).toHaveBeenCalledWith('Add to Basket');
    }));

    it('should add scheduled payments to the queue', function() {
      var schPayment = {
        floorplanId: 'floorplan1',
        vin: 'someVin',
        stockNumber: 's123',
        description: 'some description',
        scheduledDate: '2013-01-08',
        paymentAmount: 1000,
        payoffAmount: 6000,
        principalPayoff: 4000,
        FeesPayoffTotal: 1000,
        InterestPayoffTotal: 800,
        CollateralProtectionPayoffTotal: 200,
        curtailmentDueDate: '2013-01-01',
      };
      spyOn(cartItem, 'fromScheduledPayment').and.callThrough();

      expect(payments.isPaymentOnQueue(schPayment.floorplanId)).toBe(false);
      payments.addPaymentToQueue(schPayment, 'payoff', true/*isScheduled*/);
      expect(cartItem.fromScheduledPayment).toHaveBeenCalled();
      expect(payments.isPaymentOnQueue(schPayment.floorplanId)).toBe('payoff');
    });
  });

  describe('addFeeToQueue function + isFeeOnQueue', function () {
    it('should add fees to the queue', function () {
      var fee = {
        FinancialRecordId: 'fee1',
        Vin: 'someVin',
        Decription: 'fee description',
        Balance: 350.85,
        FeeType: 'foo',
        EffectiveDate: '2013-01-02'
      };
      expect(payments.isFeeOnQueue(fee.FinancialRecordId)).toBe(false);
      payments.addFeeToQueue(fee);
      expect(payments.isFeeOnQueue(fee.FinancialRecordId)).toBe(true);
    });

    xit('should track fees being added to the queue', inject(function (segmentio) {
      spyOn(segmentio, 'track');
      payments.addFeeToQueue({});

      expect(segmentio.track).toHaveBeenCalledWith('Add to Basket');
    }));
  });

  describe('removeFromQueue', function() {
    it('should call removeFeeFromQueue if item to remove is a fee', function() {
      var fee = {
        FinancialRecordId: 'fee123'
      };

      spyOn(payments, 'removeFeeFromQueue').and.returnValue({});

      payments.addFeeToQueue(fee);
      payments.removeFromQueue(payments.getPaymentQueue().fees.fee123);
      expect(payments.removeFeeFromQueue).toHaveBeenCalled();
    });

    it('should call removePaymentFromQueue if item to remove is a payment', function() {
      var payment = {
        FloorplanId: 'payment123'
      };

      spyOn(payments, 'removePaymentFromQueue').and.returnValue({});

      payments.addPaymentToQueue(payment);
      payments.removeFromQueue(payments.getPaymentQueue().payments.payment123);
      expect(payments.removePaymentFromQueue).toHaveBeenCalled();
    });
  })

  describe('removePaymentFromQueue', function () {
    it('should remove payments from the queue', function () {
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        StockNumber: 's123',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        DueDate: '2013-01-01'
      };
      payments.addPaymentToQueue(payment, 'payment');
      payments.removePaymentFromQueue(payment.FloorplanId);
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
    });

    it('should remove payoffs from the queue', function () {
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        StockNumber: 's123',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        DueDate: '2013-01-01'
      };
      payments.addPaymentToQueue(payment, 'payoff');
      payments.removePaymentFromQueue(payment.FloorplanId);
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
    });

  });

  describe('removeFeeFromQueue', function () {
    it('should remove fees from the queue', function () {
      var fee = {
        FinancialRecordId: 'fee1',
        Vin: 'someVin',
        Decription: 'fee description',
        Balance: 350.85,
        FeeType: 'foo',
        EffectiveDate: '2013-01-02'
      };
      payments.addFeeToQueue(fee);
      payments.removeFeeFromQueue(fee.FinancialRecordId);
      expect(payments.isFeeOnQueue(fee.FinancialRecordId)).toBe(false);
    });
  });

  describe('getPaymentQueue function', function () {
    it('should include the fees hash table with expected fee data', function () {
      payments.addFeeToQueue({ FinancialRecordId: 'finId1' });

      var content = payments.getPaymentQueue();
      expect(content.fees).toBeDefined();

      var items = _.map(content.fees);
      expect(items.length).toBe(1);
    });

    it('should include the payments hash table with expected payment data', function () {
      var content = payments.getPaymentQueue();
      expect(content.payments).toBeDefined();

      // this is deliberately AFTER the queue content retrieval to test that we're getting "live" objects
      payments.addPaymentToQueue({ FloorplanId: 'floorId1' }, false);

      var items = _.map(content.payments);
      expect(items.length).toBe(1);
    });

    it('should expose an isEmpty function that calculates whether the queue is empty', function () {
      var queue = payments.getPaymentQueue();

      expect(queue.isEmpty()).toBe(true);

      payments.addFeeToQueue({ FinancialRecordId: 'finId1'});
      expect(queue.isEmpty()).toBe(false);

      payments.removeFeeFromQueue('finId1');
      payments.addPaymentToQueue({ FloorplanId: 'floorId1' }, false);
      expect(queue.isEmpty()).toBe(false);

      payments.removePaymentFromQueue('floorId1');
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('getPaymentFromQueue function', function() {
    it('should return the cartItem object for that floorplan id', function() {
      payments.addPaymentToQueue({ FloorplanId: 'testId' }, false);
      var result = payments.getPaymentFromQueue('testId');
      expect(result).toBeDefined();
    });
  });

  describe('clearPaymentQueue function', function () {
    it('should remove fees and payments from the queue', function () {
      var queue = payments.getPaymentQueue();
      payments.addFeeToQueue({ FinancialRecordId: 'id1' });
      payments.addFeeToQueue({ FinancialRecordId: 'id1' });
      payments.addPaymentToQueue({ FloorplanId: 'id3' }, 'payment');
      payments.addPaymentToQueue({ FloorplanId: 'id4' }, 'payoff');
      payments.clearPaymentQueue();
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('cancelScheduled function', function () {
    var succeed = true;

    beforeEach(function () {
      httpBackend.expectPOST('/payment/cancelscheduledpayment/schId').respond(function() {
        return [200, {
          Success: succeed,
          Message: null
        }, {}];
      });
    });

    it('should make the expected HTTP POST with the provided web scheduled payment ID', function () {
      payments.cancelScheduled('schId');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for successful result', function () {
      var success = jasmine.createSpy('success'),
        failure = jasmine.createSpy('failure');

      payments.cancelScheduled('schId').then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalled();
      expect(failure).not.toHaveBeenCalled();
    });

    it('should return a promise for failure result', function () {
      var success = jasmine.createSpy('success'),
        failure = jasmine.createSpy('failure');

      succeed = false;
      payments.cancelScheduled('schId').then(success, failure);
      httpBackend.flush();
      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalled();
    });
  });

  describe('cancelScheduledFee function', function () {
    var succeed = true;

    beforeEach(function () {
      httpBackend.expectPOST('/payment/cancelscheduledaccountfeepayment/schId').respond(function() {
        return [200, {
          Success: succeed,
          Message: null
        }, {}];
      });
    });

    it('should make the expected HTTP POST with the provided scheduled fee payment ID', function () {
      payments.cancelScheduledFee('schId');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for successful result', function () {
      var success = jasmine.createSpy('success'),
        failure = jasmine.createSpy('failure');

      payments.cancelScheduledFee('schId').then(success, failure);
      httpBackend.flush();
      expect(success).toHaveBeenCalled();
      expect(failure).not.toHaveBeenCalled();
    });

    it('should return a promise for failure result', function () {
      var success = jasmine.createSpy('success'),
        failure = jasmine.createSpy('failure');

      succeed = false;
      payments.cancelScheduledFee('schId').then(success, failure);
      httpBackend.flush();
      expect(success).not.toHaveBeenCalled();
      expect(failure).toHaveBeenCalled();
    });
  });

  describe('fetchPossiblePaymentDates function', function () {
    var clock;

    beforeEach(function () {
      // mock the system clock so we have a predictable current date & time for testing
      // see http://sinonjs.org/docs/#clock
      clock = sinon.useFakeTimers(moment('2013-01-01T08:30:00Z').valueOf(), 'Date');

      httpBackend.whenGET('/payment/possiblePaymentDates/2013-01-01/2013-01-31').respond({
        Success: true,
        Data: [
          "2013-01-05", "2013-01-06", "2013-01-07"
        ]
      });
    });

    afterEach(function () {
      clock.restore();
    });

    it('should make the expected API call', function () {
      var start = moment("2013-01-01").toDate(),
        end = moment("2013-01-31").toDate();
      httpBackend.expectGET('/payment/possiblePaymentDates/2013-01-01/2013-01-31');
      payments.fetchPossiblePaymentDates(start, end);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should transform results into a map of booleans by date, if requested', function () {
      var start = new Date(),
        end = new Date(),
        out = null;
      httpBackend.whenGET(/\/payment\/possiblePaymentDates\/.*/).respond({
        Success: true,
        Data: [
          '2013-09-03',
          '2013-09-06'
        ]
      });
      payments.fetchPossiblePaymentDates(start, end, true).then(function (result) {
        out = result;
      });
      httpBackend.flush();
      expect(out['2013-09-03']).toBe(true);
      expect(out['2013-09-06']).toBe(true);
      expect(out['2013-09-07']).not.toBe(true);
    });

    it('should just return the results list otherwise', function () {
      var start = new Date(),
        end = new Date(),
        responseList = [
          '2013-09-03',
          '2013-09-06'
        ],
        out = null;
      httpBackend.whenGET(/\/payment\/possiblePaymentDates\/.*/).respond({
        Success: true,
        Data: responseList
      });
      payments.fetchPossiblePaymentDates(start, end).then(function (result) {
        out = result;
      });
      httpBackend.flush();
      expect(angular.equals(out, responseList)).toBe(true);
    });

  });

  describe('updatePaymentAmountOnDate function', function () {
    var callParams,
      mockPaymentItem;

    beforeEach(function () {
      mockPaymentItem = {
        id: 'foo',
        updateAmountsOnDate: angular.noop
      };
      httpBackend.whenGET(/\/payment\/calculatepaymentamount\?.*/).respond(function(method, url) {
        callParams = urlParser.extractParams(url);
        return [200, {
          Success: true,
          Data: {
            FloorplanId: 'foo',
            PaymentAmount: 345.67,
            PrincipalAmount: 100,
            InterestAmount: 200,
            FeeAmount: 50,
            CollateralProtectionAmount: 11
          }
        }, {}];
      });
    });

    it('should call the expected endpoint', function () {
      httpBackend.expectGET(/\/payment\/calculatepaymentamount\?.*/);
      payments.updatePaymentAmountOnDate(mockPaymentItem, new Date(), false);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the expected params', function () {
      payments.updatePaymentAmountOnDate(mockPaymentItem, new Date(2013, 9, 22), false);
      httpBackend.flush();
      expect(callParams.FloorplanId).toBe('foo');
      expect(callParams.ScheduledDate).toBe('2013-10-22');
      expect(callParams.IsCurtailment).toBe('true');
    });

    it('should return a promise for the resulting PaymentAmount', function () {
      payments.updatePaymentAmountOnDate(mockPaymentItem, new Date(2013, 11, 22), false).then(
        function (result) {
          expect(result.PaymentAmount).toBe(345.67);
          expect(result.PrincipalAmount).toBe(100);
          expect(result.InterestAmount).toBe(200);
          expect(result.FeeAmount).toBe(50);
          expect(result.CollateralProtectionAmount).toBe(11);
        }
      );
      httpBackend.flush();
    });
  });

  describe('checkout function', function () {
    var stubResponse;

    beforeEach(function () {
      stubResponse = {
        Success: true,
        Data: {
          foo: 'bar'
        }
      };
    });

    it('should make the expected API endpoint call', function () {
      httpBackend.expectPOST('/payment/2_0/make').respond(stubResponse);
      payments.checkout({}, {}, 'bank1');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the bank account id', function () {
      httpBackend.whenPOST('/payment/2_0/make').respond(function (method, url, data) {
        data = angular.fromJson(data);
        expect(data.BankAccountId).toBe('bank1');
        return [200, stubResponse, {}];
      });
      payments.checkout({}, {}, {BankAccountId: 'bank1'});
      httpBackend.flush();
    });

    it('should send the unapplied funds amount as a number', function () {
      httpBackend.whenPOST('/payment/2_0/make').respond(function (method, url, data) {
        data = angular.fromJson(data);
        expect(data.UnappliedFundsAmount).toBe(180.45);
        return [200, stubResponse, {}];
      });
      payments.checkout([], [], {BankAccountId: 'bank1'}, '180.45');
      httpBackend.flush();
    });

    it('should set paymentInProgress properly', function() {
      httpBackend.expectPOST('/payment/2_0/make').respond(function () {
        return [200, stubResponse, {}];
      });
      payments.checkout({}, {}, {BankAccountId: 'bank1'});
      expect(payments.paymentInProgress()).toBe(true);
      httpBackend.flush();
      expect(payments.paymentInProgress()).toBe(false);
    });

    it('should grab the api request objects for each cart item', function() {
      httpBackend.expectPOST('/payment/2_0/make').respond(function () {
        return [200, stubResponse, {}];
      });
      var f = { financialRecordId: 'fee1', getApiRequestObject: angular.noop },
        p = { id: 'floorplan1', getApiRequestObject: angular.noop };

      spyOn(f, 'getApiRequestObject');
      spyOn(p, 'getApiRequestObject');
      payments.checkout([f], [p], {BankAccountId: 'bank1'});

      httpBackend.flush();
      expect(f.getApiRequestObject).toHaveBeenCalled();
      expect(p.getApiRequestObject).toHaveBeenCalled();
    })
  });

  describe('requestExtension', function() {
    it('should make api request', function() {
      var floorplanId = 5;
      httpBackend.expectPOST('/Floorplan/requestextension/' + floorplanId).respond({
        Success: true,
        Message: null,
        Data: null
      });

      payments.requestExtension(floorplanId);
      expect(httpBackend.flush).not.toThrow();
    });
  });
});
