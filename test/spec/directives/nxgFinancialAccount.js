'use strict';

describe('Directive: nxgFinancialAccount', function () {
  beforeEach(module('nextgearWebApp', 'scripts/directives/nxgFinancialAccount/nxgFinancialAccount.html',
    'scripts/directives/nxgIcon/nxgIcon.html'));

  var disbursementAccount = "66e9e774-3dcc-4852-801d-b6e91d161a13";
  var billingAccount = "76e9e774-3dcc-4852-801d-b6e91d161a13";

  var element,
    scope,
    $compile,
    $rootScope,
    iScope,
    account;

  function createIsolateScope() {
    element = $compile(element)(scope);
    scope.$digest();

    iScope = element.isolateScope();
  }

  beforeEach(inject(function (_$compile_, _$rootScope_) {

    account = {
      "BankAccountId": "123456789",
      "BankAccountName": "Super Bank Account",
      "AchAccountNumberLast4": 1098,
      "IsActive": true,
      "AchAbaNumber": 123456789,
      "AchBankName": "Previous Wheel FCU",
      "AllowPaymentByAch": true
    };

    $compile = _$compile_;
    $rootScope = _$rootScope_;

    scope = $rootScope.$new();

    scope.account = account;
    scope.disbursementAccount = disbursementAccount;
    scope.billingAccount = billingAccount;
    scope.isStakeholderActive=true;

    element = angular.element(
      '<nxg-financial-account account="account" disbursement-account="disbursementAccount" billing-account="billingAccount" is-stakeholder-active="isStakeholderActive"></nxg-financial-account>');

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

  it('status should be "Active" if IsActive is true', function () {

    iScope.account.IsActive = true;

    createIsolateScope();

    expect(iScope.status).toEqual('Active');
  });


  it('status should be "Inactive" if IsActive is not true', function () {

    iScope.account.IsActive = null;
    createIsolateScope();
    expect(iScope.status).toEqual('Inactive');

    iScope.account.IsActive = undefined;
    createIsolateScope();
    expect(iScope.status).toEqual('Inactive');

    iScope.account.IsActive = false;
    createIsolateScope();
    expect(iScope.status).toEqual('Inactive');
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

    expect(iScope.defaultForDisbursement).toBeFalsy();
    expect(iScope.defaultForBilling).toBeFalsy();
  });
});
