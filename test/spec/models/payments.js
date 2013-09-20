'use strict';

describe("Model: Payments", function () {

  beforeEach(module('nextgearWebApp'));

  var payments,
    httpBackend;

  beforeEach(inject(function ($httpBackend, Payments) {
    payments = Payments;
    httpBackend = $httpBackend;
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
      payments.requestUnappliedFundsPayout(200, 'foo');
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
      extractParams = function(method, url) {
        // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
        var match,
          pl     = /\+/g,  // Regex for replacing addition symbol with a space
          search = /([^&=]+)=?([^&]*)/g,
          decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
          query = url.substring(url.indexOf('?') + 1);

        callParams = {};

        while (match = search.exec(query)) {
          callParams[decode(match[1])] = decode(match[2]);
        }

        return [200, {
          Success: true,
          Data: {
            PaymentRowCount: 20,
            SearchResults: searchResults
          }
        }, {}];
      };

    beforeEach(inject(function (Paginate, User) {
      paginate = Paginate;
      httpBackend.whenGET(/\/payment\/search.*/).respond(extractParams);
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

    it('should NOT send a Criteria if search term is empty/null', function () {
      payments.search(defaultCriteria);
      httpBackend.flush();
      expect(callParams.Criteria).not.toBeDefined();
    });

    it('should send the search term as Criteria, if present', function () {
      payments.search(angular.extend({}, defaultCriteria, {query: 'foo'}));
      httpBackend.flush();
      expect(callParams.Criteria).toBe('foo');
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

    it('should send whatever dates are passed, in UTC, if filter is range', function () {
      payments.search(angular.extend({}, defaultCriteria, {
        startDate: moment.utc([2013, 0 , 1]).toDate(),
        endDate: moment.utc([2013, 0 , 2]).toDate(),
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

  describe('addToPaymentQueue function + isPaymentOnQueue', function () {

    it('should add fees to the queue', function () {
      var fee = {
        FinancialRecordId: 'fee1',
        Vin: 'someVin',
        Decription: 'fee description',
        Balance: 350.85
      };
      expect(payments.isFeeOnQueue(fee.FinancialRecordId)).toBe(false);
      payments.addFeeToQueue(fee.FinancialRecordId, fee.Vin, fee.Description, fee.Balance);
      expect(payments.isFeeOnQueue(fee.FinancialRecordId)).toBe(true);
    });

    it('should add payments to the queue with amount matching amount due', function () {
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        PayPayoffAmount: true
      };
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
      payments.addToPaymentQueue(payment.FloorplanId, payment.Vin, payment.UnitDescription, payment.AmountDue, false);
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe('payment');

      payment = _.find(payments.getPaymentQueue().payments);
      expect(payment.amount).toBe(1000);
    });

    it('should add payoffs to the queue with amount matching current payoff amount', function () {
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        PayPayoffAmount: true
      };
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
      payments.addToPaymentQueue(payment.FloorplanId, payment.Vin, payment.UnitDescription, payment.CurrentPayoff, true);
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe('payoff');

      payment = _.find(payments.getPaymentQueue().payments);
      expect(payment.amount).toBe(5000);
    });

  });

  describe('removeFeeFromQueue + removePaymentFromQueue + isFeeOnQueue + isPaymentOnQueue', function () {

    it('should remove fees from the queue', function () {
      var fee = {
        FinancialRecordId: 'fee1',
        Vin: 'someVin',
        Decription: 'fee description',
        Balance: 350.85
      };
      payments.addFeeToQueue(fee.FinancialRecordId, fee.Vin, fee.Description, fee.Balance);
      payments.removeFeeFromQueue(fee.FinancialRecordId);
      expect(payments.isFeeOnQueue(fee.FinancialRecordId)).toBe(false);
    });

    it('should remove payments from the queue', function () {
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        PayPayoffAmount: true
      };
      payments.addToPaymentQueue(payment.FloorplanId, payment.Vin, payment.UnitDescription, payment.AmountDue, false);
      payments.removePaymentFromQueue(payment.FloorplanId);
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
    });

    it('should remove payoffs from the queue', function () {
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        PayPayoffAmount: true
      };
      payments.addToPaymentQueue(payment.FloorplanId, payment.Vin, payment.UnitDescription, payment.CurrentPayoff, true);
      payments.removePaymentFromQueue(payment.FloorplanId);
      expect(payments.isPaymentOnQueue(payment.FloorplanId)).toBe(false);
    });

  });

  describe('getPaymentQueue function', function () {

    it('should return the live payment queue contents as fees and payments hashes', function () {
      var fee = {
        FinancialRecordId: 'fee1',
        Vin: 'someVin',
        Decription: 'fee description',
        Balance: 350.85
      };
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        PayPayoffAmount: true
      };
      var content = payments.getPaymentQueue();
      expect(content.fees).toBeDefined();
      expect(content.payments).toBeDefined();

      payments.addFeeToQueue(fee.FinancialRecordId, fee.Vin, fee.Description, fee.Balance);

      var items = [];
      angular.forEach(content.fees, function (value, key) {
        items.push(value);
      });
      expect(items.length).toBe(1);
      expect(items[0].id).toBe(fee.FinancialRecordId);

      payments.addToPaymentQueue(payment.FloorplanId, payment.Vin, payment.UnitDescription, payment.AmountDue, false);

      items = [];
      angular.forEach(content.payments, function (value, key) {
        items.push(value);
      });
      expect(items.length).toBe(1);
      expect(items[0].id).toBe(payment.FloorplanId);
    });

    it('should expose an isEmpty function that calculates whether the queue is empty', function () {
      var fee = {
        FinancialRecordId: 'fee1',
        Vin: 'someVin',
        Decription: 'fee description',
        Balance: 350.85
      };
      var payment = {
        FloorplanId: 'floorplan1',
        Vin: 'someVin',
        UnitDescription: 'some description',
        CurrentPayoff: 5000,
        AmountDue: 1000,
        PayPayoffAmount: true
      };

      var queue = payments.getPaymentQueue();

      expect(queue.isEmpty()).toBe(true);

      payments.addFeeToQueue(fee.FinancialRecordId, fee.Vin, fee.Description, fee.Balance);

      expect(queue.isEmpty()).toBe(false);

      payments.removeFeeFromQueue(fee.FinancialRecordId);

      payments.addToPaymentQueue(payment.FloorplanId, payment.Vin, payment.UnitDescription, payment.AmountDue, false);

      expect(queue.isEmpty()).toBe(false);

      payments.removePaymentFromQueue(payment.FloorplanId);
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
      payments.checkout([], [], 'bank1');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send fees in the expected format', function () {
      var fees = [
        {
          FinancialRecordId: 'one',
          FeeType: 'Membership Dues'
        },
        {
          FinancialRecordId: 'two',
          FeeType: 'Other Fee'
        }
      ];

      httpBackend.whenPOST('/payment/make').respond(function (method, url, data) {
        var expectedFees = [
          { FinancialRecordId: 'one' },
          { FinancialRecordId: 'two' }
        ];
        data = angular.fromJson(data);
        expect(angular.equals(data.AccountFees, expectedFees)).toBe(true);
        return [200, stubResponse, {}];
      });

      payments.checkout(fees, [], 'bank1');
      httpBackend.flush();
    });

    it('should send payments in the expected format', function () {
      var paymentsData = [
        {
          "FloorplanId": "2049",
          "Vin": "CH224157",
          $scheduleDate: new Date(2013, 4, 5),
          $queuedAsPayoff: false
        },
        {
          "FloorplanId": "2048",
          "Vin": "LL2469R6",
          $queuedAsPayoff: true
        }
      ];

      httpBackend.whenPOST('/payment/make').respond(function (method, url, data) {
        var expectedPayments = [
          {
            FloorplanId: '2049',
            ScheduledSetupDate: '2013-05-05',
            IsPayoff: false
          },
          {
            FloorplanId: '2048',
            ScheduledSetupDate: null,
            IsPayoff: true
          }
        ];
        data = angular.fromJson(data);
        expect(angular.equals(data.SelectedFloorplans, expectedPayments)).toBe(true);
        return [200, stubResponse, {}];
      });

      payments.checkout([], paymentsData, 'bank1');
      httpBackend.flush();
    });

    it('should send the bank account id', function () {
      httpBackend.whenPOST('/payment/make').respond(function (method, url, data) {
        data = angular.fromJson(data);
        expect(data.BankAccountId).toBe('bank1');
        return [200, stubResponse, {}];
      });
      payments.checkout([], [], {BankAccountId: 'bank1'});
      httpBackend.flush();
    });

    it('should send the unapplied funds amount', function () {
      httpBackend.whenPOST('/payment/make').respond(function (method, url, data) {
        data = angular.fromJson(data);
        expect(data.UnappliedFundsAmount).toBe(180.45);
        return [200, stubResponse, {}];
      });
      payments.checkout([], [], {BankAccountId: 'bank1'}, 180.45);
      httpBackend.flush();
    });

  });

});
