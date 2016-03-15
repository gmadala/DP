'use strict';

describe('Controller: MultipleVehiclesCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var MultipleVehiclesCtrl,
    scope,
    dialogMock,
    matchListMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    dialogMock = {
      close: angular.noop
    };

    matchListMock = [
      {someValue: 'foo'},
      {someValue: 'bar'}
    ];

    scope = $rootScope.$new();
    MultipleVehiclesCtrl = $controller('MultipleVehiclesCtrl', {
      $scope: scope,
      $uibModalInstance: dialogMock,
      matchList: matchListMock
    });
  }));

  it('should attach the match list to the scope', function () {
    expect(scope.matches).toBe(matchListMock);
  });

  it('should expose a select function that closes the dialog with the provided value', function () {
    spyOn(dialogMock, 'close');
    expect(typeof scope.select).toBe('function');
    scope.select('foo');
    expect(dialogMock.close).toHaveBeenCalledWith('foo');
  });

  it('should expose a close function that closes the dialog with no value', function () {
    spyOn(dialogMock, 'close');
    expect(typeof scope.close).toBe('function');
    scope.close();
    expect(dialogMock.close).toHaveBeenCalledWith();
  });
});
