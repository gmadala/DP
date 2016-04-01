'use strict';

describe('Controller: DashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var DashboardCtrl,
    scope,
    dashboard,
    mockState,
    shouldSucceed = true,
    searchSpy,
    $q,
    dealerDashboardData = {
      "OverduePayments": 1,
      "OverduePaymentAmount": 340,
      "PaymentsDueToday": 3,
      "PaymentsDueTodayAmount": 1280.34,
      "UpcomingPayments": 4,
      "UpcomingPaymentsAmount": 13367.22,
      "AccountFees": 1,
      "AccountFeeAmount": 400,
      "LinesOfCredit": [
        {
          "CreditTypeName": "Heavy Trucks ( temp )",
          "LineOfCreditId": "59750fc5-c0f6-4170-8dec-8d16834ab484",
          "LineOfCreditAmount": 21000,
          "TempLineOfCreditAmount": 1000,
          "TempLineOfCreditExpiration": "2014-09-16T23:59:00",
          "AvailableCreditAmount": 20550,
          "UtilizedCreditAmount": 450,
          "CreditChartData": {
            "outer": [
              {
                "color": "#9F9F9F",
                "y": 20000
              },
              {
                "color": "#575757",
                "y": 1000
              }
            ],
            "inner": [
              {
                "color": "#3D9AF4",
                "y": 450
              },
              {
                "color": "#54BD45",
                "y": 20550
              }
            ]
          }
        },
        {
          "CreditTypeName": "Retail",
          "LineOfCreditId": "e5e8f773-df57-4f1d-a676-c1100fea356d",
          "LineOfCreditAmount": 150000,
          "TempLineOfCreditAmount": 0,
          "TempLineOfCreditExpiration": null,
          "AvailableCreditAmount": 149139,
          "UtilizedCreditAmount": 861,
          "CreditChartData": {
            "outer": [
              {
                "color": "#9F9F9F",
                "y": 150000
              },
              {
                "color": "#575757",
                "y": 0
              }
            ],
            "inner": [
              {
                "color": "#3D9AF4",
                "y": 861
              },
              {
                "color": "#54BD45",
                "y": 149139
              }
            ]
          }
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
          "ReceiptAmount": 480.34,
          "$receiptURL": "/receipt/view/abc123/Receipt?AuthToken=Mzc2ZWI4NmEtZGYxYS00MGRjLWIwYjUtYTI1MTIxMzk3YTNl"
        },
        {
          "FinancialTransactionId": "def456",
          "ReceiptDate": "2013-08-31",
          "ReceiptNumber": 789,
          "ReceiptAmount": 8120,
          "$receiptURL": "/receipt/view/def456/Receipt?AuthToken=Mzc2ZWI4NmEtZGYxYS00MGRjLWIwYjUtYTI1MTIxMzk3YTNl"
        },
        {
          "FinancialTransactionId": "ghi789",
          "ReceiptDate": "2013-08-22",
          "ReceiptNumber": 127,
          "ReceiptAmount": 2090.02,
          "$receiptURL": "/receipt/view/ghi789/Receipt?AuthToken=Mzc2ZWI4NmEtZGYxYS00MGRjLWIwYjUtYTI1MTIxMzk3YTNl"
        }
      ],
      "paymentChartData": {
        "fees": 400,
        "payments": 1857.2199999999993,
        "scheduledPayments": 11510,
        "total": 13767.22,
        "chartData": [
          {
            "name": "Fees",
            "color": "#9F9F9F",
            "y": 400
          },
          {
            "name": "Payments",
            "color": "#3399CC",
            "y": 1857.2199999999993
          },
          {
            "name": "Scheduled Payments",
            "color": "#1864A1",
            "y": 11510
          }
        ]
      },
      "calendarData": {
        "dueEvents": [
          {
            "title": "<span class=\"counter\">1</span> Payment Due",
            "subTitle": "$2,490.00",
            "start": "2013-09-06"
          },
          {
            "title": "<span class=\"counter\">1</span> Payment Due",
            "subTitle": "$3,860.00",
            "start": "2013-09-09"
          },
          {
            "title": "<span class=\"counter\">1</span> Payment Due",
            "subTitle": "$0.00",
            "start": "2013-09-11"
          },
          {
            "title": "<span class=\"counter\">2</span> Payments Due",
            "subTitle": "$3,333.00",
            "start": "2013-09-19"
          }
        ],
        "scheduledEvents": [
          {
            "title": "<span class=\"counter\">1</span> Scheduled",
            "subTitle": "$2,490.00",
            "start": "2013-09-06"
          },
          {
            "title": "<span class=\"counter\">2</span> Scheduled",
            "subTitle": "$8,840.00",
            "start": "2013-09-09"
          },
          {
            "title": "<span class=\"counter\">1</span> Scheduled",
            "subTitle": "$180.00",
            "start": "2013-09-19"
          }
        ],
        "eventsByDate": {
          "2013-09-06": [
            {
              "title": "<span class=\"counter\">1</span> Payment Due",
              "subTitle": "$2,490.00",
              "start": "2013-09-06"
            },
            {
              "title": "<span class=\"counter\">1</span> Scheduled",
              "subTitle": "$2,490.00",
              "start": "2013-09-06"
            }
          ],
          "2013-09-09": [
            {
              "title": "<span class=\"counter\">1</span> Payment Due",
              "subTitle": "$3,860.00",
              "start": "2013-09-09"
            },
            {
              "title": "<span class=\"counter\">2</span> Scheduled",
              "subTitle": "$8,840.00",
              "start": "2013-09-09"
            }
          ],
          "2013-09-11": [
            {
              "title": "<span class=\"counter\">1</span> Payment Due",
              "subTitle": "$0.00",
              "start": "2013-09-11"
            }
          ],
          "2013-09-19": [
            {
              "title": "<span class=\"counter\">2</span> Payments Due",
              "subTitle": "$3,333.00",
              "start": "2013-09-19"
            },
            {
              "title": "<span class=\"counter\">1</span> Scheduled",
              "subTitle": "$180.00",
              "start": "2013-09-19"
            }
          ]
        },
        "openDates": {
          "2014-08-23": true,
          "2014-08-24": true,
          "2014-08-28": true,
          "2014-08-29": true,
          "2014-08-30": true,
          "2014-08-31": true,
          "2014-08-25": true,
          "2014-09-01": true,
          "2014-09-05": true,
          "2014-09-08": true,
          "2014-09-09": true,
          "2014-09-10": true,
          "2014-09-11": true,
          "2014-09-15": true,
          "2014-09-18": true,
          "2014-09-19": true,
          "2014-09-22": true,
          "2014-09-24": true
        }
      }
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Dashboard, Floorplan, FloorplanUtil, _$q_, $uibModal) {
    scope = $rootScope.$new();
    $q = _$q_;
    mockState = {
      transitionTo: jasmine.createSpy()
    };

    searchSpy = spyOn(Floorplan, 'search').and.callFake(function() {
      if(shouldSucceed) {
        return $q.when({ Floorplans: ['one', 'two'] });
      } else {
        return $q.reject(false);
      }
    });

    dashboard = Dashboard;
    DashboardCtrl = $controller('DashboardCtrl', {
      $scope: scope,
      $state: mockState
    });

  }));

  describe('non-cached info', function() {
    beforeEach(function() {
      spyOn(dashboard, 'fetchDealerDashboard').and.callFake(function() {
        return $q.when(angular.copy(dealerDashboardData));
      });
    });

    it('should set up a default viewMode', function() {
      expect(scope.viewMode).toBe('week');
    });

    it('should have a changeViewMode function to toggle view mode', function() {
      expect(typeof scope.changeViewMode).toBe('function');
      scope.viewMode = 'week';
      scope.changeViewMode('month');
      expect(scope.viewMode).toBe('month');
    });

    it('should have an isWeekMode function to check if we are in week mode', function() {
      scope.viewMode = 'week';
      expect(scope.isWeekMode()).toBe(true);
    });

    it('should have an onClickButtonLink method to move to a new state', function() {
      scope.onClickButtonLink('payments');
      expect(mockState.transitionTo).toHaveBeenCalled();
    });

    describe('getDueStatus method', function(){
      var p = { DueDate: "2014-06-02"},
          clock;

      beforeEach(function () {
        clock = sinon.useFakeTimers(moment([2014, 6, 2]).valueOf(), 'Date');
      });

      afterEach(function () {
        clock.restore();
      });

      it('should return "overdue" if today is past the due date', function() {
        expect(scope.getDueStatus(p)).toBe('overdue');
      });

      it('should return "today" if today is the due date', function() {
        p.DueDate = "2014-07-02";
        expect(scope.getDueStatus(p)).toBe('today');
      });

      it('should return "future" if today is in the future', function() {
        p.DueDate = "2014-08-02";
        expect(scope.getDueStatus(p)).toBe('future');
      });
    });

    describe('onRequestCredIncr method', function() {
      it('should launch a modal dialog with the request credit increase form', inject(function($uibModal) {
        spyOn($uibModal, 'open').and.callFake(function() {
          return {
            open: angular.noop
          }
        });

        scope.onRequestCredIncr();
        expect($uibModal.open).toHaveBeenCalled();
        expect($uibModal.open.calls.mostRecent().args[0].templateUrl).toBe('client/shared/modals/request-credit-increase/request-credit-increase.template.html');
        expect($uibModal.open.calls.mostRecent().args[0].controller).toBe('RequestCreditIncreaseCtrl');
      }));
    });

    it('should call for data on a setDateRange event and attach the result to the scope', function() {
      var start = new Date(),
        end = new Date();

      scope.$emit('setDateRange', start, end);
      expect(dashboard.fetchDealerDashboard).toHaveBeenCalledWith(start, end);
      scope.$apply();
      expect(scope.dashboardData).toBeDefined();
    });

    it('should add a View All option to the Lines of Credit list', function() {
      scope.$emit('setDateRange', new Date(), new Date());
      scope.$apply();
      expect(scope.dashboardData.LinesOfCredit.length).toBe(3);
    });

    it('should aggregate the line of credit values for the View All option', function() {
      scope.$emit('setDateRange', new Date(), new Date());
      scope.$apply();
      var viewAll = scope.dashboardData.LinesOfCredit[0];
      var loc1 = scope.dashboardData.LinesOfCredit[1];
      var loc2 = scope.dashboardData.LinesOfCredit[2];
      expect(viewAll.LineOfCreditAmount).toBe(loc1.LineOfCreditAmount + loc2.LineOfCreditAmount);
      expect(viewAll.TempLineOfCreditAmount).toBe(loc1.TempLineOfCreditAmount + loc2.TempLineOfCreditAmount);
      expect(viewAll.AvailableCreditAmount).toBe(loc1.AvailableCreditAmount + loc2.AvailableCreditAmount);
      expect(viewAll.UtilizedCreditAmount).toBe(loc1.UtilizedCreditAmount + loc2.UtilizedCreditAmount);
    });

    it('should have a filterPayments method that goes to payments page with initial filter', function() {
      expect(typeof scope.filterPayments).toBe('function');
      scope.filterPayments('foofers');
      expect(mockState.transitionTo).toHaveBeenCalledWith('payments', {filter: 'foofers'});
    });

    it('should have a filterFloorplans method that goes to floorplan page with initial filter', function() {
      expect(typeof scope.filterFloorplans).toBe('function');
      scope.filterFloorplans('foofers');
      expect(mockState.transitionTo).toHaveBeenCalledWith('floorplan', {filter: 'foofers'});
    });
  });

  describe('cached summary values', function() {
    var $httpBackend,
        $rootScope,
        myWeek,
        myMonth,
        otherWeek,
        otherMonth,
        currentScenario;

    beforeEach(inject(function(_$httpBackend_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      currentScenario = 'myWeek';

      myWeek = {
        "OverduePayments": 1,
        "OverduePaymentAmount": 340,
        "PaymentsDueToday": 3,
        "PaymentsDueTodayAmount": 1280.34,
        "UpcomingPayments": 4,
        "UpcomingPaymentsAmount": 13367.22,
        "AccountFees": 1,
        "AccountFeeAmount": 400
      };

      otherWeek = {
        "OverduePayments": 7,
        "OverduePaymentAmount": 1000,
        "PaymentsDueToday": 0,
        "PaymentsDueTodayAmount": 0,
        "UpcomingPayments": 2,
        "UpcomingPaymentsAmount": 3000,
        "AccountFees": 0,
        "AccountFeeAmount": 0
      };

      myMonth = {
        "OverduePayments": 2,
        "OverduePaymentAmount": 720.55,
        "PaymentsDueToday": 4,
        "PaymentsDueTodayAmount": 2500,
        "UpcomingPayments": 3,
        "UpcomingPaymentsAmount": 14000.68,
        "AccountFees": 2,
        "AccountFeeAmount": 500
      };

      otherMonth = {
        "OverduePayments": 0,
        "OverduePaymentAmount": 0,
        "PaymentsDueToday": 1,
        "PaymentsDueTodayAmount": 2500,
        "UpcomingPayments": 10,
        "UpcomingPaymentsAmount": 50000,
        "AccountFees": 2,
        "AccountFeeAmount": 600
      };

      spyOn(dashboard, 'fetchDealerDashboard').and.callFake(function() {
        var toReturn = {};

        if (currentScenario === 'myWeek') {
          toReturn = myWeek;
        } else if (currentScenario === 'myMonth') {
          toReturn = myMonth;
        } else if (currentScenario === 'otherWeek') {
          toReturn = otherWeek;
        } else if (currentScenario === 'otherMonth') {
          toReturn = otherMonth;
        }

        return $q.when(angular.extend({
          "LinesOfCredit": [],
          "paymentChartData": {}
        }, toReturn));
      });
    }));

    it('should cache summary values for this week', function() {
      scope.$broadcast('setDateRange', new Date(2014, 9, 5), new Date(2014, 9, 12));
      $rootScope.$digest();

      expect(scope.paymentSummary.week).toEqual(myWeek);

      currentScenario = 'otherWeek';
      scope.$broadcast('setDateRange', new Date(2014, 9, 5), new Date(2014, 9, 12));
      $rootScope.$digest();

      expect(scope.paymentSummary.week).toEqual(myWeek);
    });

    it('should cache summary values for this month', function() {
      currentScenario = 'myMonth';
      scope.changeViewMode('month');
      scope.$broadcast('setDateRange', new Date(2014, 8, 1), new Date(2014, 8, 30));
      scope.$apply();
      expect(scope.paymentSummary.month).toEqual(myMonth);

      currentScenario = 'otherMonth';
      scope.$broadcast('setDateRange', new Date(2014, 9, 1), new Date(2014, 9, 31));
      scope.$apply();
      expect(scope.paymentSummary.month).toEqual(myMonth);
    });
  });
});
