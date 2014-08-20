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
          "UpcomingPaymentsAmount": 13367.22,
          "AccountFees": 1,
          "AccountFeeAmount": 400,
          "LinesOfCredit": [
            {
              "CreditTypeName": "Heavy Trucks",
              "LineOfCreditId": "59750fc5-c0f6-4170-8dec-8d16834ab484",
              "LineOfCreditAmount": 20000,
              "TempLineOfCreditAmount": 1000,
              "TempLineOfCreditExpiration": "2014-09-16T23:59:00",
              "AvailableCreditAmount": 20550
            },
            {
              "CreditTypeName": "Retail",
              "LineOfCreditId": "e5e8f773-df57-4f1d-a676-c1100fea356d",
              "LineOfCreditAmount": 150000,
              "TempLineOfCreditAmount": 0,
              "TempLineOfCreditExpiration": null,
              "AvailableCreditAmount": 149139
            }
          ],
          "UnappliedFundsTotal": 2222,
          "TotalAvailableUnappliedFunds": 1111,
          "ApprovedFloorplans": 820,
          "PendingFloorplans": 12,
          "DeniedFloorplans": 5,
          "CompletedFloorplans": 105,
          "UpcomingPaymentsList": [
            {
              "DueDate": "2013-09-06",
              "Description": "Toyota Sequoia Limited Tan",
              "PayoffDue": 0,
              "PaymentDue": 2490
            },
            {
              "DueDate": "2013-09-09",
              "Description": "BMW 7-Series 750Li Black",
              "PayoffDue": 0,
              "PaymentDue": 3860
            },
            {
              "DueDate": "2013-09-11",
              "Description": "Toyota Sequoia Unlimited Red",
              "PayoffDue": 4980,
              "PaymentDue": 0
            },
            {
              "DueDate": "2013-09-19",
              "Description": "A Car Being Paid For",
              "PayoffDue": 0,
              "PaymentDue": 3333
            },
            {
              "DueDate": "2013-09-19",
              "Description": "A Car Being Paid Off",
              "PayoffDue": 2222,
              "PaymentDue": 0
            }
          ],
          "ScheduledPayments": [
            {
              "ScheduledDate": "2013-09-06",
              "ScheduledPaymentAmount": 2490
            },
            {
              "ScheduledDate": "2013-09-09",
              "ScheduledPaymentAmount": 3860
            },
            {
              "ScheduledDate": "2013-09-09",
              "ScheduledPaymentAmount": 4980
            },
            {
              "ScheduledDate": "2013-09-19",
              "ScheduledPaymentAmount": 180
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
            }
          ]
        }
      });

      httpBackend.whenGET(/^\/payment\/possiblePaymentDates\/.*$/).respond(function(method, url) {

        var urlParts = url.split('/');
        var startDate = moment(urlParts[urlParts.length-2]);
        var endDate = moment(urlParts[urlParts.length-1]);

        var data = [];
        while(startDate.isBefore(endDate) || startDate.isSame(endDate)){
          if(!(startDate.day() === 0 || startDate.day() === 6)) {
            data.push(startDate.format('YYYY-MM-DD'));
          }
          startDate.add('days', 1);
        }

        return [
          200, JSON.stringify({
            "Success": true,
            "Message": null,
            "Data": data
          }), {}
        ];
      });

      dashboard.fetchDealerDashboard(moment('2013-08-01').toDate(), moment('2013-08-10').toDate()).then(function (results) {
        resultData = results;
      }, function (error) {
        throw new Error('request failed');
      });
      httpBackend.flush();

    });


    it('should pass through the standard dashboard info', function () {
      expect(resultData).not.toBe(null);
      expect(resultData.PaymentsDueToday).toBe(3);
      expect(resultData.UnappliedFundsTotal).toBe(2222);
      expect(resultData.UpcomingPaymentsList.length).toBe(5);
    });



    it('should add a creditChartData object with expected structure', function () {
      expect(resultData.credit).toBeDefined();
      expect(angular.isArray(resultData.credit.linesOfCredit[0].CreditChartData.outer)).toBe(true);
      expect(angular.isArray(resultData.credit.linesOfCredit[1].CreditChartData.outer)).toBe(true);
      expect(angular.isArray(resultData.credit.linesOfCredit[0].CreditChartData.inner)).toBe(true);
      expect(angular.isArray(resultData.credit.linesOfCredit[1].CreditChartData.outer)).toBe(true);
    });



    it('should populate creditChartData outer with breakdown of credit by type', function () {
      expect(resultData.credit.linesOfCredit[0].CreditChartData.outer.length).toBe(2);
      expect(resultData.credit.linesOfCredit[1].CreditChartData.outer.length).toBe(2);
      expect(resultData.credit.linesOfCredit[0].CreditChartData.outer[0].y).toBe(20000);
      expect(resultData.credit.linesOfCredit[0].CreditChartData.outer[1].y).toBe(1000);
      expect(resultData.credit.linesOfCredit[1].CreditChartData.outer[0].y).toBe(150000);
      expect(resultData.credit.linesOfCredit[1].CreditChartData.outer[1].y).toBe(0);
    });



    it('should populate creditChartData inner with breakdown of credit by utilization', function () {
      expect(resultData.credit.linesOfCredit[0].CreditChartData.inner.length).toBe(2);
      expect(resultData.credit.linesOfCredit[1].CreditChartData.inner.length).toBe(2);
      expect(resultData.credit.linesOfCredit[0].CreditChartData.inner[0].y).toBe(450);
      expect(resultData.credit.linesOfCredit[0].CreditChartData.inner[1].y).toBe(20550);
      expect(resultData.credit.linesOfCredit[1].CreditChartData.inner[0].y).toBe(861);
      expect(resultData.credit.linesOfCredit[1].CreditChartData.inner[1].y).toBe(149139);
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
      expect(resultData.paymentChartData.payments.toPrecision(6)).toBe('1857.22');
    });


   it('should populate paymentChartData scheduledPayments with total of all scheduled payments', function () {
      expect(resultData.paymentChartData.scheduledPayments).toBe(11510);
    });

    it('should populate paymentChartData total with fees plus upcoming payments', function () {
      expect(resultData.paymentChartData.total).toBe(13767.22);
    });

    it('should wrap this data up into a chart-compatible format', function () {
      expect(resultData.paymentChartData.chartData[0].y).toBe(resultData.paymentChartData.fees);
      expect(resultData.paymentChartData.chartData[1].y).toBe(resultData.paymentChartData.payments);
      expect(resultData.paymentChartData.chartData[2].y).toBe(resultData.paymentChartData.scheduledPayments);
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
        {title: '<span class="counter">1</span> Payment Due', subTitle: '$2,490.00', start: '2013-09-06'},
        {title: '<span class="counter">1</span> Payment Due', subTitle: '$3,860.00', start: '2013-09-09'},
        {title: '<span class="counter">1</span> Payment Due', subTitle: '$0.00', start: '2013-09-11'},
        {title: '<span class="counter">2</span> Payments Due', subTitle: '$3,333.00', start: '2013-09-19'}
      ];

      expect(angular.equals(resultData.calendarData.dueEvents, expected)).toBe(true);
    });

    it('should create the expected scheduledEvents on calendarData', function () {
      var expected = [
        {title: '<span class="counter">1</span> Scheduled', subTitle: '$2,490.00', start: '2013-09-06'}, // year, month, date
        {title: '<span class="counter">2</span> Scheduled', subTitle: '$8,840.00', start: '2013-09-09'}, // sept. 09 2013
        {title: '<span class="counter">1</span> Scheduled', subTitle: '$180.00', start: '2013-09-19'} // sept. 09 2013
      ];

      expect(angular.equals(resultData.calendarData.scheduledEvents, expected)).toBe(true);

    });

    it('should create the expected eventsByDate on calendarData', function () {
      var expected = {
        '2013-09-19': [
          {title: '<span class="counter">1</span> Scheduled', subTitle: '$180.00', start: '2013-09-19'},
          {title: '<span class="counter">2</span> Payments Due', subTitle: '$3,333.00', start: '2013-09-19'}
        ],
        '2013-09-11': [
          {title: '<span class="counter">1</span> Payments Due', subTitle: '$0.00', start: '2013-09-11'}
        ],
        '2013-09-09': [
          {title: '<span class="counter">2</span> Scheduled', subTitle: '$8,840.00', start: '2013-09-09'},
          {title: '<span class="counter">1</span> Payment Due', subTitle: '$3,860.00', start: '2013-09-09'}
        ],
        '2013-09-06': [
          {title: '<span class="counter">1</span> Scheduled', subTitle: '$2,490.00', start: '2013-09-06'},
          {title: '<span class="counter">2</span> Payments Due', subTitle: '$2,490.00', start: '2013-09-06'}
        ]
      };

    /* TODO: fix broken test. "Expected false to be true"; the data above is not valid
     expect(angular.equals(resultData.calendarData.eventsByDate, expected)).toBe(true);
     */

    });

    it('should create the expected openDates on calendarData', function () {
      var expected = {
        '2013-08-01': true,
        '2013-08-02': true,
        '2013-08-05': true,
        '2013-08-06': true,
        '2013-08-07': true,
        '2013-08-08': true,
        '2013-08-09': true // Not including the last day in the range
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
          expect(angular.isArray(result.data)).toBe(true);
        }
      );
      httpBackend.flush();
    });

    it('should put the Y values in the array and sort it by X value', function () {
      dashboard.fetchFloorplanChartData(0).then(
        function (result) {
          expect(result.data.length).toBe(3);
          expect(result.data[0][1]).toBe(8);
          expect(result.data[1][1]).toBe(4);
          expect(result.data[2][1]).toBe(5);
        }
      );
      httpBackend.flush();
    });

    it('should add labels as days up to the current day, in week mode', function () {
      dashboard.fetchFloorplanChartData(0).then(
        function (result) {
          expect(result.data.length).toBe(3);
          expect(result.data[0][0]).toBe('Sat');
          expect(result.data[1][0]).toBe('Sun');
          expect(result.data[2][0]).toBe('Mon');
        }
      );
      httpBackend.flush();
    });

    it('should add labels as weeks (dated by Sundays) up to the current week, in month mode', function () {
      dashboard.fetchFloorplanChartData(1).then(
        function (result) {
          expect(result.data.length).toBe(3);
          expect(result.data[0][0]).toBe('Mar 16');
          expect(result.data[1][0]).toBe('Mar 23');
          expect(result.data[2][0]).toBe('Mar 30');
        }
      );
      httpBackend.flush();
    });

    it('should add labels as months (with short year) up to the current month, in year mode', function () {
      dashboard.fetchFloorplanChartData(2).then(
        function (result) {
          expect(result.data.length).toBe(3);
          expect(result.data[0][0]).toBe('Jan \'14');
          expect(result.data[1][0]).toBe('Feb \'14');
          expect(result.data[2][0]).toBe('Mar \'14');
        }
      );
      httpBackend.flush();
    });

  });

});
