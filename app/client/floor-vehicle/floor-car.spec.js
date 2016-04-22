'use strict';

describe('Controller: FloorCarCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var FloorCarCtrl,
    scope,
    initController,
    userMock,
    floorplan,
    dialog,
    location,
    blackbook,
    AddressesMock,
    mockDealerSummary,
    mockForm,
    statics = { colors: ['red', 'green']}, // Constant object so digest limit isn't reached
    myCanPayBuyer = true,
    myPaySellerOptions = false,
    $q,
    api,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, Floorplan, $uibModal, $location, Blackbook, _$q_, _api_, _$httpBackend_) {
    scope = $rootScope.$new();
    floorplan = Floorplan;
    dialog = $uibModal;
    location = $location;
    blackbook = Blackbook;
    $q = _$q_;
    $httpBackend = _$httpBackend_;

    $httpBackend.whenPOST('floorplan/upload/asdlfkjpobiwjeklfjsdf')
      .respond({
        Success: true,
        Message: null
      });

    userMock = {
      isDealer: function() {
        return false;
      },
      getStatics: function() {
        return $q.when(statics);
      },
      getInfo: function() {
        return $q.when({});
      },
      canPayBuyer: function() {
        return $q.when(myCanPayBuyer);
      },
      getPaySellerOptions: function() {
        return $q.when(myPaySellerOptions);
      },
      isUnitedStates: function(){
        return true;
      },
      getFeatures: function(){
        return {uploadDocuments: {enabled: false}};
      }
    };

    mockDealerSummary = {
      getDealerSummary: function () {
        return $q.when({
          BankAccounts: [{
            "BankAccountId": "66e9e774-3dcc-4852-801d-b6e91d161a13",
            "IsActive": true
          }, {
            "BankAccountId": "76e9e774-3dcc-4852-801d-b6e91d161a13",
            "IsActive": true
          }, {
            "BankAccountId": "86e9e774-3dcc-4852-801d-b6e91d161a13",
            "IsActive": false
          }]
        });
      }
    };

    AddressesMock = {
      getActivePhysical: function() {
        return [];
      }
    };

    mockForm = {
      $valid: true,
      inputMileage: {}
    };

    initController = function() {
      FloorCarCtrl = $controller('FloorCarCtrl', {
        $scope: scope,
        User: userMock,
        Floorplan: floorplan,
        $uibModal: dialog,
        $location: location,
        Blackbook: blackbook,
        Addresses: AddressesMock,
        AccountManagement: mockDealerSummary
      });
    };
  }));

  var registerCommonTests = function() {
    it('should attach necessary objects to the scope', inject(function ($rootScope) {
      scope.$apply();
      expect(scope.options).toBeDefined();
      expect(scope.options.colors).toBe(statics.colors);
      expect(scope.options.locations).toBeDefined();
      expect(scope.paySellerOptions).toBe(myPaySellerOptions);
      expect(scope.canPayBuyer).toBe(myCanPayBuyer);
      expect(scope.optionsHelper).toBeDefined();

      // should only display active bank account
      scope.options.BankAccounts.forEach(function (bankAccount) {
        expect(bankAccount.IsActive).toBe(true);
      });
      expect(scope.options.BankAccounts.length).toBe(2);

      expect(scope.defaultData).toBeDefined();
      expect(scope.vinDetailsErrorFlag).toBe(false);
    }));

    describe('reset function', function() {
      it('should exist', function() {
        expect(typeof scope.reset).toBe('function');
      });

      it('should reset everything', function() {
        spyOn(scope.optionsHelper, 'applyDefaults');
        scope.reset();
        expect(scope.data).toEqual(scope.defaultData);
        expect(scope.optionsHelper.applyDefaults).toHaveBeenCalled();
        expect(scope.validity).not.toBeDefined();
      });
    });

    describe('submit function', function() {
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
            Data: {FloorplanId: 'asdlfkjpobiwjeklfjsdf'}
          });
      }));

      it('should exist', function() {
        expect(typeof scope.submit).toBe('function');
      });

      it('should create the validity object and update the error flag', function() {
        expect(scope.validity).not.toBeDefined();
        expect(scope.vinDetailsErrorFlag).toBe(false);
        scope.submit();
        expect(scope.validity).toBeDefined();
        expect(scope.vinDetailsErrorFlag).toBe(true);
      });

      it('should do nothing if the form is invalid', function() {
        scope.form.$valid = false;
        scope.submit();
        expect(dialog.open).not.toHaveBeenCalled();
      });

      it('should call dialog with a valid form', function() {
        scope.form.$valid = true;
        scope.submit();
        expect(dialog.open.calls.mostRecent().args[0].resolve.formData()).toEqual(scope.data);
      });

      it('should call reallySubmit() if user confirms', function() {
        spyOn(scope, 'reallySubmit').and.returnValue();
        scope.submit();
        expect(scope.reallySubmit).toHaveBeenCalled();
      });

      it('should not call reallySubmit() if user does not confirm', function() {
        succeed = false;
        spyOn(scope, 'reallySubmit').and.returnValue();
        scope.submit();
        expect(scope.reallySubmit).not.toHaveBeenCalled();
      })
    });

    describe('really submit function', function() {
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

    describe('cancel function', function() {
      var goHome = true,
        goReset = false,
        dialogMock,
        q,
        deferred;

      beforeEach(inject(function($q) {
        q = $q;

        dialog.messageBox = function() {
          return {
            open: function() {
              deferred = q.defer();
              deferred.resolve('home');
              return deferred.promise;
            }
          };
        };
      }));

      it('should exist', function() {
        expect(typeof scope.cancel).toBe('function');
      });

      it('should launch a messagebox box', function() {
        spyOn(dialog, 'open').and.callThrough();
        scope.cancel();
        expect(dialog.open).toHaveBeenCalled();
      });
    });
  };

  describe('in dealer mode', function() {
    beforeEach(function(){
      spyOn(userMock, 'isDealer').and.returnValue(true);
      initController();
      scope.$apply();
    });

    registerCommonTests();

    it('Canada', function() {
      spyOn(userMock, 'isUnitedStates').and.returnValue(false);
      initController();
      scope.$apply();
      expect(scope.mileageOrOdometer).toEqual('Odometer');
    });

    it('States', function() {
      spyOn(userMock, 'isUnitedStates').and.returnValue(true);
      initController();
      scope.$apply();
      expect(scope.mileageOrOdometer).toEqual('Mileage');
    });

  });

  describe('in auction mode', function() {
    beforeEach(function() {
      spyOn(userMock, 'isDealer').and.returnValue(false);
      initController();
      scope.$apply();
    });

    registerCommonTests();

    it('should populate the inventory address options based on the selected business', function() {
      var biz1 = {
          BusinessId: '123id',
          ActivePhysicalInventoryLocations: [
            { AddressId: 'addr1' },
            { AddressId: 'addr2' }
          ]
        },
        biz2 = {
          BusinessId: '456id',
          ActivePhysicalInventoryLocations: [
            { AddressId: 'addr3' }
          ]
        };

      expect(scope.sellerLocations).toBe(null);
      scope.data.BusinessId = biz1;
      scope.$digest();
      expect(scope.sellerLocations).toBe(biz1.ActivePhysicalInventoryLocations);

      scope.data.BusinessId = biz2;
      scope.$digest();
      expect(scope.sellerLocations).toBe(biz2.ActivePhysicalInventoryLocations);
      expect(scope.data.PhysicalInventoryAddressId).toBe(biz2.ActivePhysicalInventoryLocations[0]);
    });
  });
});
