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
            then: function(success) {
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
            then: function(success) {
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
      },

      Payments: {
        canPayNow: function() {
          return {
            then: function() {
              return true;
            }
          };
        }
      }
    });
  }));

  it('should attach scheduledPayments.results to the scope', function () {
    expect(scope.scheduledPayments.results).toBeDefined();
  });

  it('should attach scheduledPayments.searchCriteria to the scope', function () {
    expect(scope.scheduledPayments.searchCriteria).toBeDefined();
  });

  it('should attach scheduledPayments.loading to the scope', function () {
    expect(scope.scheduledPayments.loading).toBeDefined();
  });

  it('should attach isCollapsed to the scope', function () {
    expect(scope.isCollapsed).toBeDefined();
  });

  describe('sortBy function', function(){
    it('should have a sortBy function', function(){
      expect(typeof scope.sortBy).toEqual('function');
    });

    it('should set sortField properly', function(){
      scope.sortBy('fieldA');
      expect(scope.sortField).toEqual('fieldA');

      scope.sortBy('fieldB');
      expect(scope.sortField).toEqual('fieldB');

      scope.sortBy('fieldB');
      expect(scope.sortField).toEqual('fieldB');

      scope.sortBy('fieldA');
      expect(scope.sortField).toEqual('fieldA');
    });

    it('should set sortDescending true only if sortBy is called consecutively with the same field name', function(){
      scope.sortBy('fieldB');
      expect(scope.sortDescending).toBeFalsy();

      scope.sortBy('fieldB');
      expect(scope.sortDescending).toBeTruthy();

      scope.sortBy('fieldB');
      expect(scope.sortDescending).toBeFalsy();

      scope.sortBy('fieldA');
      expect(scope.sortDescending).toBeFalsy();

      scope.sortBy('fieldA');
      expect(scope.sortDescending).toBeTruthy();

      scope.sortBy('fieldB');
      expect(scope.sortDescending).toBeFalsy();
    });

    it('should call search()', function(){
      spyOn(scope.scheduledPayments, 'search');
      scope.sortBy('fieldA');
      expect(scope.scheduledPayments.search).toHaveBeenCalled();
    });

  });

});
