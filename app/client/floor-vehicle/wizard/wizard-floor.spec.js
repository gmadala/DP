'use strict';

describe('Controller: WizardFloorCtrl', function() {
  beforeEach(module('nextgearWebApp', 'client/login/login.template.html'));

  var
    initController,
    wizardFloor,
    scope,
    mockUser,
    floorplan,
    dialog,
    blackbook,
    mockAddress,
    mockDealerSummary,
    mockForm,
    $q,
    $state,
    $httpBackend;

  beforeEach(inject(function(_$state_,
                             _$uibModal_,
                             _$q_,
                             _Floorplan_,
                             _Addresses_,
                             _Blackbook_,
                             _$httpBackend_,
                             $controller,
                             $rootScope) {

    scope = $rootScope.$new();
    floorplan = _Floorplan_;
    dialog = _$uibModal_;
    blackbook = _Blackbook_;
    $q = _$q_;
    $state = _$state_;
    $httpBackend = _$httpBackend_;

    $httpBackend.whenPOST('floorplan/upload/asdlfkjpobiwjeklfjsdf')
      .respond({
        Success: true,
        Message: null
      });

    mockUser = {
      isDealer: function() {
        return false;
      },
      getStatics: function() {
        return $q.when({colors: ['red', 'green']});
      },
      getInfo: function() {
        return $q.when({
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
      canPayBuyer: function() {
        return $q.when(false);
      },
      getPaySellerOptions: function() {
        return $q.when(false);
      },
      isUnitedStates: function() {
        return true;
      },
      getFeatures: function() {
        return {uploadDocuments: {enabled: false}, uploadDocumentsAuction: {enabled: false}};
      }
    };

    mockDealerSummary = {
      getDealerSummary: function() {
        return $q.when({
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
      getActivePhysical: function() {
        return [{
          "AddressId": "active-physical-address-id",
          "IsActive": true,
          "IsPhysicalInventory": true
        }, {
          "AddressId": "another-active-physical-address-id",
          "IsActive": true,
          "IsPhysicalInventory": true
        }];
      }
    };

    mockForm = {
      $valid: true,
      inputMileage: {}
    };

    initController = function() {
      wizardFloor = $controller('WizardFloorCtrl', {
        $scope: scope,
        User: mockUser,
        Floorplan: floorplan,
        $uibModal: dialog,
        Blackbook: blackbook,
        Addresses: mockAddress,
        AccountManagement: mockDealerSummary
      });
    };
    initController();
  }));

  describe('Initial state of wizard ', function() {
    it('should attach necessary objects to the scope', inject(function ($rootScope) {
      scope.$digest();
      expect(wizardFloor.options).toBeDefined();
      expect(wizardFloor.options.colors).toEqual(['red', 'green']);

      expect(wizardFloor.options.locations).toBeDefined();
      expect(wizardFloor.options.locations.length).toBe(2);

      expect(wizardFloor.paySellerOptions).toBe(false);
      expect(wizardFloor.canPayBuyer).toBe(false);
      expect(wizardFloor.optionsHelper).toBeDefined();

      // should only display active bank account
      wizardFloor.options.BankAccounts.forEach(function (bankAccount) {
        expect(bankAccount.IsActive).toBe(true);
      });
      expect(wizardFloor.options.BankAccounts.length).toBe(2);
      expect(wizardFloor.defaultData).toBeDefined();
    }));

    it('should have 5 pages and initial counter of 1', function() {
      expect(wizardFloor.pageCount).toEqual(5);
      expect(wizardFloor.counter).toEqual(1);
    });

    it('should default purchase date to null', function() {
      expect(wizardFloor.defaultData.UnitPurchaseDate).toBe(null);
    });

    it('should have flooring valuation feature flag', function() {
      spyOn(mockUser, 'getFeatures').and.returnValue(angular.extend({},
        mockUser.getFeatures(),
        {
          flooringValuations: {
            enabled: true
          }
        }));
      initController();
      expect(wizardFloor.flooringValuationFeature).toBe(true);
    });

    it('auction should have wizard feature flag', function() {
      expect(wizardFloor.attachDocumentsEnabled).toBe(false);
      spyOn(mockUser, 'isDealer').and.returnValue(false);
      spyOn(mockUser, 'getFeatures').and.returnValue(
        {
          uploadDocuments: {
            enabled: false
          },
          uploadDocumentsAuction: {
            enabled: true
          }
        });
      initController();
      expect(wizardFloor.attachDocumentsEnabled).toBe(true);
    });

    it('dealer should have wizard feature flag', function() {
      expect(wizardFloor.attachDocumentsEnabled).toBe(false);
      spyOn(mockUser, 'isDealer').and.returnValue(true);
      spyOn(mockUser, 'getFeatures').and.returnValue(
        {
          uploadDocuments: {
            enabled: true
          },
          uploadDocumentsAuction: {
            enabled: false
          }
        });
      initController();
      expect(wizardFloor.attachDocumentsEnabled).toBe(true);
    });

    it('should only have active bank account and sort them', function() {
      scope.$digest();
      expect(wizardFloor.options.BankAccounts.length).toBe(2);
      expect(wizardFloor.options.BankAccounts[0].AchBankName).toBe('Bank Bla Bla');
      expect(wizardFloor.options.BankAccounts[1].AchBankName).toBe('Bank Ble Ble');
    });

    it('should default bank account to default disbursement bank account', function() {
      scope.$digest();
      // Apparently the BankAccountId is holding the BankAccount object,
      // but we call it BankAccountId ...
      expect(wizardFloor.data.BankAccountId.BankAccountId).toEqual('default-disbursement-id');
    });

    it('should default line of credit to retail for dealer', function() {
      spyOn(mockUser, 'isDealer').and.returnValue(true);
      initController();
      scope.$digest();
      // This is the same with above:
      // the LineOfCreditId is holding the LineOfCredit object,
      // but we call it LineOfCreditId ...
      expect(wizardFloor.data.LineOfCreditId.LineOfCreditId).toEqual('retail-loc-id');
    });

    it('should not have line of credit data for non dealer', function() {
      spyOn(mockUser, 'isDealer').and.returnValue(false);
      initController();
      scope.$digest();
      // This is the same with above:
      // the LineOfCreditId is holding the LineOfCredit object,
      // but we call it LineOfCreditId ...
      expect(wizardFloor.data.LineOfCreditId).toBe(null);
    });

    it('should use active physical location of the dealer', function() {
      spyOn(mockAddress, 'getActivePhysical');
      scope.$digest();
      expect(mockAddress.getActivePhysical).toHaveBeenCalled();
    });

    it('should set can pay buyer option', function() {
      scope.$digest();
      expect(wizardFloor.paySellerOptions).toBe(false);
    });

    it('should get pay seller options', function() {
      scope.$digest();
      expect(wizardFloor.canPayBuyer).toBe(false);
    });
  });

  describe('Reset function', function() {
    it('should exist', function() {
      expect(typeof wizardFloor.reset).toBe('function');
    });

    it('should reset everything', function() {
      scope.$digest();
      spyOn(wizardFloor.optionsHelper, 'applyDefaults');
      spyOn($state, 'go');
      wizardFloor.reset();
      expect(wizardFloor.data).toEqual(wizardFloor.defaultData);
      expect(wizardFloor.optionsHelper.applyDefaults).toHaveBeenCalled();
      expect(wizardFloor.validity).not.toBeDefined();
      expect($state.go).toHaveBeenCalledWith('flooringWizard.car');
    });
  });

  // navigation test

  xdescribe('Submit function', function() {
    var succeed = true;

    beforeEach(inject(function() {
      scope.form = mockForm;
      spyOn(dialog, 'open').and.returnValue({
        result: {
          then: function (callback) {
            callback(succeed);
          }
        }
      });

      $httpBackend.expectPOST('/floorplan/v1_1/create')
        .respond({
          Success: true,
          Message: null,
          Data: {
            FloorplanId: 'floorplan-id'
          }
        });
    }));

    it('should exist', function() {
      expect(typeof wizardFloor.submit).toBe('function');
    });

    it('should create the validity object and update the error flag', function() {
      expect(wizardFloor.validity).not.toBeDefined();
      expect(scope.vinDetailsErrorFlag).toBe(false);
      scope.submit();
      expect(scope.validity).toBeDefined();
      expect(scope.vinDetailsErrorFlag).toBe(true);
    });

    xit('should do nothing if the form is invalid', function() {
      scope.form.$valid = false;
      scope.submit();
      expect(dialog.open).not.toHaveBeenCalled();
    });

    xit('should call dialog with a valid form', function() {
      scope.form.$valid = true;
      scope.submit();
      expect(dialog.open.calls.mostRecent().args[0].resolve.formData()).toEqual(scope.data);
    });

    xit('should call reallySubmit() if user confirms', function() {
      spyOn(scope, 'reallySubmit').and.returnValue();
      scope.submit();
      expect(scope.reallySubmit).toHaveBeenCalled();
    });

    xit('should not call reallySubmit() if user does not confirm', function() {
      succeed = false;
      spyOn(scope, 'reallySubmit').and.returnValue();
      scope.submit();
      expect(scope.reallySubmit).not.toHaveBeenCalled();
    })
  });

  xdescribe('really submit function', function() {
    var  p;

    beforeEach(function() {
      $httpBackend.whenGET('/info/v1_1/businesshours').respond({});
    });

    beforeEach(inject(function(protect) {
      p = protect;

      spyOn(dialog, 'open').and.returnValue({
        open: function() {
          return {
            then: function(s,f) {
              if (succeed) {
                s(true);
              } else {
                s(false);
              }
            }
          };
        }
      });
    }));

    it('should exist', function() {
      expect(typeof scope.reallySubmit).toBe('function');
    });

    it('should throw an error if guard and protect are not the same', function() {
      expect(function() { scope.reallySubmit({}); }).toThrow();
    });

    xit('should show a dialog if the flooring is successful', function() {
      $httpBackend.whenPOST('/floorplan/v1_1/create')
        .respond(function() {
          return [200, { Success: true , Data: {FloorplanId: 'asdlfkjpobiwjeklfjsdf'}}];
        });
    });

    it('should do nothing if the flooring fails', function() {
      $httpBackend.whenPOST('/floorplan/v1_1/create')
        .respond(function() {
          return [200, { Success: false , Data: {FloorplanId: 'asdlfkjpobiwjeklfjsdf'}}];
        });
      expect(dialog.open).not.toHaveBeenCalled();
    })
  });

  // submission test

});