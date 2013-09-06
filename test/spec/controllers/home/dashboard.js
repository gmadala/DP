'use strict';

describe('Controller: DashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var DashboardCtrl,
    scope,
    dashMock = {
      fetchDealerDashboard: function() {
        return {
          then: function(success) {
            success({});
          }
        };
      }
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {

    scope = $rootScope.$new();
    DashboardCtrl = $controller('DashboardCtrl', {
      $scope: scope,
      Dashboard: dashMock
    });
  }));

  it('should set up a default viewMode', function() {
    expect(scope.viewMode).toBe('week');
  });

  it('should call for data on a setDateRange event and attach the data promise to the scope', function() {
    var start = new Date(),
      end = new Date(),
      fakePromise = {};

    spyOn(dashMock, 'fetchDealerDashboard').andReturn(fakePromise);
    scope.$emit('setDateRange', start, end);
    expect(dashMock.fetchDealerDashboard).toHaveBeenCalledWith(start, end);
    expect(scope.dashboardData).toBe(fakePromise);
  });

});
