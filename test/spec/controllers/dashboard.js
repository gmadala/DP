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
    $q;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Dashboard, Floorplan, FloorplanUtil, _$q_) {
    scope = $rootScope.$new();
    $q = _$q_;
    mockState = {
      transitionTo: jasmine.createSpy()
    }

    searchSpy = spyOn(Floorplan, 'search').andCallFake(function() {
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
  })

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
    it('should launch a modal dialog with the request credit increase form', inject(function($dialog) {
      spyOn($dialog, 'dialog').andCallFake(function() {
        return {
          open: angular.noop
        }
      });

      scope.onRequestCredIncr();
      expect($dialog.dialog).toHaveBeenCalled();
      expect($dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/requestCreditIncrease.html');
      expect($dialog.dialog.mostRecentCall.args[0].controller).toBe('RequestCreditIncreaseCtrl');
    }));
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
      data = {
        creditChartData: {},
        paymentChartData: {
          chartData: {}
        }
      };
    /*
    spyOn(dashboard, 'fetchDealerDashboard').andReturn($q.when(data));
    scope.$emit('setDateRange', start, end);
    expect(dashboard.fetchDealerDashboard).toHaveBeenCalledWith(start, end);
    scope.$apply();
    expect(scope.dashboardData).toBe(data);
     */
  });


  it('should have a filterPayments method that goes to payments page with initial filter', function() {
    expect(typeof scope.filterPayments).toBe('function');
    scope.filterPayments('foofers');
    expect(mockState.transitionTo).toHaveBeenCalledWith('payments', {filter: 'foofers'});
  });

});
