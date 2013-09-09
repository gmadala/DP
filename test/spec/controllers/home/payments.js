'use strict';

describe('Controller: PaymentsCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var PaymentsCtrl,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PaymentsCtrl = $controller('PaymentsCtrl', {
      $scope: scope,

      // Mock Payments model/service
      Payments: {
        search: function() {
          return {
            then: function(success) {
              success([{}]);
            }
          }
        }
      }

    });
  }));

  it('should attach a list of results to the scope', function () {
    scope.search();
    expect(scope.results).toBeDefined();
  });

});
