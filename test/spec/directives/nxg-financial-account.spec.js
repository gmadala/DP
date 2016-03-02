'use strict';

describe('Directive: nxgFinancialAccount', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxg-financial-account/nxg-financial-account.html',
    'scripts/directives/nxg-icon/nxg-icon.html'));

  var disbursementAccount = "66e9e774-3dcc-4852-801d-b6e91d161a13";
  var billingAccount = "76e9e774-3dcc-4852-801d-b6e91d161a13";

  var element,
    scope,
    $compile,
    $rootScope,
    $dialog,
    $q,
    User,
    iScope,
    account,
    transaction,
    undefinedTransaction,
    editedBankAccount;

  function createIsolateScope() {
    element = $compile(element)(scope);
    scope.$digest();
    iScope = element.isolateScope();
  }

  beforeEach(inject(function (_$compile_, _$rootScope_, _$dialog_, _$q_, _gettext_, _gettextCatalog_,  _User_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $dialog = _$dialog_;
    $q = _$q_;
    User = _User_;

    spyOn($dialog, 'dialog').and.callFake(function() {
      return {
        open: function() {
          return $q.when(editedBankAccount);
        }
      };
    });
    spyOn(User, 'refreshInfo').and.callFake(angular.noop);

    editedBankAccount = {
      AccountId: '66e9e774-3dcc-4852-801d-b6e91d161a13',
      AccountName: '789 - Chase Bank',
      AccountNumber: '789',
      BankName: 'Chase Bank',
      City: 'Indianapolis',
      IsActive: true,
      IsDefaultDisbursement: true,
      IsDefaultPayment: true,
      RoutingNumber: '123456789',
      State: '0ecc6d57-aeeb-4f52-85a2-e9e33a33b1e3'
    };

    account = {
      "BankAccountId": "123456789",
      "BankAccountName": "Super Bank Account",
      "AchAccountNumberLast4": "1098",
      "IsActive": true,
      "AchAbaNumber": "123456789",
      "AchBankName": "Previous Wheel FCU",
      "AllowPaymentByAch": true
    };

    transaction = {
      FinancialTransactionId: '0ecc6d57-aeeb-4f52-85a2-e9e33a33b1e3',
      MaxDate: '2015-06-13'
    };
    undefinedTransaction = undefined;
    scope = $rootScope.$new();

    scope.account = account;
    scope.disbursementAccount = disbursementAccount;
    scope.billingAccount = billingAccount;
    scope.isStakeholderActive = true;
    scope.isUnitedStates = true;
    scope.transaction = transaction;

    element = angular.element(
      '<nxg-financial-account account="account" disbursement-account="disbursementAccount"' +
      ' billing-account="billingAccount" is-stakeholder-active="isStakeholderActive"' +
      ' is-united-states="isUnitedStates" recent-transaction="transaction">' +
      '</nxg-financial-account>');

    createIsolateScope();
    expect(iScope).toBeDefined();
  }));

  it('should be displayed only if AllowPaymentByAch is true', function () {
    expect(iScope.displayed).toBeTruthy();
    iScope.account.AllowPaymentByAch = false;
    createIsolateScope();
    expect(iScope.displayed).toBeFalsy();
  });

  it('should be displayed if active or inactive', function () {
    iScope.account.IsActive = true;
    createIsolateScope();
    expect(iScope.displayed).toBeTruthy();

    iScope.account.IsActive = false;
    createIsolateScope();
    expect(iScope.displayed).toBeTruthy();
  });

  it('should show edit if stakeholder active', function () {
    createIsolateScope();

    iScope.editBankAccountEnabled= true;
    iScope.isStakeholderActive = true;
    expect(iScope.isEditable()).toBeTruthy();

    iScope.editBankAccountEnabled= false;
    iScope.isStakeholderActive = false;
    expect(iScope.isEditable()).toBeFalsy();

    iScope.editBankAccountEnabled = false;
    iScope.isStakeholderActive = true;
    expect(iScope.isEditable()).toBeFalsy();

    iScope.editBankAccountEnabled = true;
    iScope.isStakeholderActive = false;
    expect(iScope.isEditable()).toBeFalsy();
  });

  it('should not show edit if Canadian user.', function() {
    createIsolateScope();

    iScope.editBankAccountEnabled= true;
    iScope.isStakeholderActive = true;
    iScope.isUnitedStates = false;
    expect(iScope.isEditable()).toBeFalsy();

    iScope.editBankAccountEnabled= true;
    iScope.isStakeholderActive = true;
    iScope.isUnitedStates = true;
    expect(iScope.isEditable()).toBeTruthy();
  });

  it('status should be "Active" if IsActive is true', function () {
    iScope.account.IsActive = true;
    createIsolateScope();
    expect(iScope.status).toBeTruthy();
  });


  it('status should be "Inactive" if IsActive is not true', function () {
    iScope.account.IsActive = null;
    createIsolateScope();
    expect(iScope.status).toBeFalsy();

    iScope.account.IsActive = undefined;
    createIsolateScope();
    expect(iScope.status).toBeFalsy();

    iScope.account.IsActive = false;
    createIsolateScope();
    expect(iScope.status).toBeFalsy();
  });

  it('should designate default disbursement account', function () {
    scope.account.BankAccountId = disbursementAccount;
    createIsolateScope();
    expect(iScope.defaultForDisbursement).toBeTruthy();
  });

  it('should designate default billing account', function () {
    scope.account.BankAccountId = billingAccount;
    createIsolateScope();
    expect(iScope.defaultForBilling).toBeTruthy();
  });

  it('should not have special designations for non-billing, non-disbursement', function () {
    scope.account.BankAccountId = 123;

    createIsolateScope();

    expect(iScope.defaultForDisbursement()).toBeFalsy();
    expect(iScope.defaultForBilling()).toBeFalsy();
  });

  it('routing number and its label should display correctly for US and Canada users.', function() {
    expect(iScope.routingNumberDisplay).toBe('123456789');
    expect(iScope.routingNumberLabel).toBe('Routing Number');

    scope.isUnitedStates = false;
    element = angular.element(
      '<nxg-financial-account account="account" disbursement-account="disbursementAccount"' +
      ' billing-account="billingAccount" is-stakeholder-active="isStakeholderActive"' +
      ' is-united-states="isUnitedStates" recent-transaction="transaction">' +
      '</nxg-financial-account>');
    createIsolateScope();

    expect(iScope.routingNumberDisplay).toBe('56789-234');
    expect(iScope.routingNumberLabel).toBe('Transit/Institution Number');
  });

  it('should display n/a for recent transaction date.', function() {
    element = angular.element(
      '<nxg-financial-account account="account" disbursement-account="disbursementAccount"' +
      ' billing-account="billingAccount" is-stakeholder-active="isStakeholderActive"' +
      ' is-united-states="isUnitedStates" recent-transaction="undefinedTransaction">' +
      '</nxg-financial-account>');
    createIsolateScope();
    expect(iScope.recentTransactionDate).toBe('n/a');

  });


});
