'use strict';

fdescribe('Controller: WizardFloorCtrl', function() {
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
        return $q.when({});
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
            "BankAccountId": "66e9e774-3dcc-4852-801d-b6e91d161a13",
            "IsActive": true
          }, {
            'AchBankName': 'Bank Bla Bla',
            "BankAccountId": "76e9e774-3dcc-4852-801d-b6e91d161a13",
            "IsActive": true
          }, {
            "BankAccountId": "86e9e774-3dcc-4852-801d-b6e91d161a13",
            "IsActive": false
          }]
        });
      }
    };

    mockAddress = {
      getActivePhysical: function() {
        return [];
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

  });

  it('should default line of credit to retail', function() {

  });

  it('should use active physical location of the dealer', function() {

  });

  it('should set can pay buyer option', function() {

  });

  it('should get pay seller options', function() {

  });

  // navigation test

  // submission test

});