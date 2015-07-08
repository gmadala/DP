'use strict';

describe('Controller: FinancialAccountCtrl', function () {

  var FinancialAccountCtrl,
    AccountManagementMock,
    scope,
    dialog,
    bankAccount;

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
          defaultForDisbursement: true
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

    it('should close the dialog when close function is called', function () {
      spyOn(dialog, 'close').andCallThrough();
      scope.close();
      expect(dialog.close).toHaveBeenCalled();
    });

    it('should not close the dialog when the form is not valid', function() {
      scope.financialAccountForm = {
        $valid: false
      };

      spyOn(dialog, 'close').andCallThrough();
      spyOn(AccountManagementMock, 'updateBankAccount').andCallThrough();

      scope.confirmRequest('edit');
      expect(AccountManagementMock.updateBankAccount).not.toHaveBeenCalled();
      expect(dialog.close).not.toHaveBeenCalled();
    });

    it('should close the dialog after updating bank account succeed', function () {
      scope.financialAccountForm = {
        $valid: true
      };

      spyOn(dialog, 'close').andCallThrough();
      spyOn(AccountManagementMock, 'updateBankAccount').andCallThrough();

      scope.confirmRequest('edit');
      // resolve remaining promise to send the updated bank account
      scope.$digest();

      // editing bank account should not override the original account number with the view value
      expect(scope.account.AccountNumber).not.toEqual(scope.accountNumberDisplay);
      // check the update bank account call and dialog's close is called.
      expect(AccountManagementMock.updateBankAccount).toHaveBeenCalled();
      expect(dialog.close).toHaveBeenCalled();
    });
  });

  describe('adding financial account', function () {
    beforeEach(inject(function ($controller, $rootScope, $q) {

      bankAccount = {};

      dialog = {
        close: angular.noop
      };

      AccountManagementMock = {
        addBankAccount: function () {
          return $q.when(bankAccount);
        }
      };

      scope = $rootScope.$new();
      FinancialAccountCtrl = $controller('FinancialAccountCtrl', {
        $scope: scope,
        AccountManagement: AccountManagementMock,
        dialog: dialog,
        options: {
          account : {
            IsActive: false,
            IsDefaultDisbursement: false,
            IsDefaultPayment: false
          }
        }
      });
    }));

    it('should have empty fields', function() {
      expect(scope.account.AccountName).toBeUndefined();
      expect(scope.account.AccountNumber).toBeUndefined();
      expect(scope.account.BankName).toBeUndefined();
      expect(scope.account.City).toBeUndefined();
      expect(scope.account.IsActive).toBeFalsy();
      expect(scope.account.IsDefaultDisbursement).toBeFalsy();
      expect(scope.account.IsDefaultPayment).toBeFalsy();
      expect(scope.account.RoutingNumber).toBeFalsy();
      expect(scope.account.State).toBeUndefined();
    });

    it('should not close the dialog if the form is not valid', function() {
      scope.financialAccountForm = {
        $valid: false
      };

      spyOn(dialog, 'close').andCallThrough();
      spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

      scope.confirmRequest('add');

      expect(dialog.close).not.toHaveBeenCalled();
      expect(AccountManagementMock.addBankAccount).not.toHaveBeenCalled();
    });

    it('should close the dialog after adding bank account succeed', function() {
      scope.financialAccountForm = {
        $valid: true
      };

      spyOn(dialog, 'close').andCallThrough();
      spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

      scope.confirmRequest('add');
      // resolve remaining promise to send the updated bank account
      scope.$digest();

      expect(dialog.close).toHaveBeenCalled();
      expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
    });

    it('should not close dialog if account is inactive and set to default disbursement and default payment.', function () {
      scope.financialAccountForm = {
        $valid: true
      };

      spyOn(dialog, 'close').andCallThrough();
      spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

      scope.account.IsActive = false;
      scope.account.IsDefaultDisbursement = true;
      scope.account.IsDefaultPayment = true;

      scope.confirmRequest('add');
      scope.$digest();

      expect(dialog.close).not.toHaveBeenCalled();
      expect(AccountManagementMock.addBankAccount).not.toHaveBeenCalled();
    });

    it('should not close dialog if account is inactive and set to default payment.', function () {
      scope.financialAccountForm = {
        $valid: true
      };

      spyOn(dialog, 'close').andCallThrough();
      spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

      scope.account.IsActive = false;
      scope.account.IsDefaultDisbursement = false;
      scope.account.IsDefaultPayment = true;

      scope.confirmRequest('add');
      scope.$digest();

      expect(dialog.close).not.toHaveBeenCalled();
      expect(AccountManagementMock.addBankAccount).not.toHaveBeenCalled();
    });

    it('should not close dialog if account is inactive and set to default disbursement.', function () {
      scope.financialAccountForm = {
        $valid: true
      };

      spyOn(dialog, 'close').andCallThrough();
      spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

      scope.account.IsActive = false;
      scope.account.IsDefaultDisbursement = true;
      scope.account.IsDefaultPayment = false;

      scope.confirmRequest('add');
      scope.$digest();

      expect(dialog.close).not.toHaveBeenCalled();
      expect(AccountManagementMock.addBankAccount).not.toHaveBeenCalled();
    });

    it('should close dialog if account is active and any defaults are set.', function () {
      scope.financialAccountForm = {
        $valid: true
      };

      spyOn(dialog, 'close').andCallThrough();
      spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

      scope.account.IsActive = true;
      scope.account.IsDefaultDisbursement = true;
      scope.account.IsDefaultPayment = true;

      scope.confirmRequest('add');
      scope.$digest();

      expect(dialog.close).toHaveBeenCalled();
      expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
    });

    it('should close dialog if account is inactive and no defaults are set.', function () {
      scope.financialAccountForm = {
        $valid: true
      };

      spyOn(dialog, 'close').andCallThrough();
      spyOn(AccountManagementMock, 'addBankAccount').andCallThrough();

      scope.account.IsActive = false;
      scope.account.IsDefaultDisbursement = false;
      scope.account.IsDefaultPayment = false;

      scope.confirmRequest('add');
      scope.$digest();

      expect(dialog.close).toHaveBeenCalled();
      expect(AccountManagementMock.addBankAccount).toHaveBeenCalled();
    });
  });
});
