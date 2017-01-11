'use strict';

describe ('Controller: WizardFloorCtrl', function () {
  beforeEach (module ('nextgearWebApp', 'client/login/login.template.html', 'client/shared/modals/floor-car-message/floor-car-message.template.html'));

  var
    initController,
    wizardFloor,
    scope,
    mockUser,
    floorplan,
    dialog,
    blackbook,
    mockModal,
    mockUpload,
    mockFloorplan,
    mockAddress,
    mockDealerSummary,
    mockForm,
    $q,
    $state,
    $httpBackend,
    mockkissMetricsInfo,
    kissMetricsData,
    mockSegmentIO,
    mockMetric,
    VinValidator
    ;


  beforeEach (inject (function (_$state_,
                                _$uibModal_,
                                _$q_,
                                _Floorplan_,
                                _Addresses_,
                                _Blackbook_,
                                _$httpBackend_,
                                $controller,
                                $rootScope,
                                metric,
                                _VinValidator_) {

    scope = $rootScope.$new ();
    floorplan = _Floorplan_;
    dialog = _$uibModal_;
    blackbook = _Blackbook_;
    $q = _$q_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    mockMetric = metric;
    VinValidator = _VinValidator_;

    $httpBackend.whenPOST ('floorplan/upload/asdlfkjpobiwjeklfjsdf')
      .respond ({
        Success: true,
        Message: null
      });

    $httpBackend.whenGET ('/info/v1_1/businesshours')
      .respond ({});

    mockkissMetricsInfo = {
      getKissMetricInfo: function () {
        return $q.when (kissMetricsData);
      }
    };


    mockSegmentIO = {
      track: angular.noop
    };

    spyOn (mockSegmentIO, 'track').and.callThrough ();

    mockUpload = {
      upload: function () {
        return $q.when (
          {
            data: {
              success: true
            }
          }
        );
      },
      rename: function () {
        return;
      }
    };

    mockFloorplan = {
      create: function () {
        return $q.when (
          {
            StockNumber: 66,
            FloorplanId: '123-123-123'
          }
        );
      }
    };

    mockUser = {
      isDealer: function () {
        return false;
      },
      getStatics: function () {
        return $q.when ({colors: ['red', 'green'], titleLocationOptions: [{DisplayOrder: 1, Id: 1, Name: 'I Have It'}]});
      },
      getInfo: function () {
        return $q.when ({
          DefaultDisbursementBankAccountId: 'default-disbursement-id',
          LinesOfCredit: [{
            LineOfCreditName: 'Wholesale',
            LineOfCreditId: 'wholesale-loc-id'
          }, {
            LineOfCreditName: 'Retail',
            LineOfCreditId: 'retail-loc-id'
          }]
        });
      },
      canPayBuyer: function () {
        return $q.when (false);
      },
      getPaySellerOptions: function () {
        return $q.when (false);
      },
      isUnitedStates: function () {
        return true;
      },
      getFeatures: function () {
        return {uploadDocuments: {enabled: false}, uploadDocumentsAuction: {enabled: false}};
      }
    };

    mockDealerSummary = {
      getDealerSummary: function () {
        return $q.when ({
          BankAccounts: [{
            'AchBankName': 'Bank Ble Ble',
            "BankAccountId": "default-disbursement-id",
            "IsActive": true
          }, {
            'AchBankName': 'Bank Bla Bla',
            "BankAccountId": "non-default-disbursement-id",
            "IsActive": true
          }, {
            'AchBankName': 'Bank Bli Bli',
            "BankAccountId": "non-active-id",
            "IsActive": false
          }]
        });
      }
    };

    mockAddress = {
      getActivePhysical: function () {
        return [{
          "AddressId": "active-physical-address-id",
          "IsActive": true,
          "IsPhysicalInventory": true,
          "IsMainAddress": true
        }, {
          "AddressId": "another-active-physical-address-id",
          "IsActive": true,
          "IsPhysicalInventory": true,
          "IsMainAddress": false
        }];
      }
    };

    mockForm = {
      $valid: true,
      inputMileage: {}
    };

    initController = function () {
      wizardFloor = $controller ('WizardFloorCtrl', {
        $scope: scope,
        User: mockUser,
        Floorplan: mockFloorplan,
        Upload: mockUpload,
        $uibModal: dialog,
        Blackbook: blackbook,
        Addresses: mockAddress,
        AccountManagement: mockDealerSummary,
        kissMetricInfo: mockkissMetricsInfo,
        segmentio: mockSegmentIO
      });
    };
    initController ();
  }));

  describe ('Initial state of wizard ', function () {
    it ('should attach necessary objects to the scope', inject (function ($rootScope) {
      scope.$digest ();
      expect (wizardFloor.options).toBeDefined ();
      expect (wizardFloor.options.colors).toEqual (['red', 'green']);

      expect (wizardFloor.options.locations).toBeDefined ();
      expect (wizardFloor.options.locations.length).toBe (2);

      expect (wizardFloor.paySellerOptions).toBe (false);
      expect (wizardFloor.canPayBuyer).toBe (false);
      expect (wizardFloor.optionsHelper).toBeDefined ();

      // should only display active bank account
      wizardFloor.options.BankAccounts.forEach (function (bankAccount) {
        expect (bankAccount.IsActive).toBe (true);
      });
      expect (wizardFloor.options.BankAccounts.length).toBe (2);
      expect (wizardFloor.defaultData).toBeDefined ();
    }));

    it ('should have 5 pages and initial counter of 1', function () {
      expect (wizardFloor.pageCount).toEqual (5);
      expect (wizardFloor.counter).toEqual (1);
    });

    it ('should default purchase date to null', function () {
      expect (wizardFloor.defaultData.UnitPurchaseDate).toBe (null);
    });

    it ('should default pay seller to true, not 1', function () {
      expect (wizardFloor.defaultData.PaySeller).toEqual (true);
      expect (wizardFloor.defaultData.PaySeller).not.toEqual (1);
    });

    it ('should have flooring valuation feature flag', function () {
      spyOn (mockUser, 'getFeatures').and.returnValue (angular.extend ({},
        mockUser.getFeatures (),
        {
          flooringValuations: {
            enabled: true
          }
        }));
      initController ();
      expect (wizardFloor.flooringValuationFeature).toBe (true);
    });

    it ('auction should have wizard feature flag', function () {
      expect (wizardFloor.attachDocumentsEnabled).toBe (false);
      spyOn (mockUser, 'isDealer').and.returnValue (false);
      spyOn (mockUser, 'getFeatures').and.returnValue (
        {
          uploadDocuments: {
            enabled: false
          },
          uploadDocumentsAuction: {
            enabled: true
          }
        });
      initController ();
      expect (wizardFloor.attachDocumentsEnabled).toBe (true);
    });

    it ('dealer should have wizard feature flag', function () {
      expect (wizardFloor.attachDocumentsEnabled).toBe (false);
      spyOn (mockUser, 'isDealer').and.returnValue (true);
      spyOn (mockUser, 'getFeatures').and.returnValue (
        {
          uploadDocuments: {
            enabled: true
          },
          uploadDocumentsAuction: {
            enabled: false
          }
        });
      initController ();
      expect (wizardFloor.attachDocumentsEnabled).toBe (true);
    });

    it ('should only have active bank account and sort them', function () {
      scope.$digest ();
      expect (wizardFloor.options.BankAccounts.length).toBe (2);
      expect (wizardFloor.options.BankAccounts[0].AchBankName).toBe ('Bank Bla Bla');
      expect (wizardFloor.options.BankAccounts[1].AchBankName).toBe ('Bank Ble Ble');
    });

    it ('should default bank account to default disbursement bank account', function () {
      scope.$digest ();
      // Apparently the BankAccountId is holding the BankAccount object,
      // but we call it BankAccountId ...
      expect (wizardFloor.data.BankAccountId.BankAccountId).toEqual ('default-disbursement-id');
    });

    it ('should default line of credit to retail for dealer', function () {
      spyOn (mockUser, 'isDealer').and.returnValue (true);
      initController ();
      scope.$digest ();
      // This is the same with above:
      // the LineOfCreditId is holding the LineOfCredit object,
      // but we call it LineOfCreditId ...
      expect (wizardFloor.data.LineOfCreditId.LineOfCreditId).toEqual ('retail-loc-id');
    });

    it ('should not have line of credit data for non dealer', function () {
      spyOn (mockUser, 'isDealer').and.returnValue (false);
      initController ();
      scope.$digest ();
      // This is the same with above:
      // the LineOfCreditId is holding the LineOfCredit object,
      // but we call it LineOfCreditId ...
      expect (wizardFloor.data.LineOfCreditId).toBe (null);
    });

    it ('should use active physical location of the dealer', function () {
      spyOn (mockAddress, 'getActivePhysical');
      scope.$digest ();
      expect (mockAddress.getActivePhysical).toHaveBeenCalled ();
    });

    it ('should set can pay buyer option', function () {
      scope.$digest ();
      expect (wizardFloor.paySellerOptions).toBe (false);
    });

    it ('should get pay seller options', function () {
      scope.$digest ();
      expect (wizardFloor.canPayBuyer).toBe (false);
    });

    it('should get the BuyerPayWhenTitleIsInBuyersPossession value is TRUE when it is checked in Discover and should return Dealer Info JSON object', function() {
      spyOn(mockUser, 'getInfo').and.returnValue($q.when({
        BuyerPayWhenTitleIsInBuyersPossession: true
      }));
      initController();
      scope.$digest();
      expect(wizardFloor.options.buyerPayWhenTitleIsInBuyersPossession).toEqual(true);
    });

    it('should get the BuyerPayWhenTitleIsInBuyersPossession value is FALSE when it is checked in Discover and should return Dealer Info JSON object ', function(){
      spyOn(mockUser, 'getInfo').and.returnValue($q.when({
        BuyerPayWhenTitleIsInBuyersPossession: false
      }));
      initController();
      scope.$digest();
      expect(wizardFloor.options.buyerPayWhenTitleIsInBuyersPossession).toEqual(false);
    });


  });

  describe ('Reset function', function () {
    it ('should exist', function () {
      expect (typeof wizardFloor.reset).toBe ('function');
    });

    it ('should reset everything', function () {
      scope.$digest ();
      spyOn (wizardFloor.optionsHelper, 'applyDefaults');
      spyOn ($state, 'go');
      wizardFloor.reset ();
      expect (wizardFloor.data).toEqual (wizardFloor.defaultData);
      expect (wizardFloor.optionsHelper.applyDefaults).toHaveBeenCalled ();
      expect (wizardFloor.validity).not.toBeDefined ();
      expect ($state.go).toHaveBeenCalledWith ('flooringWizard.car');
    });
  });

  // navigation test

  // submission test
  describe ('Submit function', function () {
    beforeEach (function () {
      scope.$digest ();

      wizardFloor.data.files = [{name: 'testFile.pdf'}];

      wizardFloor.transitionValidation = function () {
        return true;
      };

      wizardFloor.renameFile = function (file, index) {
        var filename = "";
        var dotPos = 0;
        // Get all files before the current file
        var firstXFiles = _.first (wizardFloor.data.files, index);
        // Get all files that have same name as file
        var fileList = _.map (_.where (firstXFiles, {'name': file}), 'name');
        // If there are other files with the same name need to add index to file name
        var fileIndex = fileList.length;

        if (fileIndex > 0) {
          dotPos = file.lastIndexOf (".");
          filename = file.substring (0, dotPos) + fileIndex + file.substring (dotPos);
          return filename;
        }
        else {
          return file;
        }
      };

      spyOn (dialog, 'open').and.returnValue ({
        result: {
          then: function (callback) {
            callback (true);
          }
        }
      });

    });


    it ('should exist', function () {
      expect (typeof wizardFloor.submit).toBe ('function');
    });

    it ('should change state to flooringConfirmation if successful', function () {
      spyOn ($state, 'go');

      kissMetricsData = {
        comment: "Red Wizard Casts: Summon Floorplan!",
        floorplanSuccess: true,
        uploadSuccess: false
      };

      wizardFloor.submit ();

      scope.$digest ();

      expect ($state.go).toHaveBeenCalledWith ('flooringConfirmation', {
        floorplanId: '123-123-123',
        stockNumber: 66
      });
    });

    it ('SegmentIO and Kissmetrics with FLOORPLAN_PURCHASE_AMOUNT_OVERBOOKING when purchase Price is Greater Than ProjectedFinancedAmount', function () {
      //set purchasePrice > projectedFinancedAmount
      wizardFloor.data.UnitPurchasePrice = 1;
      wizardFloor.valueLookUp.projectedFinancedAmount = 0;
      wizardFloor.data.AdditionalFinancing = false;

      kissMetricsData = {
        unitPurchasePrice: wizardFloor.data.UnitPurchasePrice,
        bookValue: wizardFloor.valueLookUp.projectedFinancedAmount,
        fullAmountWasRequested: false
      };

      spyOn (mockkissMetricsInfo, 'getKissMetricInfo').and.callThrough ();

      wizardFloor.submit ();
      scope.$digest ();

      expect (mockMetric).toBeDefined ();
      expect (mockMetric.FLOORPLAN_PURCHASE_AMOUNT_OVERBOOKING).toBeDefined ();
      expect (mockkissMetricsInfo.getKissMetricInfo).toHaveBeenCalled ();
      expect (mockSegmentIO.track).toHaveBeenCalledWith (mockMetric.FLOORPLAN_PURCHASE_AMOUNT_OVERBOOKING, kissMetricsData);
    });

    it ('SegmentIO and Kissmetrics should NOT be called for FLOORPLAN_PURCHASE_AMOUNT_OVERBOOKING', function () {
      //set purchasePrice > projectedFinancedAmount
      wizardFloor.data.UnitPurchasePrice = 0;
      wizardFloor.valueLookUp.projectedFinancedAmount = 1;
      wizardFloor.data.AdditionalFinancing = false;

      kissMetricsData = {
        unitPurchasePrice: wizardFloor.data.UnitPurchasePrice,
        bookValue: wizardFloor.valueLookUp.projectedFinancedAmount,
        fullAmountWasRequested: false
      };

      spyOn (mockkissMetricsInfo, 'getKissMetricInfo').and.callThrough ();

      wizardFloor.submit ();
      scope.$digest ();

      expect (mockMetric).toBeDefined ();
      expect (mockMetric.FLOORPLAN_PURCHASE_AMOUNT_OVERBOOKING).toBeDefined ();
      expect (mockkissMetricsInfo.getKissMetricInfo).toHaveBeenCalled ();
      expect (mockSegmentIO.track).not.toHaveBeenCalledWith (mockMetric.FLOORPLAN_PURCHASE_AMOUNT_OVERBOOKING, kissMetricsData);
    });

    it ('SegmentIO and Kissmetrics should be called with additionalfinancing equal to true', function () {
      //set purchasePrice > projectedFinancedAmount
      wizardFloor.data.UnitPurchasePrice = 1;
      wizardFloor.valueLookUp.projectedFinancedAmount = 0;
      wizardFloor.data.AdditionalFinancing = true;

      kissMetricsData = {
          unitPurchasePrice: wizardFloor.data.UnitPurchasePrice,
          bookValue: wizardFloor.valueLookUp.projectedFinancedAmount,
          fullAmountWasRequested: true
      };

      spyOn (mockkissMetricsInfo, 'getKissMetricInfo').and.callThrough ();

      wizardFloor.submit ();
      scope.$digest ();

      expect (mockMetric).toBeDefined ();
      expect (mockMetric.FLOORPLAN_PURCHASE_AMOUNT_OVERBOOKING).toBeDefined ();
      expect (mockkissMetricsInfo.getKissMetricInfo).toHaveBeenCalled ();
      expect (mockSegmentIO.track).toHaveBeenCalledWith (mockMetric.FLOORPLAN_PURCHASE_AMOUNT_OVERBOOKING, kissMetricsData);
    });

    it ('SegmentIO and KissMetrics with "FLOORPLAN_REQUEST_WIZARD_RESULT"', function () {
      kissMetricsData = {
        comment: "Red Wizard Casts: Summon Floorplan!",
        floorplanSuccess: true,
        uploadSuccess: false
      };

      spyOn (mockkissMetricsInfo, 'getKissMetricInfo').and.callThrough ();

      //setting these so it bypasses the first
      //kissmetric & segmentIO calls.
      //these calls are handled in another unit test
      wizardFloor.data.UnitPurchasePrice = 0;
      wizardFloor.valueLookUp.projectedFinancedAmount = 1;

      wizardFloor.submit ();
      scope.$digest ();

      expect ( mockMetric).toBeDefined ();
      expect (mockMetric.FLOORPLAN_REQUEST_WIZARD_RESULT).toBeDefined ();
      expect (mockkissMetricsInfo.getKissMetricInfo).toHaveBeenCalled ();
      expect (mockSegmentIO.track).toHaveBeenCalledWith (mockMetric.FLOORPLAN_REQUEST_WIZARD_RESULT, kissMetricsData);
    });

    it('should acknowledge invalid vin when vin is invalid but not checked', function() {
      wizardFloor.data.UnitVin = '1G8AN14F45Z10003';
      wizardFloor.data.VinAckLookupFailure = false;

      spyOn(VinValidator, 'isValid').and.callThrough();
      wizardFloor.submit();

      expect(VinValidator.isValid).toHaveBeenCalledWith('1G8AN14F45Z10003');
      expect(wizardFloor.data.VinAckLookupFailure).toEqual(true);
    });

    it('should not acknowledge invalid vin when vin is valid', function() {
      wizardFloor.data.UnitVin = '1FTYR10U92PB37336';
      wizardFloor.data.VinAckLookupFailure = false;

      spyOn(VinValidator, 'isValid').and.callThrough();
      wizardFloor.submit();

      expect(VinValidator.isValid).toHaveBeenCalledWith('1FTYR10U92PB37336');
      expect(wizardFloor.data.VinAckLookupFailure).toEqual(false);
    });
  });
});
