'use strict';

describe('Model: dashboard', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var dashboard,
    httpBackend;
  beforeEach(inject(function (Dashboard, $httpBackend) {
    dashboard = Dashboard;
    httpBackend = $httpBackend;
  }));

  describe('fetchDealerDashboard method', function () {
    var resultData = null;

    beforeEach(function () {
      httpBackend.whenGET(/^\/dealer\/buyer\/dashboard\/.*$/).respond({
        "Success": true,
        "Message": null,
        "Data": {
          "OverduePayments": 1,
          "OverduePaymentAmount": 340.00,
          "PaymentsDueToday": 3,
          "PaymentsDueTodayAmount": 1280.34,
          "UpcomingPayments": 4,
          "UpcomingPaymentsAmount": 8367.22,
          "AccountFees": 1,
          "AccountFeeAmount": 400,
          "AvailableCredit": 50500,
          "UtilizedCredit": 474000,
          "TempLineOfCredit": 75000,
          "LineOfCredit": 450000,
          "UnappliedFundTotal": 2222,
          "TotalAvailableUnappliedFunds": 1111,
          "ApprovedFloorplans": 820,
          "PendingFloorplans": 12,
          "DeniedFloorplans": 5,
          "UpcomingPaymentsList": [
            {
              "DueDate": "2013-08-01",
              "Description": "Toyota Sequoia Limited Tan",
              "PayoffDue": 40000,
              "PaymentDue": 2200.00
            },
            {
              "DueDate": "2013-08-01",
              "Description": "BMW 7-Series 750Li Black",
              "PayoffDue": 40000,
              "PaymentDue": 2800.00
            },
            {
              "DueDate": "2013-08-07",
              "Description": "Toyota Sequoia Unlimited Red",
              "PayoffDue": 40000,
              "PaymentDue": 8000.00
            },
            {
              "DueDate": "2013-08-07",
              "Description": "Toyota Sequoia Barbie Pink",
              "PayoffDue": 5000,
              "PaymentDue": 5000
            },
          ],
          "ScheduledPayments": [
            {
              "ScheduledDate": "2013-08-01",
              "ScheduledPaymentAmount": 5000
            }
          ],
          "Receipts": [
            {
              "FinancialTransactionId": "abc123",
              "ReceiptDate": "2013-09-01",
              "ReceiptNumber": 456,
              "ReceiptAmount": 480.34
            },
            {
              "FinancialTransactionId": "def456",
              "ReceiptDate": "2013-08-31",
              "ReceiptNumber": 789,
              "ReceiptAmount": 8120.00
            },
            {
              "FinancialTransactionId": "ghi789",
              "ReceiptDate": "2013-08-22",
              "ReceiptNumber": 127,
              "ReceiptAmount": 2090.02
            },
          ]
        }
      });

      httpBackend.whenGET(/^\/payment\/possiblePaymentDates\/.*$/).respond({
        "Success": true,
        "Message": null,
        "Data": [
          "2013-08-01",
          "2013-08-05",
          "2013-08-06",
          "2013-08-07",
          "2013-08-08",
          "2013-08-09"
        ]
      });

      dashboard.fetchDealerDashboard(new Date(), new Date()).then(function (results) {
        resultData = results;
      }, function (error) {
        throw new Error('request failed');
      });
      httpBackend.flush();

    });

    it('should pass through the standard dashboard info', function () {
      expect(resultData).not.toBe(null);
      expect(resultData.PaymentsDueToday).toBe(3);
      expect(resultData.UnappliedFundTotal).toBe(2222);
      expect(resultData.UpcomingPaymentsList.length).toBe(4);
    });

    it('should add a creditChartData object with expected structure', function () {
      expect(resultData.creditChartData).toBeDefined();
      expect(angular.isArray(resultData.creditChartData.outer)).toBe(true);
      expect(angular.isArray(resultData.creditChartData.inner)).toBe(true);
    });

    it('should populate creditChartData outer with breakdown of credit by type', function () {
      expect(resultData.creditChartData.outer.length).toBe(2);
      expect(resultData.creditChartData.outer[0].value).toBe(450000);
      expect(resultData.creditChartData.outer[1].value).toBe(75000);
    });

    it('should populate creditChartData inner with breakdown of credit by utilization', function () {
      expect(resultData.creditChartData.inner.length).toBe(2);
      expect(resultData.creditChartData.inner[0].value).toBe(474000);
      expect(resultData.creditChartData.inner[1].value).toBe(50500);
    });

    it('should add a paymentChartData object with expected structure', function () {
      expect(resultData.paymentChartData).toBeDefined();
      expect(resultData.paymentChartData.fees).toBeDefined();
      expect(resultData.paymentChartData.payments).toBeDefined();
      expect(resultData.paymentChartData.scheduledPayments).toBeDefined();
      expect(resultData.paymentChartData.total).toBeDefined();
      expect(angular.isArray(resultData.paymentChartData.chartData)).toBe(true);
    });

    it('should populate paymentChartData fees with the fee amount from API', function () {
      expect(resultData.paymentChartData.fees).toBe(400);
    });

    it('should populate paymentChartData payments with upcoming minus scheduled payments', function () {
      expect(resultData.paymentChartData.payments.toPrecision(6)).toBe('3367.22');
    });

    it('should populate paymentChartData scheduledPayments with total of all scheduled payments', function () {
      expect(resultData.paymentChartData.scheduledPayments).toBe(5000);
    });

    it('should populate paymentChartData total with fees plus upcoming payments', function () {
      expect(resultData.paymentChartData.total).toBe(8767.22);
    });

    it('should wrap this data up into a chart-compatible format', function () {
      expect(resultData.paymentChartData.chartData[0].value).toBe(resultData.paymentChartData.fees);
      expect(resultData.paymentChartData.chartData[1].value).toBe(resultData.paymentChartData.payments);
      expect(resultData.paymentChartData.chartData[2].value).toBe(resultData.paymentChartData.scheduledPayments);
    });

    it('should add a calendarData object with the expected properties', function () {
      expect(resultData.calendarData).toBeDefined();
      expect(resultData.calendarData.dueEvents).toBeDefined();
      expect(resultData.calendarData.scheduledEvents).toBeDefined();
      expect(resultData.calendarData.eventsByDate).toBeDefined();
      expect(resultData.calendarData.openDates).toBeDefined();
    });

    it('should create the expected dueEvents on calendarData', function () {
      var expected = [
        {title: '<span class="nxg-calendar-count">2</span> Payments Due', subTitle: '$5,000.00', start: '2013-08-01'},
        {title: '<span class="nxg-calendar-count">1</span> Payment Due', subTitle: '$8,000.00', start: '2013-08-07'},
        {title: '<span class="nxg-calendar-count">1</span> Payoff Due', subTitle: '$5,000.00', start: '2013-08-07'}
      ];

      expect(angular.equals(resultData.calendarData.dueEvents, expected)).toBe(true);
    });

    it('should create the expected scheduledEvents on calendarData', function () {
      var expected = [
        {title: '<span class="nxg-calendar-count">1</span> Scheduled', subTitle: '$5,000.00', start: '2013-08-01'}
      ];

      expect(angular.equals(resultData.calendarData.scheduledEvents, expected)).toBe(true);
    });

    it('should create the expected eventsByDate on calendarData', function () {
      var expected = {
        '2013-08-01': [
          {title: '<span class="nxg-calendar-count">2</span> Payments Due', subTitle: '$5,000.00', start: '2013-08-01'},
          {title: '<span class="nxg-calendar-count">1</span> Scheduled', subTitle: '$5,000.00', start: '2013-08-01'}
        ],
        '2013-08-07': [
          {title: '<span class="nxg-calendar-count">1</span> Payment Due', subTitle: '$8,000.00', start: '2013-08-07'},
          {title: '<span class="nxg-calendar-count">1</span> Payoff Due', subTitle: '$5,000.00', start: '2013-08-07'}
        ]
      };

      expect(angular.equals(resultData.calendarData.eventsByDate, expected)).toBe(true);
    });

    it('should create the expected openDates on calendarData', function () {
      var expected = {
        '2013-08-01': true,
        '2013-08-05': true,
        '2013-08-06': true,
        '2013-08-07': true,
        '2013-08-08': true,
        '2013-08-09': true
      };

      expect(angular.equals(resultData.calendarData.openDates, expected)).toBe(true);
    });

  });

  describe('fetchAuctionDashboard method', function () {

    beforeEach(function () {
      httpBackend.whenGET('/dealer/seller/dashboard').respond({
        Success: true,
        Message: null,
        Data: 'dashboard data'
      });
    });

    it('should call the expected endpoint', function () {
      httpBackend.expectGET('/dealer/seller/dashboard');
      dashboard.fetchAuctionDashboard();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for the result', function () {
      dashboard.fetchAuctionDashboard().then(
        function (result) {
          expect(result).toBe('dashboard data');
        }
      );
      httpBackend.flush();
    });

  });

  describe('fetchFloorplanChartData method', function () {

    var clock;

    beforeEach(function () {
      httpBackend.whenGET(/\/Floorplan\/getChartData\/\d$/).respond({
        Success: true,
        Message: null,
        Data: {
          Range: "Something",
          Points: [
            {
              X: 1,
              Y: 4
            },
            {
              X: 0,
              Y: 8
            },
            {
              X: 2,
              Y: 5
            }
          ]
        }
      });

      clock = sinon.useFakeTimers(moment([2014, 2, 31, 22, 19]).valueOf(), 'Date'); // Mon, March 31, 2014
    });

    afterEach(function () {
      clock.restore();
    });

    it('should call the expected endpoint with the provided range value', function () {
      httpBackend.expectGET('/Floorplan/getChartData/2');
      dashboard.fetchFloorplanChartData(2);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should throw an error if an invalid range is provided', function () {
      expect(function () {
        dashboard.fetchFloorplanChartData(3);
      }).toThrow();

      expect(function () {
        dashboard.fetchFloorplanChartData(-2);
      }).toThrow();

      expect(function () {
        dashboard.fetchFloorplanChartData(2.145);
      }).toThrow();

      expect(function () {
        dashboard.fetchFloorplanChartData();
      }).toThrow();

      expect(function () {
        dashboard.fetchFloorplanChartData('foo');
      }).toThrow();
    });

    it('should return a promise for the expected chart data structure', function () {
      dashboard.fetchFloorplanChartData(0).then(
        function (result) {
          expect(angular.isArray(result.labels)).toBe(true);

          expect(angular.isArray(result.datasets)).toBe(true);
          expect(result.datasets.length).toBe(1);
          expect(result.datasets[0].fillColor).toBeDefined();
          expect(result.datasets[0].strokeColor).toBeDefined();

          expect(angular.isArray(result.datasets[0].data)).toBe(true);
        }
      );
      httpBackend.flush();
    });

    it('should make the data items the Y values, sorted by X value', function () {
      dashboard.fetchFloorplanChartData(0).then(
        function (result) {
          expect(result.datasets[0].data.length).toBe(3);
          expect(result.datasets[0].data[0]).toBe(8);
          expect(result.datasets[0].data[1]).toBe(4);
          expect(result.datasets[0].data[2]).toBe(5);
        }
      );
      httpBackend.flush();
    });

    it('should create labels as days up to the current day, in week mode', function () {
      dashboard.fetchFloorplanChartData(0).then(
        function (result) {
          expect(result.labels.length).toBe(3);
          expect(result.labels[0]).toBe('Sat');
          expect(result.labels[1]).toBe('Sun');
          expect(result.labels[2]).toBe('Mon');
        }
      );
      httpBackend.flush();
    });

    it('should create labels as weeks (dated by Sundays) up to the current week, in month mode', function () {
      dashboard.fetchFloorplanChartData(1).then(
        function (result) {
          expect(result.labels.length).toBe(3);
          expect(result.labels[0]).toBe('Mar 16');
          expect(result.labels[1]).toBe('Mar 23');
          expect(result.labels[2]).toBe('Mar 30');
        }
      );
      httpBackend.flush();
    });

    it('should create labels as months (with short year) up to the current month, in year mode', function () {
      dashboard.fetchFloorplanChartData(2).then(
        function (result) {
          expect(result.labels.length).toBe(3);
          expect(result.labels[0]).toBe('Jan \'14');
          expect(result.labels[1]).toBe('Feb \'14');
          expect(result.labels[2]).toBe('Mar \'14');
        }
      );
      httpBackend.flush();
    });

  });

});
