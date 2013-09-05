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
          "UpcomingPaymentAmount": 4367.22,
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
              "PayoffDue": 0,
              "PaymentDue": 2200.00
            },
            {
              "DueDate": "2013-08-01",
              "Description": "BMW 7-Series 750Li Black",
              "PayoffDue": 0,
              "PaymentDue": 2800.00
            },
            {
              "DueDate": "2013-08-07",
              "Description": "Toyota Sequoia Unlimited Red",
              "PayoffDue": 0,
              "PaymentDue": 8000.00
            }
          ],
          "ScheduledPayments": [
            {
              "ScheduledDate": "2013-08-01",
              "Description": "Toyota Sequoia Limited Tan",
              "PayoffDue": 0,
              "PaymentDue": 2200.00
            },
            {
              "ScheduledDate": "2013-08-01",
              "Description": "BMW 7-Series 750Li Black",
              "PayoffDue": 0,
              "PaymentDue": 2800.00
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
      expect(resultData.UpcomingPaymentsList.length).toBe(3);
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

    it('should add a calendarData object with the expected properties', function () {
      expect(resultData.calendarData).toBeDefined();
      expect(resultData.calendarData.dueEvents).toBeDefined();
      expect(resultData.calendarData.scheduledEvents).toBeDefined();
      expect(resultData.calendarData.eventsByDate).toBeDefined();
      expect(resultData.calendarData.openDates).toBeDefined();
    });

    it('should create the expected dueEvents', function () {
      var expected = [
        {title: '<span class="nxg-calendar-count">2</span> Payments Due', subTitle: '$5,000.00', start: '2013-08-01'},
        {title: '<span class="nxg-calendar-count">1</span> Payment Due', subTitle: '$8,000.00', start: '2013-08-07'}
      ];

      expect(angular.equals(resultData.calendarData.dueEvents, expected)).toBe(true);
    });

    it('should create the expected scheduledEvents', function () {
      var expected = [
        {title: '<span class="nxg-calendar-count">2</span> Scheduled', subTitle: '$5,000.00', start: '2013-08-01'}
      ];

      expect(angular.equals(resultData.calendarData.scheduledEvents, expected)).toBe(true);
    });

    it('should create the expected eventsByDate', function () {
      var expected = {
        '2013-08-01': [
          {title: '<span class="nxg-calendar-count">2</span> Payments Due', subTitle: '$5,000.00', start: '2013-08-01'},
          {title: '<span class="nxg-calendar-count">2</span> Scheduled', subTitle: '$5,000.00', start: '2013-08-01'}
        ],
        '2013-08-07': [
          {title: '<span class="nxg-calendar-count">1</span> Payment Due', subTitle: '$8,000.00', start: '2013-08-07'}
        ]
      };

      expect(angular.equals(resultData.calendarData.eventsByDate, expected)).toBe(true);
    });

    it('should create the expected openDates', function () {
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

});
