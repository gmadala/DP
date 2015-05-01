'use strict';

describe('Controller: AccountManagementCtrl', function () {

  // load the controller's module
  beforeEach(module('nextgearWebApp'));

  var AccountManagementCtrl,
    scope,
    settingsData,
    AddressesMock,
    AccountManagementMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q) {

    var mockCustomerSupportPhone = $q.when({
      value: '1234567890',
      formatted: '123-456-7890'
    });

    settingsData = {
      Username: '10264DG',
      Email: 'diana.guarin@manheim.com',
      CellPhone: '2143301800',
      BusinessEmail: 'diana.guarin@manheim.com',
      EnhancedRegistrationEnabled: false,
      AutoPayEnabled: false,
      IsStakeholderActive: false,
      IsStakeholder: false
    };

    AccountManagementMock = {
      get: function() {
        return {
          then: function(success) {
            success(settingsData);
          }
        };
      }
    };

    AddressesMock = {
      getTitleAddresses: function() {
        return [
          {
            BusinessAddressId: 'be9b22cb-5896-4356-86a0-e932293faa6a',
            City: 'Dallas',
            Fax: '2143399361',
            IsTitleReleaseAddress: true,
            Line1: '5333 West Kiest Blvd',
            Line2: null,
            State: 'TX',
            Zip: '75236',
            Phone: '2143301800'
          }
        ];
      },
      getDefaultTitleAddress: function() {
        return {
          BusinessAddressId: 'be9b22cb-5896-4356-86a0-e932293faa6a',
          City: 'Dallas',
          Fax: '2143399361',
          IsTitleReleaseAddress: true,
          Line1: '5333 West Kiest Blvd',
          Line2: null,
          State: 'TX',
          Zip: '75236',
          Phone: '2143301800'
        };
      }
    };

    scope = $rootScope.$new();
    AccountManagementCtrl = $controller('AccountManagementCtrl', {
      $scope: scope,
      AccountManagement: AccountManagementMock,
      Addresses: AddressesMock,
      dealerCustomerSupportPhone: mockCustomerSupportPhone
    });
  }));

  describe('business', function() {
    it('business should exist on scope', function () {
      expect(scope.business.data).toBeDefined();
    });

    it('edit function should be defined for business', function() {
      expect(scope.business.edit).toBeDefined();
    });

    it('cancel function should be defined for business', function() {
      expect(scope.business.cancel).toBeDefined();
    });

    it('save function should be defined for business', function() {
      expect(scope.business.save).toBeDefined();
    });

    it('calling edit() on the business should set the business\'s editable property to true', function() {
      scope.business.edit();
      expect(scope.business.dirtyData).toEqual(scope.business.data);
      expect(scope.business.editable).toBe(true);
    });

    it('calling cancel() on the business should set the business\'s editable property to false', function() {
      scope.business.cancel();
      expect(scope.business.dirtyData).toBe(null);
      expect(scope.business.editable).toBe(false);
    });

    it('autoPay should be displayed only for US Dealers', function () {

      scope.isUnitedStates = true;
      scope.isDealer = true;

      expect(scope.business.autoPay.isDisplayed()).toBeTruthy();

      scope.isUnitedStates = true;
      scope.isDealer = false;

      expect(scope.business.autoPay.isDisplayed()).toBeFalsy();

      scope.isUnitedStates = false;
      scope.isDealer = true;

      expect(scope.business.autoPay.isDisplayed()).toBeFalsy();

      scope.isUnitedStates = false;
      scope.isDealer = false;

      expect(scope.business.autoPay.isDisplayed()).toBeFalsy();
    });

    it('autoPay should be editable only for active stakeholders', function () {

      scope.business.editable = true;

      scope.business.data.isStakeholderActive = true;
      scope.business.data.isStakeholder = true;

      expect(scope.business.autoPay.isEditable()).toBeTruthy();

      scope.business.data.isStakeholderActive = true;
      scope.business.data.isStakeholder = false;

      expect(scope.business.autoPay.isEditable()).toBeFalsy();

      scope.business.data.isStakeholderActive = false;
      scope.business.data.isStakeholder = true;

      expect(scope.business.autoPay.isEditable()).toBeFalsy();

      scope.business.data.isStakeholderActive = false;
      scope.business.data.isStakeholder = false;

      expect(scope.business.autoPay.isEditable()).toBeFalsy();
    });

    describe('save()', function(){
      var savingBusiness, validateResult;
      beforeEach(function() {
        validateResult = true;
        spyOn(scope.business, 'validate').andCallFake(function() {
          return validateResult;
        });
        spyOn(scope.business, 'isDirty').andReturn(true);

        AccountManagementMock.saveBusiness = function(email, enhancedRegistrationEnabled, enhancedRegistrationPin) {
          savingBusiness = {
            email: email,
            enhancedRegistrationPin: enhancedRegistrationPin,
            enhancedRegistrationEnabled: enhancedRegistrationEnabled
          };
          return {
            then: function(callback){callback()}
          };
        };
        scope.business.edit();
      });

      it('should define dirtyData and set editable to false', function() {
        scope.business.save();

        expect(scope.business.dirtyData).toBeDefined();
        expect(scope.business.editable).toBe(false);
      });

      it('should not change if not in editing mode', function() {
        validateResult = false;

        spyOn(AccountManagementMock, 'saveBusiness');

        scope.business.save();

        expect(AccountManagementMock.saveBusiness).not.toHaveBeenCalled();
      });
    });
  });

  describe('title', function() {
    it('title should exist on scope', function () {
      expect(scope.title.data).toBeDefined();
    });

    it('edit function should be defined for title', function() {
      expect(scope.title.edit).toBeDefined();
    });

    it('cancel function should be defined for title', function() {
      expect(scope.title.cancel).toBeDefined();
    });

    it('save function should be defined for title', function() {
      expect(scope.title.save).toBeDefined();
    });

    it('calling edit() on the title should set the title\'s editable property to true', function() {
      spyOn(scope.title, 'updateAddressSelection');
      scope.title.edit();
      expect(scope.title.updateAddressSelection).toHaveBeenCalled();
      expect(scope.title.dirtyData).toEqual(scope.title.data);
      expect(scope.title.editable).toBe(true);
    });

    it('calling cancel() on the title should set the title\'s editable property to false', function() {
      scope.title.cancel();
      expect(scope.title.dirtyData).toBe(null);
      expect(scope.title.editable).toBe(false);
    });

    describe('save()', function(){
      var savingTitle, validateResult;
      beforeEach(function() {
        validateResult = true;
        spyOn(scope.title, 'validate').andCallFake(function() {
          return validateResult;
        });
        spyOn(scope.title, 'isDirty').andReturn(true);
        spyOn(scope.title, 'updateAddressSelection');

        AccountManagementMock.saveTitleAddress = function(titleAddressId) {
          savingTitle = {
            titleAddressId: titleAddressId
          };
          return {
            then: function(callback){callback()}
          };
        };

        scope.title.data.titleAddress = {
          BusinessAddressId: 1
        };

        scope.title.edit();
      });

      it('should define dirtyData and set editable to false and call updateAddressSelection', function() {
        scope.title.save();

        expect(scope.title.updateAddressSelection).toHaveBeenCalled();
        expect(scope.title.dirtyData).toBeDefined();
        expect(scope.title.editable).toBe(false);
      });

      it('should not change if not in editing mode', function() {
        validateResult = false;

        spyOn(AccountManagementMock, 'saveTitleAddress');

        scope.title.save();

        expect(AccountManagementMock.saveTitleAddress).not.toHaveBeenCalled();
      });

    });

  });

});
