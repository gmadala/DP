'use strict';

describe("Model: Payments", function () {

  beforeEach(module('nextgearWebApp'));

  var payments,
    httpBackend,
    urlParser;

  beforeEach(inject(function ($httpBackend, Payments, URLParser) {
    payments = Payments;
    httpBackend = $httpBackend;
    urlParser = URLParser;
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

    beforeEach(inject(function (Paginate, User) {
      paginate = Paginate;
      httpBackend.whenGET(/\/payment\/search.*/).respond(respondFnc);
      spyOn(User, 'getInfo').andReturn({ BusinessNumber: '123' });
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
      expect(callParams.OrderDirection).toBe('ASC');
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
      expect(output.SearchResults[0].$titleURL).toBe('/floorplan/title/123-456/false');
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

  });

  describe('fetchFees function', function () {

    beforeEach(function () {
      httpBackend.whenGET('/payment/getaccountfees').respond({
          Success: true,
          Data: {
            AccountFees: 'bar'
          }
        });
    });

    it('should make the expected HTTP request', function () {
      httpBackend.expectGET('/payment/getaccountfees');
      payments.fetchFees();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise that resolves to the AccountFees property of the returned data', function () {
      var out = null;
      payments.fetchFees().then(function (result) {
        out = result;
      });
      httpBackend.flush();
      expect(out).toBe('bar');
    });

  });

  describe('canPayNow function', function () {

    var clock;

    beforeEach(function () {
      httpBackend.whenGET('/Info/businesshours').respond({
        Success: true,
        Data: {
          StartDateTime: '2013-01-01T09:00:00Z',
          EndDateTime: '2013-01-01T17:00:00Z'
        }
      });

      // mock the system clock so we have a predictable current date & time for testing
      // see http://sinonjs.org/docs/#clock
      clock = sinon.useFakeTimers(moment('2013-01-01T08:30:00Z').valueOf(), 'Date');
    });

    afterEach(function () {
      clock.restore();
    });

    it('should make the expected HTTP request when data is not cached', function () {
      httpBackend.expectGET('/Info/businesshours');
      payments.canPayNow();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should used cached data on subsequent requests on the same day', function () {
      payments.canPayNow();
      httpBackend.flush();

      payments.canPayNow();
      expect(httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });

    it('should return false when the time is before business hours start', function () {
      var out = null;
      payments.canPayNow().then(function (result) {
        out = result;
      });
      httpBackend.flush();
      expect(out).toBe(false);
    });

    it('should return true when the time is during business hours', function () {
      var out = null;
      clock.tick(60 * 60 * 1000); // add 1 hour: 9:30
      payments.canPayNow().then(function (result) {
        out = result;
      });
      httpBackend.flush();
      expect(out).toBe(true);
    });

    it('should return false when the time is after business hours end', function () {
      var out = null;
      clock.tick(9 * 60 * 60 * 1000); // add 9 hours : 17:30
      payments.canPayNow().then(function (result) {
        out = result;
      });
      httpBackend.flush();
      expect(out).toBe(false);
    });

    it('should request data when cached data is out date', function () {
      var out = null;
      clock.tick(17 * 60 * 60 * 1000); // add 17 hours : 1:30 the next day
      payments.canPayNow().then(function (result) {
        out = result;
      });
      expect(httpBackend.flush).not.toThrow();
      expect(out).toBe(false);
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
        DueDate: '2013-01-01'
      };
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
      payments.addPaymentToQueue(
        payment.FloorplanId,
        payment.Vin,
        payment.StockNumber,
        payment.UnitDescription,
        payment.AmountDue,
        payment.DueDate,
        false
      );
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe('payment');
    });

    it('should add payoffs to the queue', function () {
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        StockNumber: 's123',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        DueDate: '2013-01-01'
      };
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
      payments.addPaymentToQueue(
        payment.FloorplanId,
        payment.Vin,
        payment.StockNumber,
        payment.UnitDescription,
        payment.AmountDue,
        payment.DueDate,
        true
      );
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe('payoff');
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
      payments.addFeeToQueue(
        fee.FinancialRecordId,
        fee.Vin,
        fee.FeeType,
        fee.Description,
        fee.Balance,
        fee.EffectiveDate);
      expect(payments.isFeeOnQueue(fee.FinancialRecordId)).toBe(true);
    });

  });

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
      payments.addPaymentToQueue(
        payment.FloorplanId,
        payment.Vin,
        payment.StockNumber,
        payment.UnitDescription,
        payment.AmountDue,
        payment.DueDate,
        false
      );
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
      payments.addPaymentToQueue(
        payment.FloorplanId,
        payment.Vin,
        payment.StockNumber,
        payment.UnitDescription,
        payment.AmountDue,
        payment.DueDate,
        true
      );
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
      payments.addFeeToQueue(
        fee.FinancialRecordId,
        fee.Vin,
        fee.FeeType,
        fee.Description,
        fee.Balance,
        fee.EffectiveDate);
      payments.removeFeeFromQueue(fee.FinancialRecordId);
      expect(payments.isFeeOnQueue(fee.FinancialRecordId)).toBe(false);
    });

  });

  describe('getPaymentQueue function', function () {

    it('should include the fees hash table with expected fee data', function () {
      payments.addFeeToQueue('finId1', 'vin', 'type', 'desc', 100, '2013-01-01');

      var content = payments.getPaymentQueue();
      expect(content.fees).toBeDefined();

      var items = _.map(content.fees);
      expect(items.length).toBe(1);
      var fee = items[0];
      expect(fee.financialRecordId).toBe('finId1');
      expect(fee.vin).toBe('vin');
      expect(fee.type).toBe('type');
      expect(fee.description).toBe('desc');
      expect(fee.amount).toBe(100);
      expect(fee.dueDate).toBe('2013-01-01');
    });

    it('should include the payments hash table with expected payment data', function () {
      var content = payments.getPaymentQueue();
      expect(content.payments).toBeDefined();

      // this is deliberately AFTER the queue content retrieval to test that we're getting "live" objects
      payments.addPaymentToQueue('floorId1', 'vin', 'stock1', 'desc', 200, '2013-01-02', true);

      var items = _.map(content.payments);
      expect(items.length).toBe(1);
      var pmt = items[0];
      expect(pmt.floorplanId).toBe('floorId1');
      expect(pmt.vin).toBe('vin');
      expect(pmt.stockNum).toBe('stock1');
      expect(pmt.description).toBe('desc');
      expect(pmt.amount).toBe(200);
      expect(pmt.dueDate).toBe('2013-01-02');
      expect(pmt.isPayoff).toBe(true);
    });

    it('should expose an isEmpty function that calculates whether the queue is empty', function () {
      var queue = payments.getPaymentQueue();

      expect(queue.isEmpty()).toBe(true);

      payments.addFeeToQueue('finId1', 'vin', 'type', 'desc', 100, '2013-01-01');

      expect(queue.isEmpty()).toBe(false);

      payments.removeFeeFromQueue('finId1');

      payments.addPaymentToQueue('floorId1', 'vin', 'stock1', 'desc', 200, '2013-01-02', false);

      expect(queue.isEmpty()).toBe(false);

      payments.removePaymentFromQueue('floorId1');
      expect(queue.isEmpty()).toBe(true);
    });

  });

  describe('clearPaymentQueue function', function () {

    it('should remove fees and payments from the queue', function () {
      var queue = payments.getPaymentQueue();
      payments.addFeeToQueue('id1', 'vin', 'type', 'desc', 1, '2013-01-01');
      payments.addFeeToQueue('id2', 'vin', 'type', 'desc', 1, '2013-01-01');
      payments.addPaymentToQueue('id3', 'vin', 's1', 'desc', 3, '2013-01-02', false);
      payments.addPaymentToQueue('id4', 'vin', 's1', 'desc', 3, '2013-01-02', true);
      payments.clearPaymentQueue();
      expect(queue.isEmpty()).toBe(true);
    });

  });

  describe('cancelScheduled function', function () {

    var request;

    beforeEach(function () {
      httpBackend.expectPOST('/payment/cancelscheduledpayment').respond(function(method, url, data) {
        request = angular.fromJson(data);
        return [200, {
          "Success": true,
          "Message": null
        }, {}];
      });
    });

    it('should make the expected HTTP POST with the FloorplanId of the provided payment', function () {
      payments.cancelScheduled({ FloorplanId: 'foo' });
      expect(httpBackend.flush).not.toThrow();
      expect(request.FloorplanId).toBe('foo');
    });

    it('should flip the Scheduled flag on the payment to false upon success', function () {
      var pmt = {
        FloorplanId: 'foo',
        Scheduled: true
      };
      payments.cancelScheduled(pmt);
      httpBackend.flush();
      expect(pmt.Scheduled).toBe(false);
    });

  });

  describe('fetchPossiblePaymentDates function', function () {

    it('should make the expected API call', function () {
      var start = new Date(2013, 0, 1),
        end = new Date(2013, 0, 31);
      httpBackend.expectGET('/payment/possiblePaymentDates/2013-01-01/2013-01-31').respond({
        Success: true,
        Data: []
      });
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
      httpBackend.expectPOST('/payment/make').respond(stubResponse);
      payments.checkout({}, {}, 'bank1');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send fees in the expected format', function () {
      var fees = {
        one: {
          financialRecordId: 'one',
          type: 'Membership Dues'
        },
        two: {
          financialRecordId: 'two',
          type: 'Other Fee'
        }
    };

      httpBackend.whenPOST('/payment/make').respond(function (method, url, data) {
        var expectedFees = [
          { FinancialRecordId: 'one' },
          { FinancialRecordId: 'two' }
        ];
        data = angular.fromJson(data);
        data = _.sortBy(data.AccountFees, 'FinancialRecordId');
        expect(angular.equals(data, expectedFees)).toBe(true);
        return [200, stubResponse, {}];
      });

      payments.checkout(fees, {}, 'bank1');
      httpBackend.flush();
    });

    it('should send payments in the expected format', function () {
      var paymentsData = {
        2049: {
          floorplanId: "2049",
          vin: "CH224157",
          scheduleDate: new Date(2013, 4, 5),
          isPayoff: false
        },
        2048: {
          floorplanId: "2048",
          vin: "LL2469R6",
          isPayoff: true
        }
    };

      httpBackend.whenPOST('/payment/make').respond(function (method, url, data) {
        var expectedPayments = [
          {
            FloorplanId: '2048',
            ScheduledSetupDate: null,
            IsPayoff: true
          },
          {
            FloorplanId: '2049',
            ScheduledSetupDate: '2013-05-05',
            IsPayoff: false
          }
        ];
        data = angular.fromJson(data);
        data = _.sortBy(data.SelectedFloorplans, 'FloorplanId');
        expect(angular.equals(data, expectedPayments)).toBe(true);
        return [200, stubResponse, {}];
      });

      payments.checkout({}, paymentsData, 'bank1');
      httpBackend.flush();
    });

    it('should send the bank account id', function () {
      httpBackend.whenPOST('/payment/make').respond(function (method, url, data) {
        data = angular.fromJson(data);
        expect(data.BankAccountId).toBe('bank1');
        return [200, stubResponse, {}];
      });
      payments.checkout({}, {}, {BankAccountId: 'bank1'});
      httpBackend.flush();
    });

    it('should send the unapplied funds amount as a number', function () {
      httpBackend.whenPOST('/payment/make').respond(function (method, url, data) {
        data = angular.fromJson(data);
        expect(data.UnappliedFundsAmount).toBe(180.45);
        return [200, stubResponse, {}];
      });
      payments.checkout([], [], {BankAccountId: 'bank1'}, '180.45');
      httpBackend.flush();
    });

  });

});
