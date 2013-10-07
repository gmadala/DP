'use strict';

describe('Controller: FloorCarCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorCarCtrl,
    scope,
    protect,
    q,
    userMock,
    optionSetMock = [],
    dialogMock,
    floorplanMock,
    blackbookMock,
    vinLookupResult,
    confirmResult,
    createResult,
    paySellerOpts;

  // Initialize the controller and mocks
  beforeEach(inject(function ($controller, $rootScope, _protect_, $q) {
    scope = $rootScope.$new();
    protect = _protect_;
    q = $q;
    paySellerOpts = [false, true];
    dialogMock = {
      dialog: function () {
        return {
          open: function () {
            return $q.resolved(confirmResult);
          }
        };
      },
      messageBox: function () {
        return {
          open: angular.noop
        };
      }
    };
    floorplanMock = {
      create: function () {
        return $q.resolved(createResult);
      }
    };
    blackbookMock = {
      fetchVehicleTypeInfoForVin: function () {
        return $q.resolved(vinLookupResult);
      }
    };

    userMock = {
      getStatics: function () {
        return {
          locations: optionSetMock,
          linesOfCredit: optionSetMock,
          bankAccounts: optionSetMock
        };
      },
      getPaySellerOptions: function () {
        return paySellerOpts;
      },
      canPayBuyer: function () {
        return undefined;
      }
    };

    FloorCarCtrl = $controller('FloorCarCtrl', {
      $scope: scope,
      User: userMock,
      $dialog: dialogMock,
      Floorplan: floorplanMock,
      Blackbook: blackbookMock
    });
  }));

  it('should attach getStatics from user to the scope as options', function () {
    expect(scope.options).toBe(userMock.getStatics);
  });

  it('should attach getPaySellerOptions from user to the scope', function () {
    expect(scope.paySellerOptions).toBe(userMock.getPaySellerOptions);
  });

  it('should attach canPayBuyer from user to the scope', function () {
    expect(scope.canPayBuyer).toBe(userMock.canPayBuyer);
  });

  it('should attach a default data object to the scope', function () {
    expect(scope.defaultData).toBeDefined();
  });

  it('should default the sale date to the current date, midnight', function () {
    // time information will be stripped off when sending to API, but angular-strap datepicker is fussy about time
    var today = new Date();
    today.setFullYear(today.getFullYear());
    today.setMonth(today.getMonth());
    today.setDate(today.getDate());
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    expect(scope.defaultData.UnitPurchaseDate.toUTCString()).toBe(today.toUTCString());
  });

  it('should set FloorplanSourceId to 6', function () {
    expect(scope.defaultData.FloorplanSourceId).toBe(6);
  });

  it('should default vin failure acknowledged and trade-in to false', function () {
    expect(scope.defaultData.SaleTradeIn).toBe(false);
    expect(scope.defaultData.VinAckLookupFailure).toBe(false);
  });

  it('should default everything else to null', function () {
    expect(scope.defaultData.BankAccountId).toBe(null);
    expect(scope.defaultData.PaySeller).toBe(null);
    expect(scope.defaultData.LineOfCreditId).toBe(null);
    expect(scope.defaultData.PhysicalInventoryAddressId).toBe(null);
    expect(scope.defaultData.BusinessId).toBe(null);
    expect(scope.defaultData.UnitColorId).toBe(null);
    expect(scope.defaultData.UnitMake).toBe(null);
    expect(scope.defaultData.UnitMileage).toBe(null);
    expect(scope.defaultData.UnitModel).toBe(null);
    expect(scope.defaultData.UnitPurchasePrice).toBe(null);
    expect(scope.defaultData.UnitStyle).toBe(null);
    expect(scope.defaultData.UnitTitleNumber).toBe(null);
    expect(scope.defaultData.UnitTitleStateId).toBe(null);
    expect(scope.defaultData.UnitVin).toBe(null);
    expect(scope.defaultData.UnitYear).toBe(null);
    expect(scope.defaultData.TitleLocationId).toBe(null);
    expect(scope.defaultData.TitleTypeId).toBe(null);
    expect(scope.defaultData.ConsignerTicketNumber).toBe(null);
    expect(scope.defaultData.LotNumber).toBe(null);
    expect(scope.defaultData.$selectedVehicle).toBe(null);
    expect(scope.defaultData.$blackbookMileage).toBe(null);
  });

  it('should initialize live data with default data', function () {
    expect(angular.equals(scope.defaultData, scope.data)).toBe(true);
  });

  it('should have a reset function that resets data to default', function () {
    expect(scope.reset).toBeDefined();
    scope.data.UnitMake = 'Ford';
    scope.validity = {};
    var resetHandler = jasmine.createSpy('resetEvent');
    scope.$on('reset', resetHandler);
    scope.reset();
    expect(angular.equals(scope.defaultData, scope.data)).toBe(true);
    expect(scope.validity).not.toBeDefined();
    expect(resetHandler).toHaveBeenCalled();
  });

  it('reset should default dealer options where only 1 exists', function () {
    optionSetMock = ['one'];
    scope.reset();
    scope.$apply();
    expect(scope.data.PhysicalInventoryAddressId).toBe('one');
    expect(scope.data.LineOfCreditId).toBe('one');
    expect(scope.data.BankAccountId).toBe('one');
  });

  it('reset should default to the first available option for pay seller', function () {
    paySellerOpts = [true];
    scope.reset();
    scope.$apply();
    expect(scope.data.PaySeller).toBe(true);
  });

  it('should ensure that trade-in is not true if buyer payment disallowed setting arrives asynchronously', function () {
    scope.data.SaleTradeIn = true;
    scope.canPayBuyer = function () {
      return false;
    };
    scope.$apply();
    expect(scope.data.SaleTradeIn).toBe(false);
  });

  it('should clear title information if title location is switched to one that disables title info', function () {
    scope.data.TitleLocationId = {
      TitleInfoEnabled: true
    };
    scope.$apply();
    scope.data.UnitTitleNumber = 'foo';
    scope.data.UnitTitleStateId = {};

    scope.data.TitleLocationId = {
      TitleInfoEnabled: false
    };
    scope.$apply();
    expect(scope.data.UnitTitleNumber).toBe(null);
    expect(scope.data.UnitTitleStateId).toBe(null);
  });

  describe('mileageExit function', function () {

    var fakeModelCtrl;

    beforeEach(function () {
      spyOn(blackbookMock, 'fetchVehicleTypeInfoForVin').andCallThrough();
      fakeModelCtrl = {
        $valid: true
      };
      scope.data.$selectedVehicle = {};
      scope.data.UnitMileage = '1200';
      scope.data.UnitVin = 'abc123';
      scope.data.$blackbookMileage = null;
    });

    it('should do nothing if the VIN has not been resolved to a vehicle', function () {
      scope.data.$selectedVehicle = null;
      scope.mileageExit(fakeModelCtrl);
      expect(blackbookMock.fetchVehicleTypeInfoForVin).not.toHaveBeenCalled();
    });

    it('should do nothing if the mileage is not valid', function () {
      fakeModelCtrl.$valid = false;
      scope.mileageExit(fakeModelCtrl);
      expect(blackbookMock.fetchVehicleTypeInfoForVin).not.toHaveBeenCalled();
    });

    it('should do nothing if the current black book value is already based on the current mileage', function () {
      scope.data.$blackbookMileage = '1200';
      scope.mileageExit(fakeModelCtrl);
      expect(blackbookMock.fetchVehicleTypeInfoForVin).not.toHaveBeenCalled();
    });

    it('should call for blackbook info with the current VIN, mileage, and resolved vehicle', function () {
      scope.mileageExit(fakeModelCtrl);
      expect(blackbookMock.fetchVehicleTypeInfoForVin).toHaveBeenCalledWith('abc123', '1200', scope.data.$selectedVehicle);
    });

    it('should expose the new blackbook vehicle info on success', function () {
      vinLookupResult = {foo: 'bar'};
      scope.mileageExit(fakeModelCtrl);
      scope.$apply();
      expect(scope.data.$selectedVehicle).toBe(vinLookupResult);
    });

    it('should cache the mileage used for the current blackbook info on success', function () {
      vinLookupResult = {foo: 'bar'};
      scope.mileageExit(fakeModelCtrl);
      scope.$apply();
      expect(scope.data.$blackbookMileage).toBe('1200');
    });

    it('should clear the blackbook mileage cache on error (to signal no current valid mileage)', inject(function ($q) {
      vinLookupResult = $q.reject();
      scope.data.$blackbookMileage = '1800';
      scope.mileageExit(fakeModelCtrl);
      scope.$apply();
      expect(scope.data.$blackbookMileage).toBe(null);
    }));

  });

  describe('submit function', function () {

    it('should exist', function () {
      expect(scope.submit).toBeDefined();
    });

    it('should create a form validity snapshot on the scope', function () {
      scope.form = {
        foo: 'bar'
      };
      scope.submit();
      expect(angular.equals(scope.validity, scope.form)).toBe(true);
    });

    it('should abort (returning false) if form is invalid', function () {
      scope.form = {
        $valid: false
      };
      spyOn(dialogMock, 'dialog').andCallThrough();
      var result = scope.submit();
      expect(result).toBe(false);
      expect(dialogMock.dialog).not.toHaveBeenCalled();
    });

    it('should hand off to the expected confirmation dialog if form is valid', function () {
      scope.form = {
        $valid: true
      };
      spyOn(dialogMock, 'dialog').andCallThrough();
      var result = scope.submit();
      expect(result).not.toBeDefined();
      expect(dialogMock.dialog).toHaveBeenCalled();
      expect(dialogMock.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/floorCarConfirm.html');
      expect(dialogMock.dialog.mostRecentCall.args[0].controller).toBe('FloorCarConfirmCtrl');
    });

    it('should provide the confirmation dialog with a way to resolve a copy of the form data', function () {
      scope.form = {
        $valid: true
      };
      scope.data.UnitMake = 'Ford';
      spyOn(dialogMock, 'dialog').andCallThrough();
      scope.submit();

      expect(typeof dialogMock.dialog.mostRecentCall.args[0].resolve.formData).toBe('function');
      var formData = dialogMock.dialog.mostRecentCall.args[0].resolve.formData();
      expect(angular.equals(formData, scope.data)).toBe(true);
      expect(formData).not.toBe(scope.data);
    });

    it('should stop if dialog promise resolves to anything other than true', function () {
      scope.form = {
        $valid: true
      };
      confirmResult = 'I want to edit some more';
      spyOn(scope, 'reallySubmit');
      scope.submit();
      scope.$apply();
      expect(scope.reallySubmit).not.toHaveBeenCalled();
    });

    it('should hand off to reallySubmit if dialog promise resolves to true', function () {
      scope.form = {
        $valid: true
      };
      confirmResult = true;
      spyOn(scope, 'reallySubmit');
      scope.submit();
      scope.$apply();
      expect(scope.reallySubmit).toHaveBeenCalled();
    });

  });

  describe('reallySubmit function', function () {

    it('should balk if called directly from view', function () {
      expect(scope.reallySubmit).toThrow();
    });

    it('should work if called with guard', function () {
      expect(function () {
        scope.reallySubmit(protect);
      }).not.toThrow();
    });

    it('should call floorplan create method with form data model', function () {
      spyOn(floorplanMock, 'create').andCallThrough();
      scope.reallySubmit(protect);
      expect(floorplanMock.create).toHaveBeenCalledWith(scope.data);
    })

    it('should open a message box and reset form data on success', function () {
      scope.data.foo = 'bar';
      createResult = 'it worked!';
      spyOn(dialogMock, 'messageBox').andCallThrough();

      scope.reallySubmit(protect);
      scope.$apply();

      expect(dialogMock.messageBox).toHaveBeenCalled();
      expect(scope.data.foo).not.toBeDefined();
    });

    it('should leave the form as-is on error', function () {
      scope.data.foo = 'bar';
      createResult = q.reject('problem123');
      spyOn(dialogMock, 'messageBox').andCallThrough();

      scope.reallySubmit(protect);
      scope.$apply();

      expect(dialogMock.messageBox).not.toHaveBeenCalled();
      expect(angular.equals(scope.data, scope.defaultData)).toBe(false);
    });

  });

});
