'use strict';

describe('Controller: PaymentDetailsCtrl', function () {
  beforeEach(module('nextgearWebApp'));

  var PaymentDetailsCtrl,
    scope,
    dialog,
    activityMock;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    dialog = {
      close: angular.noop
    };

    activityMock = {
      FloorplanId: '456id',
      StockNumber: 45,
      FloorplanStatusName: 'Approved',
      Description: 'a description',
      EffectiveDate: '2014-07-13',
      ReceiptNumber: 7891,
      PaymentDate: '2014-07-14',
      PaymentMethod: 'ACH',
      Account: 'My Account',
      InterestPaid: 44.66,
      PrincipalPaid: 270.50,
      CollateralProtectionPaid: 0,
      PaymentItems: [
        {
          ItemName: 'Interest',
          ItemAmount: 44.66
        },
        {
          ItemName: 'Principal',
          ItemAmount: 270.50
        },
        {
          ItemName: 'Fee - Floorplan/Curtailment',
          ItemAmount: 85.00
        },
        {
          ItemName: 'Fee - Record Services',
          ItemAmount: 18.00
        }
      ],
      TotalPaymentAmount: 423.50,
      ReceiptTotal: 500
    };

    PaymentDetailsCtrl = $controller('PaymentDetailsCtrl', {
      $scope: scope,
      dialog: dialog,
      activity: activityMock
    });

    $rootScope.$digest();
  }));

  it('should attach the given payment information to the scope', function () {
    expect(scope.payment).toBeDefined();
  });

  it('should have a close function that calls dialog.close', function() {
    expect(typeof scope.close).toBe('function');

    spyOn(dialog, 'close');
    scope.close();
    expect(dialog.close).toHaveBeenCalled();
  });
});
