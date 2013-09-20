'use strict';

describe('Controller: AfterHoursCheckoutCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AfterHoursCheckoutCtrl,
    scope,
    dialog,
    ejectedFees,
    ejectedPayments,
    autoScheduleDate;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    dialog = { close: angular.noop };
    ejectedFees = ['foo'];
    ejectedPayments = ['bar'];
    autoScheduleDate = new Date();

    AfterHoursCheckoutCtrl = $controller('AfterHoursCheckoutCtrl', {
      $scope: scope,
      dialog: dialog,
      ejectedFees: ejectedFees,
      ejectedPayments: ejectedPayments,
      autoScheduleDate : autoScheduleDate
    });
  }));

  it('should attach ejectedFees to the scope', function () {
    expect(scope.ejectedFees).toBe(ejectedFees);
  });

  it('should attach ejectedPayments to the scope', function () {
    expect(scope.ejectedPayments).toBe(ejectedPayments);
  });

  it('should attach autoScheduleDate to the scope', function () {
    expect(scope.autoScheduleDate).toBe(autoScheduleDate);
  });

  it('should provide a close method that closes the dialog', function () {
    spyOn(dialog, 'close');
    scope.close();
    expect(dialog.close).toHaveBeenCalled();
  });
});
