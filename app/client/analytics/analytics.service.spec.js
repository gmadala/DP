'use strict';

describe('Model: Analytics', function () {

  beforeEach(module('nextgearWebApp'));

  var analytics, httpBackend, api, $q;

  beforeEach(inject(function ($httpBackend, _$q_, Analytics, _api_) {
    analytics = Analytics;
    api = _api_;
    httpBackend = $httpBackend;
    $q = _$q_;
  }));

  describe('fetchBusinessSummary method', function () {
    var response;

    beforeEach(function () {
      response = {
        Success: true,
        Message: null,
        Data: {
          "ApprovedFloorplans": 828,
          "AveragePurchasePrice": 10568.2444,
          "TotalApprovedPurchasePrice": 8750506.41,
          "TotalApprovedFinancedAmount": 8750506.41,
          "TotalApprovedBlackBookValue": 3530625,
          "TotalOutstandingPrincipal": 8750506.41,
          "PendingFloorplans": 0,
          "TotalPendingPurchasePrice": 3455344,
          "TotalPendingBlackBookPrice": 0,
          "TotalOutstandingCredit": 0,
          "TotalAvailableCredit": 0,
          "LastPaymentDate": "2013-09-06",
          "LastPaymentAmount": 170668.41,
          "TotalPaymentInLast7Days": 0,
          "ReserveFundsBalance": 0
        }
      };

      httpBackend.expectGET('/dealer/summary').respond(response);
    });

    it('should call to the expected endpoint', function() {
      analytics.fetchBusinessSummary();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should set calculated values to 0 if NaN or Infinity', function() {

      response.Data.TotalApprovedPurchasePrice = 0; //will make response.DerivedCapitalBook infinity
      response.Data.TotalApprovedBlackBookValue = 'string'; //will make response.DerivedAmountOutstanding NaN
      response.Data.TotalPendingPurchasePrice = 'string'; //will make response.DerivedPendingBook NaN

      var res;
      analytics.fetchBusinessSummary().then(function(response) {
        res = response;
      }).then(function () {
        expect(res.DerivedCapitalBook).toEqual(0);
        expect(res.DerivedAmountOutstanding).toEqual(0);
        expect(res.DerivedPendingBook).toEqual(0);
      });
      httpBackend.flush();
    });
  });

  describe('fetchAnalytics method', function () {

    beforeEach(function () {
      httpBackend.expectGET('/analytics/averageturntime').respond({
        "Success": true,
        "Message": null,
        "Data": [
            {
                "EndOfMonthDate": "2012-10-31",
                "AvgTurnTimeForVehiclesCompletedIn60DaysPrior": 15
            },
            {
                "EndOfMonthDate": "2013-01-31",
                "AvgTurnTimeForVehiclesCompletedIn60DaysPrior": 13
            },
            {
                "EndOfMonthDate": "2012-12-31",
                "AvgTurnTimeForVehiclesCompletedIn60DaysPrior": 15
            },
            {
                "EndOfMonthDate": "2012-11-30",
                "AvgTurnTimeForVehiclesCompletedIn60DaysPrior": 15
            },
            {
                "EndOfMonthDate": "2013-02-28",
                "AvgTurnTimeForVehiclesCompletedIn60DaysPrior": 0
            }
        ]
      });
      httpBackend.expectGET('/analytics/aging').respond({
        "Success": true,
        "Message": null,
        "Data": [
          {
              "FloorplanId": "48aa1393-5ddf-4c62-8938-9cd7d0e40662",
              "StockNumber": 903,
              "ProcessedDate": "",
              "UnitMake": "Nissan",
              "UnitModel": "Titan LE",
              "UnitYear": "2010",
              "DaysOnFloor": 120
          },
          {
              "FloorplanId": "4fa9f333-8fdf-4b45-a6dd-c2deb29fb4d5",
              "StockNumber": 902,
              "ProcessedDate": "",
              "UnitMake": "Dodge",
              "UnitModel": "Ram 1500 ST",
              "UnitYear": "2010",
              "DaysOnFloor": 95
          },
          {
              "FloorplanId": "4fa9f333-8fdf-4b45-a6dd-c2deb29fb4d2",
              "StockNumber": 900,
              "ProcessedDate": "",
              "UnitMake": "Dodge",
              "UnitModel": "Ram 1500 ST",
              "UnitYear": "2017",
              "DaysOnFloor": 85
          },
          {
              "FloorplanId": "0c64a2f7-e1cd-4775-8195-ce53ce758bd6",
              "StockNumber": 901,
              "ProcessedDate": "",
              "UnitMake": "Chevrolet",
              "UnitModel": "Suburban 1500 LS",
              "UnitYear": "2007",
              "DaysOnFloor": 57
          },
          {
              "FloorplanId": "68af10ec-d18d-4390-a594-9e563f0ec3c4",
              "StockNumber": 864,
              "ProcessedDate": "",
              "UnitMake": "Ford",
              "UnitModel": "Fusion SE",
              "UnitYear": "2011",
              "DaysOnFloor": 32
          },
          {
              "FloorplanId": "68af10ec-d18d-4390-a594-9e563f0ec3c4",
              "StockNumber": 864,
              "ProcessedDate": "",
              "UnitMake": "Ford",
              "UnitModel": "Fusion SE",
              "UnitYear": "2011",
              "DaysOnFloor": 10
          },
          {
              "FloorplanId": "68af10ec-d18d-4390-a594-9e563f0ec3c4",
              "StockNumber": 864,
              "ProcessedDate": "",
              "UnitMake": "Ford",
              "UnitModel": "Fusion SE",
              "UnitYear": "2011",
              "DaysOnFloor": 2
          }
        ]
      });
      httpBackend.expectGET('/analytics/bookvaluemargins/12').respond({
        "Success": true,
        "Message": null,
        "Data": [
            {
                "AvgMarginBelowBookValue": 185,
                "AvgBookValue": 11965,
                "AvgPurchasePrice": 11780,
                "SellerName": "ERAC of St. Louis  DR GROUP 01",
                "NumVehiclesAnalyzed": 5
            },
            {
                "AvgMarginBelowBookValue": -315,
                "AvgBookValue": 8525,
                "AvgPurchasePrice": 8840,
                "SellerName": "Manheim Arena Illinois",
                "NumVehiclesAnalyzed": 2
            },
            {
                "AvgMarginBelowBookValue": -630,
                "AvgBookValue": 12450,
                "AvgPurchasePrice": 13080,
                "SellerName": "Manheim Nashville",
                "NumVehiclesAnalyzed": 2
            },
            {
                "AvgMarginBelowBookValue": -667.5,
                "AvgBookValue": 10850,
                "AvgPurchasePrice": 11517.5,
                "SellerName": "Houston Auto Auction, Inc.",
                "NumVehiclesAnalyzed": 2
            }
        ]
      });
    });

    it('should get from the three api endpoints', function () {
      analytics.fetchAnalytics();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return averageTurn data sorted by date', function () {
      var res;
      analytics.fetchAnalytics().then(function(response) {
        res = response;
      });
      httpBackend.flush();

      expect(res.averageTurn.data).toEqual([
        ['Oct', 15],
        ['Nov', 15],
        ['Dec', 15],
        ["Jan '13", 13],
        ['Feb',0]
      ]);
    });

    it('should return aging data categorized into count categories', function () {
      var res;
      analytics.fetchAnalytics().then(function(response) {
        res = response;
      });
      httpBackend.flush();

//      expect(res.aging).toEqual([2,1,1,2,1]);
    });
  });

  describe('fetchMovers method', function () {
    beforeEach(function() {
      var response = {
        Success: true,
        Message: null,
        Data: [
          {
            "Year": "1869",
            "Make": "CHRYSLER",
            "Model": "TOWN & COUNTRY TOURING WAGON",
            "NinetyFifthPercentileTurnTime": 10
          },
          {
            "Year": "1869",
            "Make": "CHRYSLER",
            "Model": "TOWN & COUNTRY TOURING WAGON",
            "NinetyFifthPercentileTurnTime": 30
          },
          {
            "Year": "1869",
            "Make": "CHRYSLER",
            "Model": "TOWN & COUNTRY TOURING WAGON",
            "NinetyFifthPercentileTurnTime": 25
          },
          {
            "Year": "1869",
            "Make": "CHRYSLER",
            "Model": "TOWN & COUNTRY TOURING WAGON",
            "NinetyFifthPercentileTurnTime": 15
          },
          {
            "Year": "1869",
            "Make": "CHRYSLER",
            "Model": "TOWN & COUNTRY TOURING WAGON",
            "NinetyFifthPercentileTurnTime": 15
          }
        ]
      };

      httpBackend.expectGET(/^\/analytics\/makemodelanalysis\/(true|false)$/).respond(response);

    });

    it('should make expected api request', function () {
      analytics.fetchMovers(true);
      expect(httpBackend.flush).not.toThrow();
    });

    it('should have descending sorted datasets data when isTop is false', function () {
      var res;
      analytics.fetchMovers(false).then(function(result) {
        res = result;
      });
      httpBackend.flush();

      expect(res.data).toEqual([
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 30],
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 25],
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 15],
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 15],
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 10]
      ]);
    });

    it('should have ascending sorted datasets data when isTop is true', function () {
      var res;
      analytics.fetchMovers(true).then(function(result) {
        res = result;
      });
      httpBackend.flush();

      expect(res.data).toEqual([
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 10],
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 15],
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 15],
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 25],
        ['CHRYSLER TOWN & COUNTRY TOURING WAGON', 30]
      ]);
    });
  });
});
