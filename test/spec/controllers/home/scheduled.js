'use strict';

describe('Controller: ScheduledCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var ScheduledCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScheduledCtrl = $controller('ScheduledCtrl', {
      $scope: scope,

      ScheduledPaymentsSearch: {
        search: function() {
          return {
            then: function(success, error) {
              success([{
                vin: '',
                description: '',
                stockNumber: '',
                status: '',
                scheduledDate: '',
                setupDate: '',
                payoffAmount: 1000,
                curtailmentAmount: 1000,
                scheduledBy: ''
              }]);
            }
          };
        },
        loadMoreData: function() {
          return {
            then: function(success, error) {
              success([{
                vin: '',
                description: '',
                stockNumber: '',
                status: '',
                scheduledDate: '',
                setupDate: '',
                payoffAmount: 1000,
                curtailmentAmount: 1000,
                scheduledBy: ''
              }]);
            }
          };
        }
      }
    });
  }));

  it('should attach scheduledPayments.results to the scope', function () {
    expect(scope.scheduledPayments.results).toBeDefined();
  });

  it('should attach scheduledPayments.criteria to the scope', function () {
    expect(scope.scheduledPayments.criteria).toBeDefined();
  });

  it('should attach scheduledPayments.loading to the scope', function () {
    expect(scope.scheduledPayments.loading).toBeDefined();
  });

  it('should attach isCollapsed to the scope', function () {
    expect(scope.isCollapsed).toBeDefined();
  });

});
