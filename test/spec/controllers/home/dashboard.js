'use strict';

describe('Controller: DashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var DashboardCtrl,
    scope,
    dashboard,
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Dashboard, _$q_) {
    scope = $rootScope.$new();
    $q = _$q_;
    dashboard = Dashboard;
    DashboardCtrl = $controller('DashboardCtrl', {
      $scope: scope
    });
  }));

  it('should set up a default viewMode', function() {
    expect(scope.viewMode).toBe('week');
  });

  describe('tooLong method', function() {

    it('should work for a small displayed number', function () {
      expect(scope.tooLong(5, '$0[.]00a')).toBeFalsy();
    });

    it('should work for a small displayed number', function () {
      expect(scope.tooLong(50, '$0[.]00a')).toBeFalsy();
    });

    it('should work for a small displayed number', function () {
      expect(scope.tooLong(50000, '$0[.]00a')).toBeFalsy();
    });

    it('should work for a large displayed number', function () {
      expect(scope.tooLong(569.45, '$0[.]00a')).toBeTruthy();
    });

    it('should work for a large displayed number', function () {
      expect(scope.tooLong(56945, '$0[.]00a')).toBeTruthy();
    });

    it('should work for a large displayed number', function () {
      expect(scope.tooLong(569454, '$0[.]00a')).toBeTruthy();
    });
  });

  it('should call for data on a setDateRange event and attach the result to the scope', function() {
    var start = new Date(),
      end = new Date(),
      data = {};

    spyOn(dashboard, 'fetchDealerDashboard').andReturn($q.when(data));
    scope.$emit('setDateRange', start, end);
    expect(dashboard.fetchDealerDashboard).toHaveBeenCalledWith(start, end);
    scope.$apply();
    expect(scope.dashboardData).toBe(data);
  });

});
