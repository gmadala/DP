'use strict';

describe('Controller: VehicleDetailsCtrl', function () {
  beforeEach(module('nextgearWebApp'));

  var VehicleDetailsCtrl,
    scope,
    rootScope,
    vehicleDetailsMock,
    Payments,
    state,
    dialog,
    stateParams,
    api,
    detailsMock,
    paymentDetailsMock,
    feeDetailsMock,
    userMock,
    titleReleasesMock,
    paymentsMock,
    floorplanMock,
    initialize,
    $q,
    kissMetricData,
    mockKissMetricInfo,
    addressesMock,
    cancelSucceed,
    invAddr;

  beforeEach(inject(function ($controller, $rootScope, $stateParams, $state, _$q_, $uibModal, _api_, _Payments_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    api = _api_;
    $q = _$q_;
    Payments = _Payments_;
    state = {
      transitionTo: jasmine.createSpy()
    };
    stateParams = {
      stockNumber: 1234
    };
    cancelSucceed = true;

    kissMetricData = {
      height: 1080,
      isBusinessHours: true,
      vendor: 'Google Inc.',
      version: 'Chrome 44',
      width: 1920
    };

    mockKissMetricInfo = {
      getKissMetricInfo : function() {
        return $q.when(kissMetricData);
      }
    };

    spyOn(mockKissMetricInfo, 'getKissMetricInfo').and.callThrough();

    detailsMock = { // include only the mock data the controller explicitly grabs.
      IsShowExtendLink : true,
      VehicleInfo: {
        Make: 'Toyota',
        Model: 'Corolla',
        Style: 'Sedan',
        UnitVin: 'vin',
        Year: 2013,
        Color: 'Mauve',
        FloorplanId: '123id',
        Description: 'a description'
      },
      TitleInfo: {
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
      },
      FloorplanInfo: {
        FloorplanId: '1234',
        SellerAddressLine1: '123 Main Street',
        SellerAddressLine2: null,
        SellerAddressCity: 'Rochester',
        SellerAddressState: 'NY',
        SellerAddressZip: '14607',
        PhysicalInventoryAddressId: '1',
        FloorplanStatusName: 'Approved',
        FlooringDate: '07/09/14',
        TotalDaysFloored: 5,
        SellerName: 'A Seller'
      },
      FinancialSummaryInfo: {
        CollateralProtectionPaid: 100,
        CollateralProtectionOutstanding: 100,
        InterestPaid: 50,
        InterestOutstanding: 50,
        PrincipalPaid: 1000,
        PrincipalOutstanding: 1000,
        FeesPaid: 500,
        FeesOutstanding: 200,
        Scheduled: false,
        WebScheduledPaymentId: null
      },
      ValueInfo: {}
    };

    paymentDetailsMock = {
      FloorplanId: '123id'
    };

    feeDetailsMock = {
      FloorplanId: '456id'
    };

    invAddr = {
      AddressId: '1',
      Line1: '380 NEVADA SW',
      Line2: null,
      City: 'HURON',
      State: 'SD',
      Zip: '57350',
      Phone: '0000000000',
      Fax: '0000000000',
      IsActive: false,
      IsPhysicalInventory: true,
      HasFloorplanFlooredAgainst: false,
      HasApprovedFloorplanFlooredAgainst: false,
      IsTitleReleaseAddress: false,
      IsMailingAddress: false,
      IsPostOfficeBox: false
    };

    addressesMock = {
      getActivePhysical: function() {
        return [
          { AddressId: '1' },
          { AddressId: '2' }
        ]
      },
      getAddressObjectFromId: function() {
        return invAddr;
      }
    };

    vehicleDetailsMock = {
      IsShowExtendLink : true,
      getDetails: function() {
        return $q.when(detailsMock);
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
        return $q.when({
          BusinessNumber: '789',
          DealerAddresses: [
            {
              IsActive: true,
              IsPhysicalInventory: true,
              AddressId: '1234'
            },
            {
              IsActive: true,
              IsPhysicalInventory: true,
              AddressId: '1234'
            }
          ]
        });
      },
      getFeatures: function(){
        return {uploadDocuments: {enabled: false}};
      },
      isUnitedStates: function() {
        return true;
      }
    };

    titleReleasesMock = {
      isFloorplanOnQueue: function() {
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

    paymentsMock = {
      getPaymentQueue: function() {
        return {
          fees: [1,2,3],
          payments: [1,2,3,4],
          isEmpty: angular.noop
        };
      },
      getPaymentFromQueue: angular.noop,
      isPaymentOnQueue: angular.noop,
      requestExtension: angular.noop,
      removePaymentFromQueue: angular.noop,
      cancelScheduled: function() {
        if(cancelSucceed) {
          return $q.when(true);
        } else {
          return $q.reject(false);
        }
      }
    };

    floorplanMock = {
      editInventoryAddress: angular.noop,
      determineFloorPlanExtendability  : function() {
        return $q.when(detailsMock);
      }
    };

    dialog = $uibModal;

    initialize = function() {
      VehicleDetailsCtrl = $controller('VehicleDetailsCtrl', {
        $scope: scope,
        $state: state,
        $stateParams: stateParams,
        $uidModal: dialog,
        VehicleDetails: vehicleDetailsMock,
        TitleReleases: titleReleasesMock,
        User: userMock,
        Payments: paymentsMock,
        Floorplan: floorplanMock,
        Addresses: addressesMock,
        kissMetricInfo: mockKissMetricInfo
      });
    };

    initialize();
    $rootScope.$digest();
  }));

  it('should call to get core properties from kissmetric info service', function() {
    expect(mockKissMetricInfo.getKissMetricInfo).toHaveBeenCalled();
    scope.$apply();
    expect(scope.kissMetricData).toEqual(kissMetricData);
  });

  it('should create the necessary vehicle details objects on the scope', function() {
    expect(scope.vehicleInfo).toBeDefined();
    expect(scope.titleInfo).toBeDefined();
    expect(scope.valueInfo).toBeDefined();
    expect(scope.flooringInfo).toBeDefined();
    expect(scope.financialSummary).toBeDefined();

    expect(scope.paymentQueue).toBeDefined();
    expect(scope.paymentForCheckout).toBeDefined();
  });

  it('should attach the necessary variables to the overall scope', function() {
    expect(scope.historyReportUrl).toBe('/report/vehiclehistorydetail/1234/VehicleHistory');
    expect(scope.isCollapsed).toBe(true);
  });

  it('should have a goToCheckout function that navigates to the checkout page', function() {
    expect(scope.goToCheckout).toBeDefined();
    scope.goToCheckout();
    expect(state.transitionTo).toHaveBeenCalled();
  });

  describe('controller-wide functions', function() {
    beforeEach(inject(function($httpBackend) {
      $httpBackend.whenGET('client/modals/payment-extension/payment-extension.template.html').respond('<div></div>');
      $httpBackend.whenGET('client/modals/payment-options-breakdown/payment-options-breakdown.template.html').respond('<div></div>');
    }));

    it('should have a paymentQueue.getQueueCount function to return the length of the queue', function() {
      expect(scope.paymentQueue.getQueueCount).toBeDefined();
      expect(scope.paymentQueue.getQueueCount()).toBe(4);
    });

    it('should have a showExtendLink function that controls display of the request extension link', function() {
      scope.isShowExtendLink = false;
      expect(scope.showExtendLink()).toBe(false);
      scope.isShowExtendLink = true;
      expect(scope.showExtendLink()).toBe(true);
    });

    describe('request extension function', function() {
      it('should exist', function() {
        expect(scope.requestExtension).toBeDefined();
      });

      it('should launch a modal dialog', function() {
        spyOn(dialog, 'open').and.returnValue({
          result: {
            then: function (callback) {
              callback();
            }
          }
        });
        scope.requestExtension();
        expect(dialog.open).toHaveBeenCalled();
        expect(dialog.open.calls.mostRecent().args[0].resolve.payment()).toEqual({
          FloorplanId: detailsMock.VehicleInfo.FloorplanId,
          Vin: detailsMock.VehicleInfo.UnitVin,
          UnitDescription: detailsMock.VehicleInfo.Description
        });
      });
    });

    it('should have a showAddPrincipalLink function that controls the display of the additional principal link', function() {
      expect(scope.showAddPrincipalLink()).toBe(false);
      spyOn(paymentsMock, 'isPaymentOnQueue').and.callFake(function() {
        return 'payment';
      });
      expect(scope.showAddPrincipalLink()).toBe(true);
    });

    describe('getAdditionalPrincipal function', function() {
      it('should return 0 if the payment is not on the queue', function() {
        spyOn(paymentsMock, 'isPaymentOnQueue').and.returnValue(false);
        expect(scope.getAdditionalPrincipal()).toBe(0);
      });

      it('should return the additionalPrincipal value if the payment is on the queue', function() {
        spyOn(paymentsMock, 'isPaymentOnQueue').and.returnValue('payment');
        spyOn(paymentsMock, 'getPaymentFromQueue').and.callFake(function(){
          return {
            payment: {
              additionalPrincipal: 55
            }
          };
        });
        expect(scope.getAdditionalPrincipal()).toBe(55);
      });
    });

    describe('launchPaymentOptions function', function() {
      var wasCancelled;

      beforeEach(function() {
        wasCancelled = true;
        spyOn(dialog, 'open').and.returnValue({
          result: {
            then: function (callback) {
              callback(true);
            }
          }
        });

        spyOn(paymentsMock, 'getPaymentFromQueue').and.returnValue();
      });

      it('should exist', function() {
        expect(scope.launchPaymentOptions).toBeDefined();
      });

      it('should launch a modal dialog', function() {
        scope.launchPaymentOptions();
        expect(dialog.open).toHaveBeenCalled();
      });

      it('should send an onQueue flag (as isOnQueue function) to the dialog', function() {
        var myOnQueue = false;
        spyOn(paymentsMock, 'isPaymentOnQueue').and.returnValue(myOnQueue);
        scope.launchPaymentOptions();
        expect(dialog.open.calls.mostRecent().args[0].resolve.isOnQueue()).toBe(myOnQueue);
      });

      it('should send a cartItem object if payment is already on the queue', function() {
        spyOn(paymentsMock, 'isPaymentOnQueue').and.returnValue(true);
        scope.launchPaymentOptions();
        dialog.open.calls.mostRecent().args[0].resolve.object();
        expect(paymentsMock.getPaymentFromQueue).toHaveBeenCalled();
      });

      it('should send the payment object from vehicle details if the payment is not on the queue', function() {
        spyOn(paymentsMock, 'isPaymentOnQueue').and.returnValue(false);
        scope.launchPaymentOptions();
        dialog.open.calls.mostRecent().args[0].resolve.object();
        expect(paymentsMock.getPaymentFromQueue).not.toHaveBeenCalled();
      });

      it('should do nothing after the dialog closes if our original payment was not scheduled', function() {
        spyOn(paymentsMock, 'removePaymentFromQueue').and.callThrough();
        spyOn(paymentsMock, 'cancelScheduled').and.callThrough();

        scope.launchPaymentOptions();

        expect(paymentsMock.removePaymentFromQueue).not.toHaveBeenCalled();
        expect(paymentsMock.cancelScheduled).not.toHaveBeenCalled();
      });

      it('should do nothing if the dialog was closed because the user cancelled', function() {
        wasCancelled = false;
        spyOn(paymentsMock, 'removePaymentFromQueue').and.callThrough();
        spyOn(paymentsMock, 'cancelScheduled').and.callThrough();

        scope.launchPaymentOptions();

        expect(paymentsMock.removePaymentFromQueue).not.toHaveBeenCalled();
        expect(paymentsMock.cancelScheduled).not.toHaveBeenCalled();
      });

      it('should cancel the original payment if it was scheduled and we confirmed our dialog changes before it closed', function() {
        spyOn(paymentsMock, 'removePaymentFromQueue').and.callThrough();
        spyOn(paymentsMock, 'cancelScheduled').and.callThrough();

        scope.paymentForCheckout.Scheduled = true;
        scope.paymentForCheckout.WebScheduledPaymentId = 'schPayId';
        scope.launchPaymentOptions();
        scope.$apply();

        expect(paymentsMock.removePaymentFromQueue).not.toHaveBeenCalled();
        expect(paymentsMock.cancelScheduled).toHaveBeenCalledWith('schPayId');

        expect(scope.paymentForCheckout.WebScheduledPaymentId).toBe(null);
        expect(scope.paymentForCheckout.Scheduled).toBe(false);
      });

      it('should remove the new cart item from the queue if our attempt to cancel the scheduled payment fails', function() {
        cancelSucceed = false;
        spyOn(paymentsMock, 'removePaymentFromQueue').and.callThrough();
        spyOn(paymentsMock, 'cancelScheduled').and.callThrough();

        scope.paymentForCheckout.Scheduled = true;
        scope.paymentForCheckout.WebScheduledPaymentId = 'schPayId';
        scope.launchPaymentOptions();
        scope.$apply();

        expect(paymentsMock.removePaymentFromQueue).toHaveBeenCalledWith(scope.paymentForCheckout.FloorplanId);
      });
    });
  });

  describe('TitleInfo Section', function() {
    it('should have a dealerCanRequestTitles function that returns the value of DealerIsEligibleToReleaseTitles', function() {
      detailsMock.TitleInfo.DealerIsEligibleToReleaseTitles = true;
      var result = scope.titleInfo.dealerCanRequestTitles();
      expect(result).toBe(true);
    });

    describe('titleRequestDisabled function', function() {
      it('should return true (and disable title requests) if user is not eligible', function() {
        detailsMock.TitleInfo.TitleReleaseProgramStatus = 'not EligibleForRelease';
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(true);
      });

      it('should return false if the floorplan is already on the queue', function() {
        spyOn(titleReleasesMock, 'isFloorplanOnQueue').and.returnValue(true);
        detailsMock.TitleInfo.TitleReleaseProgramStatus = 'EligibleForRelease';
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(false);
      });

      it('should return false if the current queue size is less than the RemainingReleasesAvailable', function() {
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(false);
      });

      it('should return true if the current queue size is equal to or greater than the RemainingReleasesAvailable', function() {
        detailsMock.TitleInfo.RemainingReleasesAvailable = 2;
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(true);
      });

      it('should return false if the amountFinanced + getQueueFinanced() is less than the ReleaseBalanceAvailable', function() {
        detailsMock.TitleInfo.RemainingReleasesAvailable = 4;
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(false);
      });

      it('should return true if the amountFinanced + getQueueFinanced() is greater than the ReleaseBalanceAvailable', function() {
        detailsMock.TitleInfo.ReleaseBalanceAvailable = 100;
        var result = scope.titleInfo.titleRequestDisabled();
        expect(result).toBe(true);
      })
    });

    it('should have a requestTitle function that adds the title to the title Release queue and transitions to Title Release Checkout', function() {
      spyOn(titleReleasesMock, 'addToQueue');
      scope.titleInfo.requestTitle();

      // we expect the controller to create the title release object that gets added to the queue
      expect(titleReleasesMock.addToQueue).toHaveBeenCalledWith({
        UnitMake: detailsMock.VehicleInfo.Make,
        UnitModel: detailsMock.VehicleInfo.Model,
        UnitStyle: detailsMock.VehicleInfo.Style,
        UnitVin: detailsMock.VehicleInfo.UnitVin,
        UnitYear: detailsMock.VehicleInfo.Year,
        Color: detailsMock.VehicleInfo.Color,
        StockNumber: stateParams.stockNumber,
        AmountFinanced: detailsMock.TitleInfo.AmountFinanced,
        FloorplanId: detailsMock.TitleInfo.FloorplanId,
        FloorplanStatusName: detailsMock.TitleInfo.FloorplanStatusName,
        TitleReleaseProgramStatus: detailsMock.TitleInfo.TitleReleaseProgramStatus,
        TitleImageAvailable: detailsMock.TitleInfo.TitleImageAvailable,
        DisbursementDate: detailsMock.TitleInfo.DisbursementDate,
        TitleLocation: detailsMock.TitleInfo.TitleLocation,
        FlooringDate: detailsMock.FloorplanInfo.FlooringDate,
        DaysOnFloorplan: detailsMock.FloorplanInfo.TotalDaysFloored,
        SellerName: detailsMock.FloorplanInfo.SellerName
      });
      expect(state.transitionTo).toHaveBeenCalledWith('titleReleaseCheckout');

    });
  });

  describe('FlooringInfo Object', function() {
    it('should build out address objects for seller and inventory', function() {
      expect(scope.flooringInfo.inventoryAddress).toBeDefined();
      expect(scope.flooringInfo.inventoryAddress).toBe(invAddr);
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
        detailsMock.FloorplanInfo.FloorplanStatusName = 'Denied';
        initialize();
        $rootScope.$digest();
        expect(scope.flooringInfo.showChangeLink).toBe(false);
      }));

      it('should be false if there is only one inventory location', inject(function($rootScope) {
        spyOn(addressesMock, 'getActivePhysical').and.returnValue([
          { Line1: 'foo' }
        ]);
        detailsMock.FloorplanInfo.FloorplanStatusName = 'Approved';
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
        var newAddr = { AddressId: '2' };

        // inventory address should be based on our mock data.
        expect(scope.flooringInfo.inventoryAddress).toBe(invAddr);
        scope.flooringInfo.showInventorySelect();

        // we want to fake selecting a new option in the menu.
        scope.flooringInfo.inventoryAddress = newAddr;

        // now we cancel
        scope.flooringInfo.cancelInventoryChanges();
        expect(scope.flooringInfo.inventoryAddress).toBe(invAddr);
        expect(scope.flooringInfo.showEditInventoryLocation).toBe(false);
      });
    });

    describe('saveInventoryChanges function', function() {
      it('should make the api call to update the inventory address and update the showEditInventoryLocation flag', function() {
        spyOn(floorplanMock, 'editInventoryAddress').and.returnValue({
          then: function(callback) {
            callback();
          }
        });

        scope.flooringInfo.showInventorySelect();
        scope.flooringInfo.inventoryAddress = { Line1: 'foo', AddressId: 'addr123' };

        expect(scope.flooringInfo.showEditInventoryLocation).toBe(true);
        scope.flooringInfo.saveInventoryChanges();

        expect(floorplanMock.editInventoryAddress).toHaveBeenCalled();
        expect(scope.flooringInfo.showEditInventoryLocation).toBe(false);
      });
    });
  });

  describe('FinancialSummary Object', function() {
    describe('breakdown object', function() {
      it('should include a financeAmount value that is the sum of PrincipalPaid & PrincipalOutstanding', function() {
        expect(scope.financialSummary.breakdown.financeAmount).toEqual(detailsMock.FinancialSummaryInfo.PrincipalPaid + detailsMock.FinancialSummaryInfo.PrincipalOutstanding);
      });

      it('should include CPP if there is any', function() {
        expect(scope.financialSummary.breakdown.interestFeesLabel).toBe('Interest, Fees & CPP');
        expect(scope.financialSummary.breakdown.interestFeesCPP).toBe(
          detailsMock.FinancialSummaryInfo.InterestPaid + detailsMock.FinancialSummaryInfo.InterestOutstanding + detailsMock.FinancialSummaryInfo.FeesPaid + detailsMock.FinancialSummaryInfo.FeesOutstanding + detailsMock.FinancialSummaryInfo.CollateralProtectionOutstanding + detailsMock.FinancialSummaryInfo.CollateralProtectionPaid);
      });

      it('should not include CPP if there is none', inject(function($rootScope) {
        detailsMock.FinancialSummaryInfo.CollateralProtectionPaid = 0;
        detailsMock.FinancialSummaryInfo.CollateralProtectionOutstanding = 0;

        initialize();
        $rootScope.$digest();

        expect(scope.financialSummary.breakdown.interestFeesLabel).toBe('Interest & Fees');
        expect(scope.financialSummary.breakdown.interestFeesCPP).toBe(
          detailsMock.FinancialSummaryInfo.InterestPaid + detailsMock.FinancialSummaryInfo.InterestOutstanding + detailsMock.FinancialSummaryInfo.FeesPaid + detailsMock.FinancialSummaryInfo.FeesOutstanding);
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

        spyOn(vehicleDetailsMock, 'getPaymentDetails').and.callThrough();
        spyOn(vehicleDetailsMock, 'getFeeDetails').and.callThrough();
        spyOn(dialog, 'open').and.returnValue({
          open: angular.noop
        });
      });

      it('should grab payment details if the activity is a payment', inject(function($rootScope) {
        scope.financialSummary.getActivityDetails(activityMock);
        $rootScope.$digest();

        expect(vehicleDetailsMock.getPaymentDetails).toHaveBeenCalledWith(1234, activityMock.ActivityId);
        expect(dialog.open).toHaveBeenCalled();

        expect(dialog.open.calls.mostRecent().args[0].controller).toBe('PaymentDetailsCtrl');
        expect(dialog.open.calls.mostRecent().args[0].templateUrl).toBe('client/modals/payment-details-modal/payment-details.template.html');
        expect(dialog.open.calls.mostRecent().args[0].resolve.activity()).toBe(paymentDetailsMock);
      }));

      it('should grab fee details if the activity is a fee', inject(function($rootScope) {
        activityMock.IsPayment = false;
        activityMock.IsFee = true;
        scope.financialSummary.getActivityDetails(activityMock);
        $rootScope.$digest();

        expect(vehicleDetailsMock.getFeeDetails).toHaveBeenCalledWith(1234, activityMock.ActivityId);
        expect(dialog.open).toHaveBeenCalled();

        expect(dialog.open.calls.mostRecent().args[0].controller).toBe('FeeDetailsCtrl');
        expect(dialog.open.calls.mostRecent().args[0].templateUrl).toBe('client/modals/fee-details-modal/fee-details.template.html');
        expect(dialog.open.calls.mostRecent().args[0].resolve.activity()).toBe(feeDetailsMock);
      }));
    });
  });
});
