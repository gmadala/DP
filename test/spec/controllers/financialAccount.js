'use strict';

describe('Controller: FinancialAccountCtrl', function () {

  var FinancialAccountCtrl,
    AccountManagementMock,
    scope,
    dialog,
    bankAccount,
    bankId;

  beforeEach(module('nextgearWebApp'));

  describe('editing financial account', function () {
    beforeEach(inject(function ($controller, $rootScope, $q) {

      bankAccount = {
        'AccountId': '9e05f8c9-2e3b-4f80-a346-00004bceacb1',
        'AccountName': 'JP Morgan Chase Bank - 7905',
        'BankName': 'JP Morgan Chase Bank',
        'IsActive': true,
        'RoutingNumber': '349886738',
        'City': 'Phoenix',
        'State': '77c78343-f0f1-4152-9f77-58a393f4099d',
        'IsDefaultPayment': true,
        'IsDefaultDisbursement': true,
        'AccountNumber': '4199137905'
      };

      dialog = {
        close: angular.noop
      };

      AccountManagementMock = {
        getBankAccount: function () {
          return $q.when(bankAccount);
        },
        updateBankAccount: function () {
          return $q.when(bankAccount);
        }
      };

      scope = $rootScope.$new();
      FinancialAccountCtrl = $controller('FinancialAccountCtrl', {
        $scope: scope,
        AccountManagement: AccountManagementMock,
        dialog: dialog,
        options: {
          account: bankAccount,
          defaultForBilling: true,
          defaultForDisbursement: true,
          modal: 'edit'
        }
      });
    }));

    it('should remove digit other than last 4 digit of account number', function () {
      expect(scope.accountNumberDisplay).toMatch(/\D+\d{4}$/);
    });

    it('should remove digit other than last 4 digit of account number', function () {
      expect(scope.accountNumberDisplay).toMatch(/\D+\d{4}$/);
    });

    it('should receive bank account information from the directive', function () {
      expect(scope.account).toEqual(bankAccount);
    });

    it('should set the default billing and disbursement value', function() {
      expect(scope.defaultForBilling).toBeTruthy();
      expect(scope.defaultForDisbursement).toBeTruthy();
    });

    describe('the dialog', function() {
      beforeEach(function() {
        scope.financialAccountForm = {
          $valid: true
        };
        scope.confirmAccountNumberValid = true;
        scope.inputs.confirmAccountNumber = '4199137905';
      });

      it('should close when close function is called', function () {
        spyOn(dialog, 'close').andCallThrough();
        scope.close();
        expect(dialog.close).toHaveBeenCalled();
      });

      it('should not close when the form is not valid', function () {
        scope.financialAccountForm = {
          $valid: false
        };

        spyOn(dialog, 'close').andCallThrough();
        spyOn(AccountManagementMock, 'updateBankAccount').andCallThrough();

        scope.confirmRequest();
        expect(AccountManagementMock.updateBankAccount).not.toHaveBeenCalled();
        expect(dialog.close).not.toHaveBeenCalled();
      });

      it('should close after updating bank account succeed', function () {
        spyOn(dialog, 'close').andCallThrough();
        spyOn(AccountManagementMock, 'updateBankAccount').andCallThrough();

        scope.confirmRequest();
        // resolve remaining promise to send the updated bank account
        scope.$digest();

        // editing bank account should not override the original account number with the view value
        expect(scope.account.AccountNumber).not.toEqual(scope.accountNumberDisplay);
        // check the update bank account call and dialog's close is called.
        expect(AccountManagementMock.updateBankAccount).toHaveBeenCalled();
        expect(dialog.close).toHaveBeenCalled();
      });

      it('should not set accountName when closing', function () {
        var original = scope.account.AccountName;

        scope.account.BankName = 'Chase Bank';
        scope.account.AccountNumber = '1234';
        scope.$digest();

        expect(scope.account.AccountName).toBe(original);
      });

      it('should set accountName to \'bankName\' - \'accountNumberLast4\'',function () {
        scope.account.BankName = 'Chase Bank';
        scope.account.AccountNumber = '1234';
        scope.$digest();

        expect(scope.accountNameDisplay).toBe('1234 - Chase Bank');
      });
    });
  });

  describe('adding financial account', function () {
    beforeEach(inject(function ($controller, $rootScope, $q) {

      bankAccount = {
        'AccountName': 'JP Morgan Chase Bank - 7905',
        'BankName': 'JP Morgan Chase Bank',
        'IsActive': true,
        'RoutingNumber': '349886738',
        'City': 'Phoenix',
        'State': '77c78343-f0f1-4152-9f77-58a393f4099d',
        'IsDefaultPayment': true,
        'IsDefaultDisbursement': true,
        'AccountNumber': '4199137905'
      };

      bankId = '9e05f8c9-2e3b-4f80-a346-00004bceacb1';

      dialog = {
        close: angular.noop
      };

      AccountManagementMock = {
        addBankAccount: function () {
          return $q.when(bankId);
        }
      };

      scope = $rootScope.$new();
      FinancialAccountCtrl = $controller('FinancialAccountCtrl', {
        $scope: scope,
        AccountManagement: AccountManagementMock,
        dialog: dialog,
        options: {
          modal: 'add',
          account : {
            AccountNumber: '',
            IsActive: false,
            IsDefaultDisbursement: false,
            IsDefaultPayment: false
          }
        }
      });
    }));

    it('should have empty fields', function() {
      expect(scope.account.AccountName).toBeUndefined();
      expect(scope.account.AccountNumber).toBe('');
      expect(scope.account.BankName).toBeUndefined();
      expect(scope.account.City).toBeUndefined();
      expect(scope.account.IsActive).toBeFalsy();
      expect(scope.account.IsDefaultDisbursement).toBeFalsy();
      expect(scope.account.IsDefaultPayment).toBeFalsy();
      expect(scope.account.RoutingNumber).toBeFalsy();
      expect(scope.account.State).toBeUndefined();
    });

    it('should set accountNameDisplay to \'accountNumberLast4\' - \'bankName\'',function () {
      scope.account.BankName = 'Chase Bank';
      scope.account.AccountNumber = '1234';
      scope.$digest();

      expect(scope.accountNameDisplay).toBe('1234 - Chase Bank');
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

    describe('the dialog', function() {
      beforeEach(function() {
        scope.financialAccountForm = {
          $valid: true
        };

        scope.confirmAccountNumberValid = true;
      });

      it('should not close if the form is not valid', function () {
        scope.financialAccountForm = {
          $valid: false
        };

        spyOn(dialog, 'close').andCallThrough();
        spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

        scope.confirmRequest();

        expect(dialog.close).not.toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).not.toHaveBeenCalled();
      });

      it('should close after adding bank account succeed', function () {
        spyOn(dialog, 'close').andCallThrough();
        spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

        scope.confirmRequest();
        // resolve remaining promise to send the updated bank account
        scope.$digest();

        expect(dialog.close).toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
      });

      it('should not close if account is inactive and set to default disbursement or default payment.', function () {
        spyOn(dialog, 'close').andCallThrough();
        spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

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
        spyOn(dialog, 'close').andCallThrough();
        spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

        scope.account.IsActive = true;
        scope.account.IsDefaultDisbursement = true;
        scope.account.IsDefaultPayment = true;

        scope.confirmRequest();
        scope.$digest();

        expect(dialog.close).toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
      });

      it('should close if account is inactive and no defaults are set.', function () {
        spyOn(dialog, 'close').andCallThrough();
        spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

        scope.account.IsActive = false;
        scope.account.IsDefaultDisbursement = false;
        scope.account.IsDefaultPayment = false;

        scope.confirmRequest();
        scope.$digest();

        expect(dialog.close).toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
      });

      it('should not close if account number does not match confirm input', function() {
        spyOn(dialog, 'close').andCallThrough();
        spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

        scope.account.AccountNumber = '123123123';
        scope.inputs.confirmAccountNumber = '987987987';

        scope.confirmRequest();
        scope.$digest();

        expect(dialog.close).not.toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).not.toHaveBeenCalled();
      });

      it('should close if account number does match confirm input', function() {
        spyOn(dialog, 'close').andCallThrough();
        spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

        scope.account.AccountNumber = '123123123';
        scope.inputs.confirmAccountNumber = '123123123';

        scope.confirmRequest();
        scope.$digest();

        expect(dialog.close).toHaveBeenCalled();
        expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
      });

      it('should close and set accountName to bankName.', function () {
        spyOn(dialog, 'close').andCallThrough();

        scope.account.BankName = 'Chase Bank';
        scope.account.AccountNumber = '123123123';
        scope.inputs.confirmAccountNumber = '123123123';

        scope.confirmRequest();
        scope.$apply();

        expect(dialog.close).toHaveBeenCalled();
        expect(scope.account.AccountName).toBe('Chase Bank');
      });
    });
  });
});
