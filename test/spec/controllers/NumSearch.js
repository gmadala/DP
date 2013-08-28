'use strict';

describe('Controller: NumSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var NumsearchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NumsearchCtrl = $controller('NumSearchCtrl', {
      $scope: scope,
      dialog: {
        close: function() {}
      },
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
