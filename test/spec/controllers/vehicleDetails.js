'use strict';

describe('Controller: VehicleDetailsCtrl', function () {
  beforeEach(module('nextgearWebApp'));

  var VehicleDetailsCtrl,
      scope,
      rootScope,
      vehicleDetailsMock,
      state,
      dialog,
      stateParams,
      api,
      landingMock,
      vehicleInfoMock,
      titleInfoMock,
      valueInfoMock,
      flooringInfoMock,
      financialSummaryMock,
      paymentDetailsMock,
      feeDetailsMock,
      userMock,
      titleReleasesMock,
      initialize;

  beforeEach(inject(function ($controller, $rootScope, $stateParams, $state, $q, $dialog, _api_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    api = _api_;
    state = {
      transitionTo: jasmine.createSpy()
    };
    stateParams = {
      stockNumber: 1234
    };

    landingMock = {};
    valueInfoMock = {};

    vehicleInfoMock = {
      Make: 'Toyota',
      Model: 'Corolla',
      Style: 'Sedan',
      UnitVin: 'vin',
      Year: 2013,
      Color: 'Mauve'
    };

    titleInfoMock = {
      FloorplanId: 'id123',
      FloorplanStatusName: 'Approved',
      TitleReleaseProgramStatus: 'EligibleForRelease',
      TitleImageAvailable: true,
      TitleReleaseDate: '07/08/14',
      TitleReleaseLocation: 'location',
      DealerIsEligibleToReleaseTitles: true,
      RemainingReleasesAvailable: 3,
      AmountFinanced: 123.45,
      ReleaseBalanceAvailable: 2000
    };

    flooringInfoMock = {
      SellerAddressLine1: '123 Main Street',
      SellerAddressLine2: null,
      SellerAddressCity: 'Rochester',
      SellerAddressState: 'NY',
      SellerAddressZip: '14607',
      InventoryAddressLine1: '456 South Ave',
      InventoryAddressLine2: 'Bldg. 3',
      InventoryAddressCity: 'New York',
      InventoryAddressState: 'NY',
      InventoryAddressZip: '10001',
      FloorplanStatusName: 'Approved',
      FlooringDate: '07/09/14',
      TotalDaysFloored: 5,
      SellerName: 'A Seller'
    };

    financialSummaryMock = {
      CollateralProtectionPaid: 100,
      CollateralProtectionOutstanding: 100,
      InterestPaid: 50,
      InterestOutstanding: 50,
      PrincipalPaid: 1000,
      PrincipalOutstanding: 1000,
      FeesPaid: 500,
      FeesOutstanding: 200
    };

    paymentDetailsMock = {
      FloorplanId: '123id'
    };
    feeDetailsMock = {
      FloorplanId: '456id'
    };

    vehicleDetailsMock = {
      getLanding: function() {
        return $q.when(landingMock);
      },
      getVehicleInfo: function() {
        return $q.when(vehicleInfoMock);
      },
      getTitleInfo: function() {
        return $q.when(titleInfoMock);
      },
      getValueInfo: function() {
        return $q.when(valueInfoMock);
      },
      getFlooringInfo: function() {
        return $q.when(flooringInfoMock);
      },
      getFinancialSummary: function() {
        return $q.when(financialSummaryMock);
      },
      getPaymentDetails: function() {
        return $q.when(paymentDetailsMock);
      },
      getFeeDetails: function() {
        return $q.when(feeDetailsMock);
      }
    };

    userMock = {
      getInfo: function() {
        return {
          BusinessNumber: '789'
        }
      },
      getStatics: function() {
        return {
          locations: [
            { locationLine1: 'foo' },
            { locationLine1: 'bar' }
          ]
        };
      }
    };

    titleReleasesMock = {
      isFloorplanOnQueue: function(floorplan) {
        return false;
      },
      getQueue: function() {
        return ['one', 'two'];
      },
      getQueueFinanced: function() {
        return 1000;
      },
      addToQueue: angular.noop
    };

    dialog = $dialog;

    initialize = function() {
      VehicleDetailsCtrl = $controller('VehicleDetailsCtrl', {
        $scope: scope,
        $state: state,
        $stateParams: stateParams,
        VehicleDetails: vehicleDetailsMock,
        TitleReleases: titleReleasesMock,
        User: userMock
      });
    };

    initialize();
    $rootScope.$digest();
  }));

  it('should create the necessary vehicle details objects on the scope', function() {
    expect(scope.landing).toBeDefined();
    expect(scope.vehicleInfo).toBeDefined();
    expect(scope.titleInfo).toBeDefined();
    expect(scope.valueInfo).toBeDefined();
    expect(scope.flooringInfo).toBeDefined();
    expect(scope.financialSummary).toBeDefined();
  });

  it('should attach the necessary variables to the overall scope', function() {
    expect(scope.stockNo).toBe(1234);
    expect(scope.historyReportUrl).toBe('/report/vehiclehistorydetail/1234/VehicleHistory');
    expect(scope.isCollapsed).toBe(true);
  });

  describe('TitleInfo Object', function() {
    it('should have a dealerCanRequestTitles function that returns the value of DealerIsEligibleToReleaseTitles', function() {
      titleInfoMock.DealerIsEligibleToReleaseTitles = true;
      var result = scope.titleInfo.dealerCanRequestTitles();
      expect(result).toBe(true);
    });

    describe('titleRequestDisabled function', function() {
      it('should return true (and disable title requests) if user is not eligible', function() {
        titleInfoMock.TitleReleaseProgramStatus = 'not EligibleForRelease';
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(true);
      });

      it('should return false if the floorplan is already on the queue', function() {
        spyOn(titleReleasesMock, 'isFloorplanOnQueue').andReturn(true);
        titleInfoMock.TitleReleaseProgramStatus = 'EligibleForRelease';
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(false);
      });

      it('should return false if the current queue size is less than the RemainingReleasesAvailable', function() {
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(false);
      });

      it('should return true if the current queue size is equal to or greater than the RemainingReleasesAvailable', function() {
        titleInfoMock.RemainingReleasesAvailable = 2;
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(true);
      });

      it('should return false if the amountFinanced + getQueueFinanced() is less than the ReleaseBalanceAvailable', function() {
        titleInfoMock.RemainingReleasesAvailable = 4;
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(false);
      });

      it('should return true if the amountFinanced + getQueueFinanced() is greater than the ReleaseBalanceAvailable', function() {
        titleInfoMock.ReleaseBalanceAvailable = 100;
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(true);
      })
    });

    it('should have a requestTitle function that adds the title to the title Release queue and transitions to Title Release Checkout', function() {
      spyOn(titleReleasesMock, 'addToQueue');
      scope.titleInfo.requestTitle();

      // we expect the controller to create the title release object that gets added to the queue
      expect(titleReleasesMock.addToQueue).toHaveBeenCalledWith({
        UnitMake: vehicleInfoMock.Make,
        UnitModel: vehicleInfoMock.Model,
        UnitStyle: vehicleInfoMock.Style,
        UnitVin: vehicleInfoMock.UnitVin,
        UnitYear: vehicleInfoMock.Year,
        Color: vehicleInfoMock.Color,
        StockNumber: scope.StockNo,
        AmountFinanced: titleInfoMock.AmountFinanced,
        FloorplanId: titleInfoMock.FloorplanId,
        FloorplanStatusName: titleInfoMock.FloorplanStatusName,
        TitleReleaseProgramStatus: titleInfoMock.TitleReleaseProgramStatus,
        TitleImageAvailable: titleInfoMock.TitleImageAvailable,
        TitleReleaseDate: titleInfoMock.TitleReleaseDate,
        TitleReleaseLocation: titleInfoMock.TitleReleaseLocation,
        FlooringDate: flooringInfoMock.FlooringDate,
        DaysOnFloorplan: flooringInfoMock.TotalDaysFloored,
        SellerName: flooringInfoMock.SellerName
      });
      expect(state.transitionTo).toHaveBeenCalledWith('home.titleReleaseCheckout');

    });
  });

  describe('FlooringInfo Object', function() {
    it('should build out address objects for seller and inventory', function() {
      expect(scope.flooringInfo.inventoryAddress).toBeDefined();
      expect(scope.flooringInfo.sellerAddress).toBeDefined();
    });

    it('should grab inventory locations from the user service', function() {
      expect(scope.inventoryLocations).toBeDefined();
    });

    describe('showChangeLink flag', function() {
      it('should be true if the floorplan has a status of Approved or Pending and the user has more than one inventory location', function() {
        expect(scope.flooringInfo.showChangeLink).toBe(true);
      });

      it('should be false if the floorplan has a status that is not Approved or Pending', inject(function($rootScope) {
        flooringInfoMock.FloorplanStatusName = 'Denied';
        initialize();
        $rootScope.$digest();
        expect(scope.flooringInfo.showChangeLink).toBe(false);
      }));

      it('should be false if there is only one inventory location', inject(function($rootScope) {
        spyOn(userMock, 'getStatics').andReturn({
          locations: [
            { AddressLine1: 'foo' }
          ]
        });
        flooringInfoMock.FloorplanStatusName = 'Approved';
        initialize();
        $rootScope.$digest();
        expect(scope.flooringInfo.showChangeLink).toBe(false);
      }));
    });

    describe('showEditInventoryLocation flag', function() {
      it('should be false on page load', function() {
        expect(scope.flooringInfo.showEditInventoryLocation).toBe(false);
      });

      it('should be true after user clicks "Change Address"', function() {
        scope.flooringInfo.showInventorySelect();
        expect(scope.flooringInfo.showEditInventoryLocation).toBe(true);
      });
    });

    describe('cancelInventoryChanges function', function() {
      it('should set the inventoryAddress to what it was and update the showEditInventoryLocation flag', function() {
        var newAddr = { Line1: '123 foo' };

        var oldAddr = {
          Line1: flooringInfoMock.InventoryAddressLine1,
          Line2: flooringInfoMock.InventoryAddressLine2,
          City: flooringInfoMock.InventoryAddressCity,
          State: flooringInfoMock.InventoryAddressState,
          Zip: flooringInfoMock.InventoryAddressZip,
        };

        // inventory address should be based on our mock data.
        expect(scope.flooringInfo.inventoryAddress).toEqual(oldAddr);
        scope.flooringInfo.showInventorySelect();

        // we want to fake selecting a new option in the menu.
        scope.flooringInfo.inventoryAddress = newAddr;

        // now we cancel
        scope.flooringInfo.cancelInventoryChanges();
        expect(scope.flooringInfo.inventoryAddress).toEqual(oldAddr);
        expect(scope.flooringInfo.showEditInventoryLocation).toBe(false);
      });
    });

    describe('saveInventoryChanges function', function() {
      it('should make the api call to update the inventory address and update the showEditInventoryLocation flag', function() {
        // test that api call is made here.
        scope.flooringInfo.showInventorySelect();
        expect(scope.flooringInfo.showEditInventoryLocation).toBe(true);
        scope.flooringInfo.saveInventoryChanges();
        expect(scope.flooringInfo.showEditInventoryLocation).toBe(false);
      });
    });
  });

  describe('FinancialSummary Object', function() {
    describe('breakdown object', function() {
      it('should include a financeAmount value that is the sum of PrincipalPaid & PrincipalOutstanding', function() {
        expect(scope.financialSummary.breakdown.financeAmount).toEqual(financialSummaryMock.PrincipalPaid + financialSummaryMock.PrincipalOutstanding);
      });

      it('should include CPP if there is any', function() {
        expect(scope.financialSummary.breakdown.interestFeesLabel).toBe('Interest, Fees & CPP');
        expect(scope.financialSummary.breakdown.interestFeesCPP).toBe(
          financialSummaryMock.InterestPaid + financialSummaryMock.InterestOutstanding + financialSummaryMock.FeesPaid + financialSummaryMock.FeesOutstanding + financialSummaryMock.CollateralProtectionOutstanding + financialSummaryMock.CollateralProtectionPaid);
      });

      it('should not include CPP if there is none', inject(function($rootScope) {
        financialSummaryMock.CollateralProtectionPaid = 0;
        financialSummaryMock.CollateralProtectionOutstanding = 0;

        initialize();
        $rootScope.$digest();

        expect(scope.financialSummary.breakdown.interestFeesLabel).toBe('Interest & Fees');
        expect(scope.financialSummary.breakdown.interestFeesCPP).toBe(
          financialSummaryMock.InterestPaid + financialSummaryMock.InterestOutstanding + financialSummaryMock.FeesPaid + financialSummaryMock.FeesOutstanding);
      }));
    });

    describe('getActivityDetails function', function() {
      var activityMock;

      beforeEach(function() {
        activityMock = {
          ActivityId: '123id',
          ActivityAmount: 123.45,
          ActivityDate: '07/14/14',
          IsPayment: true,
          IsFee: false
        };

        spyOn(vehicleDetailsMock, 'getPaymentDetails').andCallThrough();
        spyOn(vehicleDetailsMock, 'getFeeDetails').andCallThrough();
        spyOn(dialog, 'dialog').andReturn({
          open: angular.noop
        });
      });

      it('should grab payment details if the activity is a payment', inject(function($rootScope) {
        scope.financialSummary.getActivityDetails(activityMock);
        $rootScope.$digest();

        expect(vehicleDetailsMock.getPaymentDetails).toHaveBeenCalledWith(1234, activityMock.ActivityId);
        expect(dialog.dialog).toHaveBeenCalled();

        expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('PaymentDetailsCtrl');
        expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/paymentDetails.html');
        expect(dialog.dialog.mostRecentCall.args[0].resolve.activity()).toBe(paymentDetailsMock);
      }));

      it('should grab fee details if the activity is a fee', inject(function($rootScope) {
        activityMock.IsPayment = false;
        activityMock.IsFee = true;
        scope.financialSummary.getActivityDetails(activityMock);
        $rootScope.$digest();

        expect(vehicleDetailsMock.getFeeDetails).toHaveBeenCalledWith(1234, activityMock.ActivityId);
        expect(dialog.dialog).toHaveBeenCalled();

        expect(dialog.dialog.mostRecentCall.args[0].controller).toBe('FeeDetailsCtrl');
        expect(dialog.dialog.mostRecentCall.args[0].templateUrl).toBe('views/modals/feeDetails.html');
        expect(dialog.dialog.mostRecentCall.args[0].resolve.activity()).toBe(feeDetailsMock);
      }));
    });
  });
});
