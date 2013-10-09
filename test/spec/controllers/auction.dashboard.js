'use strict';

describe('Controller: AuctionDashboardCtrl', function() {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AuctionDashboardCtrl,
    scope,
    dashboard;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $q, Dashboard) {
    scope = $rootScope.$new();

    spyOn(Dashboard, 'fetchAuctionDashboard').andReturn($q.when('dashboard data'));
    spyOn(Dashboard, 'fetchFloorplanChartData').andReturn($q.when('floorplan chart data'));

    dashboard = Dashboard;

    AuctionDashboardCtrl = $controller('AuctionDashboardCtrl', {
      $scope: scope
    });
  }));

  it('should call for dashboard data', function () {
    expect(dashboard.fetchAuctionDashboard).toHaveBeenCalled();
  });

  it('should attach a promise of dashboard data results to the scope', function () {
    expect(scope.dashboardData).toBeDefined();
    scope.dashboardData.then(function (result) {
      expect(result).toBe('dashboard data');
    });
    scope.$apply();
  });

  it('should default selectedFloorplanChart to month', function () {
    expect(scope.selectedFloorplanChart).toBe('month');
  });

  it('should call for floorplan chart data by month', function () {
    scope.$apply();
    expect(dashboard.fetchFloorplanChartData).toHaveBeenCalledWith(1);
  });

  it('should attach a promise of floorplan chart data results to the scope', function () {
    scope.$apply();
    expect(scope.chartData).toBeDefined();
    scope.chartData.then(function (result) {
      expect(result).toBe('floorplan chart data');
    });
    scope.$apply();
  });

  it('should re-fetch chart data when selectedFloorplanChart changes', function () {
    dashboard.fetchFloorplanChartData.reset();
    scope.selectedFloorplanChart = 'year';
    scope.$apply();
    expect(dashboard.fetchFloorplanChartData).toHaveBeenCalledWith(2);

    dashboard.fetchFloorplanChartData.reset();
    scope.selectedFloorplanChart = 'week';
    scope.$apply();
    expect(dashboard.fetchFloorplanChartData).toHaveBeenCalledWith(0);
  });

});
