'use strict';

describe('Controller: FeeDetailsCtrl', function () {
  beforeEach(module('nextgearWebApp'));

  var FeeDetailsCtrl,
    scope,
    dialog,
    activityMock;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    dialog = {
      close: angular.noop
    };

    activityMock = {
      FloorplanId: '123id',
      StockNumber: 45,
      FloorplanStatusName: 'Approved',
      Description: 'a description',
      EffectiveDate: '2014-07-14',
      PostedDate: '2014-07-12',
      FeeName: 'this is a fee',
      FeeAmount: 87.65,
      FeeTotal: 87.65
    };

    FeeDetailsCtrl = $controller('FeeDetailsCtrl', {
      $scope: scope,
      dialog: dialog,
      activity: activityMock
    });

    $rootScope.$digest();
  }));

  it('should attach the given fee information to the scope', function () {
    expect(scope.fee).toBeDefined();
  });

  it('should have a close function that calls dialog.close', function() {
    expect(typeof scope.close).toBe('function');

    spyOn(dialog, 'close');
    scope.close();
    expect(dialog.close).toHaveBeenCalled();
  });
});
