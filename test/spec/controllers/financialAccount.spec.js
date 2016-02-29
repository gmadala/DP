'use strict';

describe('Controller: FinancialAccountCtrl', function () {

  var FinancialAccountCtrl,
    AccountManagementMock,
    scope,
    dialog,
    segmentio,
    mockKissMetricInfo,
    httpBackend,
    $controller,
    $rootScope,
    $q,
    bankId,

    // Constants
    DEALER_ADD_BANK_ACCOUNT = 'Dealer - Add Bank Account';

  beforeEach(module('nextgearWebApp'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$q_, _metric_, _kissMetricInfo_, _$httpBackend_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    httpBackend = _$httpBackend_;
    $q = _$q_;

    dialog = {
      close: angular.noop
    };

    segmentio = {
      track: angular.noop
    }
  }));

  describe('adding financial account', function () {
    beforeEach(function () {

      bankId = '9e05f8c9-2e3b-4f80-a346-00004bceacb1';

      AccountManagementMock = {
        addBankAccount: function () {
          return $q.when(bankId);
        }
      };
      mockKissMetricInfo = {
        getKissMetricInfo: function () {
          return $q.when({
            height: 1080,
            isBusinessHours: true,
            vendor: 'Google Inc.',
            version: 'Chrome 44',
            width: 1920
          });
        }
      };

      httpBackend.whenGET('/info/v1_1/businesshours').respond($q.when({}));
      scope = $rootScope.$new();
      FinancialAccountCtrl = $controller('FinancialAccountCtrl', {
        $scope: scope,
        kissMetricInfo: mockKissMetricInfo,
        AccountManagement: AccountManagementMock,
        dialog: dialog,
        segmentio: segmentio,
        options: {
          modal: 'add',
          account : {
            AccountNumber: '',
            IsActive: false,
            IsDefaultDisbursement: false,
            IsDefaultPayment: false,
            TOSAcceptanceFlag: false
          }
        }
      });

      spyOn(scope,'showSuccessMessage').and.callFake(angular.noop);
    });

    it('should be recognized as an edit modal', function() {
      expect(scope.isAddModal).toBeTruthy();
      expect(scope.isEditModal).toBeFalsy();
    });

    it('should have empty or default fields', function() {
      expect(scope.account.AccountName).toBeUndefined();
      expect(scope.account.AccountNumber).toBe('');
      expect(scope.account.BankName).toBeUndefined();
      expect(scope.account.City).toBeUndefined();
      expect(scope.account.IsActive).toBeFalsy();
      expect(scope.account.IsDefaultDisbursement).toBeFalsy();
      expect(scope.account.IsDefaultPayment).toBeFalsy();
      expect(scope.account.TOSAcceptanceFlag).toBeFalsy();
      expect(scope.account.RoutingNumber).toBeFalsy();
      expect(scope.account.State).toBeUndefined();
    });


    it('should not set accountNameDisplay if bankName and accountNumber are not set correctly', function () {
      scope.account.BankName = '';
      scope.account.AccountNumber = '';

      scope.$digest();
      expect(scope.accountNameDisplay).toBe('');

      scope.account.BankName = 'Chase Bank';
      scope.account.AccountNumber = '';

      scope.$digest();
      expect(scope.accountNameDisplay).toBe('');

      scope.account.BankName = '';
      scope.account.AccountNumber = '1234';

      scope.$digest();
      expect(scope.accountNameDisplay).toBe('');
    });

    it('should not match more than 16 numbers against account number regex', function() {
      expect(scope.accountNumberRegex.test('12345678901234567')).toBe(false);
    });

    it('should not match non-numeric characters against account number regex', function() {
      expect(scope.accountNumberRegex.test('@!#$421321@!#')).toBe(false);
    });

    it('should match 1-16 numeric characters against account number regex', function() {
      expect(scope.accountNumberRegex.test('12345678901')).toBe(true);
    });

    it('should not match more than 9 numeric characters against routing number regex', function() {
      expect(scope.routingNumberRegex.test('1234567890')).toBe(false);
    });

    it('should not match less than 9 numeric characters against routing number regex', function() {
      expect(scope.routingNumberRegex.test('12345678')).toBe(false);
    });

    it('should not match non-numeric characters against routing number regex', function() {
      expect(scope.routingNumberRegex.test('@@#123$#@')).toBe(false);
    });

    it('should match 9 numeric characters against routing number regex', function() {
      expect(scope.routingNumberRegex.test('123456789')).toBe(true);
    });

    it('should have the checkbox disabled on default', function () {
      expect(scope.tosVisited).toBe(false);
    });

    describe('the dialog', function() {
      beforeEach(function() {
        scope.financialAccountForm = {
          $valid: true
        };

        scope.agree = true;
      });

      it('should not close if the form is not valid', function () {
        scope.financialAccountForm = {
          $valid: false
        };

        spyOn(dialog, 'close').and.callThrough();
        spyOn(AccountManagementMock, 'addBankAccount').and.callThrough();

        scope.confirmRequest();

        expect(dialog.close).not.toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).not.toHaveBeenCalled();
      });

      it('should close after adding bank account succeed', function () {
        spyOn(dialog, 'close').and.callThrough();
        spyOn(AccountManagementMock, 'addBankAccount').and.callThrough();

        scope.confirmRequest();
        // resolve remaining promise to send the updated bank account
        scope.$digest();

        expect(dialog.close).toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
      });

      it('should not close if account is inactive and set to default disbursement or default payment.', function () {
        spyOn(dialog, 'close').and.callThrough();
        spyOn(AccountManagementMock, 'addBankAccount').and.callThrough();

        scope.account.IsActive = false;
        scope.account.IsDefaultDisbursement = true;
        scope.account.IsDefaultPayment = true;

        scope.confirmRequest();
        scope.$digest();

        scope.account.IsDefaultDisbursement = false;
        scope.account.IsDefaultPayment = true;

        scope.confirmRequest();
        scope.$digest();

        scope.account.IsDefaultDisbursement = true;
        scope.account.IsDefaultPayment = false;

        scope.confirmRequest();
        scope.$digest();

        expect(dialog.close).not.toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).not.toHaveBeenCalled();
      });

      it('should close if account is active and any defaults are set.', function () {
        spyOn(dialog, 'close').and.callThrough();
        spyOn(AccountManagementMock, 'addBankAccount').and.callThrough();

        scope.account.IsActive = true;
        scope.account.IsDefaultDisbursement = true;
        scope.account.IsDefaultPayment = true;

        scope.confirmRequest();
        scope.$digest();

        expect(dialog.close).toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
      });

      it('should close if account is inactive and no defaults are set.', function () {
        spyOn(dialog, 'close').and.callThrough();
        spyOn(AccountManagementMock, 'addBankAccount').and.callThrough();

        scope.account.IsActive = false;
        scope.account.IsDefaultDisbursement = false;
        scope.account.IsDefaultPayment = false;

        scope.confirmRequest();
        scope.$digest();

        expect(dialog.close).toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
      });

      it('should not close if account number does not match confirm input', function() {
        spyOn(dialog, 'close').and.callThrough();
        spyOn(AccountManagementMock, 'addBankAccount').and.callThrough();

        scope.account.AccountNumber = '123123123';
        scope.inputs.confirmAccountNumber = '987987987';

        scope.confirmRequest();
        scope.$digest();

        expect(dialog.close).not.toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).not.toHaveBeenCalled();
      });

      it('should close if account number does match confirm input', function() {
        spyOn(dialog, 'close').and.callThrough();
        spyOn(AccountManagementMock, 'addBankAccount').and.callThrough();

        scope.account.AccountNumber = '123123123';
        scope.inputs.confirmAccountNumber = '123123123';

        scope.confirmRequest();
        scope.$digest();

        expect(dialog.close).toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
      });

      it('should close and set accountName to bankName.', function () {
        spyOn(dialog, 'close').and.callThrough();

        scope.account.BankName = 'Chase Bank';
        scope.account.AccountNumber = '123123123';
        scope.inputs.confirmAccountNumber = '123123123';

        scope.confirmRequest();
        scope.$apply();

        expect(dialog.close).toHaveBeenCalled();
        expect(scope.account.AccountName).toBe('Chase Bank');
      });

      it('should save add bank account.', function () {
        scope.confirmRequest();
        scope.$apply();
        spyOn(AccountManagementMock, 'addBankAccount').and.callThrough();
        scope.$apply();
        scope.showSuccessMessage();
        expect(scope.showSuccessMessage).toHaveBeenCalled();
      });

      it('should fire a metric if add is successful', function() {
        spyOn(segmentio, 'track').and.callThrough();
        scope.confirmRequest();
        scope.$apply();
        expect(segmentio.track).toHaveBeenCalledWith(DEALER_ADD_BANK_ACCOUNT,{
          height: 1080,
          isBusinessHours: true,
          vendor: 'Google Inc.',
          version: 'Chrome 44',
          width: 1920
        });
      });
    });
  });
});
