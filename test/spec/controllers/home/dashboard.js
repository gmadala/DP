'use strict';

describe('Controller: DashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var DashboardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {

    scope = $rootScope.$new();
    DashboardCtrl = $controller('DashboardCtrl', {
      $scope: scope,

      Payments: {
        fetchSummary: function() {
          return {
            then: function(success, error) {
              success({
                overdue:     { quantity: 1, amount: 0 },
                dueToday:    { quantity: 1, amount: 0 },
                thisWeek:    { quantity: 1, amount: 0 },
                accountFees: { quantity: 1, amount: 0 },
                chartData:   [
                  { color: "#66554E", value: 10470 },
                  { color: "#897A71", value: 10000 },
                  { color: "#B4A8A0", value: 10000 }
                ]
              });
            }
          };
        },
        fetchUpcomingPayments: function() {
          return {
            then: function(success, error) {
              success([])
            }
          };
        },
        fetchUpcomingCalendar: function() {
          return {
            then: function(success, error) {
              success({
                dueEvents: [],
                scheduledEvents: [],
                eventsByDate: [],
                openDates: []
              });
            }
          };
        }
      },
      Receipts: {
        fetchRecent: function() {
          return {
            then: function(success, error) {
              success({
                ReceiptRowCount: 0,
                Receipts: []
              });
            }
          };
        },
        search: function() {
          return {
            then: function(success, error) {
              success({
                ReceiptRowCount: 0,
                Receipts: []
              });
            }
          };
        }
      },
      DealerCredit: {
        fetch: function() {
          return {
            then: function(success) {
              success({});
            }
          };
        }
      },
      Floorplan: {
        fetchStatusSummary: function() {
          return {
            then: function(success) {
              success({});
            }
          };
        }
      }
    });
  }));

  it('should attach isCollapsed to the scope', function () {
    expect(scope.isCollapsed).toBe(true);
  });

  it('should attach a viewMode to the scope', function () {
    expect(scope.viewMode).toBeDefined();
  });

  it('should attach a list of upcoming payments to the scope', function() {
    expect(scope.upcomingPayments).toBeDefined();
  });

  it('should attach a payment summary to the scope', function() {
    expect(scope.summary).toBeDefined();
  });

  it('should attach a list of recent receipts to the scope', function() {
    expect(scope.recentReceipts).toBeDefined();
  });

  it('should attach some credit information to the scope', function() {
    expect(scope.credit).toBeDefined();
  });

  it('should attach a floorplan status summary to the scope', function() {
    expect(scope.floorplanSummary).toBeDefined();
  });

});
