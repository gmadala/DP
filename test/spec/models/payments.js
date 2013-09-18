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

  describe('addToPaymentQueue function + getPaymentQueueStatus', function () {

    it('should add fees to the queue', function () {
      var fee = {
        FeeType: 'a fee type',
        FinancialRecordId: 'fee1',
        Posted: '2013-01-01'
      };
      expect(payments.getPaymentQueueStatus(angular.copy(fee))).toBe(false);
      payments.addToPaymentQueue(fee);
      expect(payments.getPaymentQueueStatus(angular.copy(fee))).toBe(true);
    });

    it('should add payments to the queue with $queuedAmount matching amount due', function () {
      var payment = {
        Scheduled: false,
        FloorplanId: 'floorplan1',
        Posted: '2013-01-01',
        AmountDue: 400,
        CurrentPayoff: 5000
      };
      expect(payments.getPaymentQueueStatus(angular.copy(payment))).toBe(false);
      payments.addToPaymentQueue(payment);
      expect(payments.getPaymentQueueStatus(angular.copy(payment))).toBe('payment');

      payment = _.find(payments.getPaymentQueue().payments);
      expect(payment.$queuedAmount).toBe(400);
    });

    it('should add payoffs to the queue with $queuedAmount matching current payoff amount', function () {
      var payment = {
        Scheduled: false,
        FloorplanId: 'floorplan2',
        Posted: '2013-01-01',
        AmountDue: 400,
        CurrentPayoff: 5000
      };
      expect(payments.getPaymentQueueStatus(angular.copy(payment))).toBe(false);
      payments.addToPaymentQueue(payment, true);
      expect(payments.getPaymentQueueStatus(angular.copy(payment))).toBe('payoff');

      payment = _.find(payments.getPaymentQueue().payments);
      expect(payment.$queuedAmount).toBe(5000);
    });

  });

  describe('removeFromPaymentQueue function + getPaymentQueueStatus', function () {

    it('should remove fees from the queue', function () {
      var fee = {
        FeeType: 'a fee type',
        FinancialRecordId: 'fee1',
        Posted: '2013-01-01'
      };
      payments.addToPaymentQueue(fee);
      payments.removeFromPaymentQueue(angular.copy(fee));
      expect(payments.getPaymentQueueStatus(angular.copy(fee))).toBe(false);
    });

    it('should remove payments from the queue', function () {
      var payment = {
        Scheduled: false,
        FloorplanId: 'floorplan1',
        Posted: '2013-01-01'
      };
      payments.addToPaymentQueue(payment);
      payments.removeFromPaymentQueue(angular.copy(payment));
      expect(payments.getPaymentQueueStatus(angular.copy(payment))).toBe(false);
    });

    it('should remove payoffs from the queue', function () {
      var payment = {
        Scheduled: false,
        FloorplanId: 'floorplan2',
        Posted: '2013-01-01'
      };
      payments.addToPaymentQueue(payment, true);
      payments.removeFromPaymentQueue(angular.copy(payment));
      expect(payments.getPaymentQueueStatus(angular.copy(payment))).toBe(false);
    });

  });

  describe('getPaymentQueue function', function () {

    it('should return the live payment queue contents as fees and payments hashes', function () {
      var fee = {
        FeeType: 'a fee type',
        FinancialRecordId: 'fee1',
        Posted: '2013-01-01'
      };
      var payment = {
        Scheduled: false,
        FloorplanId: 'floorplan2',
        Posted: '2013-01-01'
      };

      payments.addToPaymentQueue(fee);

      var content = payments.getPaymentQueue();

      expect(content.fees).toBeDefined();
      expect(content.payments).toBeDefined();

      var items = [];
      angular.forEach(content.fees, function (value, key) {
        items.push(value);
      });
      expect(items.length).toBe(1);
      expect(items[0]).toBe(fee);

      payments.addToPaymentQueue(payment);

      items = [];
      angular.forEach(content.payments, function (value, key) {
        items.push(value);
      });
      expect(items.length).toBe(1);
      expect(items[0]).toBe(payment);
    });

    it('should expose an isEmpty function that calculates whether the queue is empty', function () {
      var fee = {
        FeeType: 'a fee type',
        FinancialRecordId: 'fee1',
        Posted: '2013-01-01'
      };
      var payment = {
        Scheduled: false,
        FloorplanId: 'floorplan2',
        Posted: '2013-01-01'
      };

      var queue = payments.getPaymentQueue();

      expect(queue.isEmpty()).toBe(true);

      payments.addToPaymentQueue(fee);

      expect(queue.isEmpty()).toBe(false);

      payments.removeFromPaymentQueue(fee);
      payments.addToPaymentQueue(payment);

      expect(queue.isEmpty()).toBe(false);

      payments.removeFromPaymentQueue(payment);
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

});
