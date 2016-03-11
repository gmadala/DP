'use strict';

describe('Model: AccountManagement', function() {

  beforeEach(module('nextgearWebApp'));

  var httpBackend,
    $q,
    AccountManagement,
    emailStub,
    User,
    success;

  beforeEach(inject(function ($httpBackend, _$q_, _AccountManagement_, _User_) {
    httpBackend = $httpBackend;
    $q = _$q_;
    AccountManagement = _AccountManagement_;
    emailStub = 'peanutbutter@jellytime.com';
    User = _User_;

    User.isDealer = function() {
      return true;
    };

    spyOn(User, 'getInfo').and.returnValue($q.when({
      BankAccounts: []
    }));


    success = {
      Success: true,
      Message: null,
      Data: null
    };

    var bankAccountData = {
      Success: true,
      Message: null,
      Data: {
        AccountId: "9e05f8c9-2e3b-4f80-a346-00004bceacb1",
        AccountName: "JP Morgan Chase Bank - 7905",
        BankName: "JP Morgan Chase Bank",
        IsActive: true,
        RoutingNumber: "349886738",
        City: "Phoenix",
        State: "77c78343-f0f1-4152-9f77-58a393f4099d",
        IsDefaultPayment: true,
        IsDefaultDisbursement: true,
        AccountNumber : "4199137905"
      }
    };
    httpBackend.whenGET('/Dealer/bankAccount/9e05f8c9-2e3b-4f80-a346-00004bceacb1').respond(bankAccountData);
    httpBackend.whenPUT('/Dealer/bankAccount/').respond(bankAccountData);
    httpBackend.whenPOST('/Dealer/bankAccount/').respond(bankAccountData);

    httpBackend.whenGET('/userAccount/v1_1/settings').respond({
      Success: true,
      Message: null,
      Data: {
        Username: "10264DG",
        Email: "diana.guarin@manheim.com",
        CellPhone: "2143301800",
        BusinessEmail: "diana.guarin@manheim.com",
        EnhancedRegistrationEnabled: false
      }
    });


    httpBackend.whenGET('/dealer/v1_1/summary').respond({
      Success: true,
      Message: null,
      Data: {
        ReserveFundsBalance: 234253,
        TotalAvailableCredit: 1234.56,
        LastPaymentDate: "2013-01-01",
        LastPaymentAmount: 180.00,
        UnappliedFundsTotal: 2222,
        TotalAvailableUnappliedFunds: 1111,
        BankAccounts: []
      }
    });

  }));

  it('should call get method', function() {

    httpBackend.expectGET('/userAccount/v1_1/settings');
    var res;
    AccountManagement.get().then(function (result) {
      res = result;
    });
    httpBackend.flush();
    expect(res).toBeDefined();
  });

  it('should call getFinancialAccountData method', function() {
    httpBackend.expectGET('/dealer/v1_1/summary');
    spyOn(User, 'refreshInfo').and.returnValue(
      $q.when({
        DefaultDisbursementBankAccountId: 'foo',
        DefaultBillingBankAccountId: 'bar'
      })
    );

    var res;
    AccountManagement.getFinancialAccountData().then(function (result) {
      res = result;
    });

    httpBackend.flush();
    expect(res).toBeDefined();
    expect(User.refreshInfo).toHaveBeenCalled();


    var expected = {
      TotalAvailableCredit: 1234.56,
      ReserveFundsBalance: 234253,
      LastPaymentAmount: 180.00,
      LastPaymentDate: '2013-01-01',
      UnappliedFundsTotal: 2222,
      TotalAvailableUnappliedFunds: 1111
    };

    expect(res.AvailableCredit).toBe(expected.TotalAvailableCredit);
    expect(res.ReserveFunds).toBe(expected.ReserveFundsBalance);
    expect(res.LastPayment).toBe(expected.LastPaymentAmount);
    expect(res.LastPaymentDate).toBe(expected.LastPaymentDate);
    expect(res.UnappliedFunds).toBe(expected.UnappliedFundsTotal);
    expect(res.TotalAvailable).toBe(expected.TotalAvailableUnappliedFunds);
  });

  it('should call saveBusiness method', function() {
    httpBackend.expectPOST('/UserAccount/businessSettings').respond(success);
    AccountManagement.saveBusiness('email', true, true);
    expect(httpBackend.flush).not.toThrow();
  });

  it('should call saveTitleAddress method', function() {
    httpBackend.expectPOST('/UserAccount/titleSettings').respond(success);
    AccountManagement.saveTitleAddress(5);
    expect(httpBackend.flush).not.toThrow();
  });

  it('should call getBankAccount and throw error with invalid id', function() {
    spyOn(AccountManagement, 'getBankAccount').and.callThrough();
    expect(AccountManagement.getBankAccount).toThrow(new Error('Account id is required.'));
  });

  it('should call getBankAccount and receive a valid id', function() {
    var returnedAccount = {};
    AccountManagement.getBankAccount('9e05f8c9-2e3b-4f80-a346-00004bceacb1').then(function(bankAccount) {
      returnedAccount = bankAccount;
    });
    httpBackend.flush();
    expect(returnedAccount.AccountId).toEqual('9e05f8c9-2e3b-4f80-a346-00004bceacb1');
  });

  it('should call updateBankAccount and throw error with invalid bank account', function() {
    spyOn(AccountManagement, 'updateBankAccount').and.callThrough();
    expect(AccountManagement.updateBankAccount).toThrow(new Error('Bank account is required.'));
  });

  it('should call updateBankAccount', function() {
    var returnedBankAccount = {}, updatedBankAccount = {};

    AccountManagement.getBankAccount('9e05f8c9-2e3b-4f80-a346-00004bceacb1')
      .then(function (bankAccount) {
        returnedBankAccount = bankAccount;
        return bankAccount;
      }).then(function (returnedBankAccount) {
        return AccountManagement.updateBankAccount(returnedBankAccount)
          .then(function (bankAccount) {
            updatedBankAccount = bankAccount;
            return updatedBankAccount;
          });
      });

    spyOn(AccountManagement, 'updateBankAccount').and.callThrough();
    httpBackend.flush();

    expect(AccountManagement.updateBankAccount).toHaveBeenCalledWith(returnedBankAccount);
    expect(updatedBankAccount).toEqual(returnedBankAccount);
  });

  it('should call addBankAccount and throw error with invalid bank account', function() {
    spyOn(AccountManagement, 'addBankAccount').and.callThrough();
    expect(AccountManagement.addBankAccount).toThrow(new Error('Bank account is required.'));
  });

  it('should call addBankAccount', function() {
    var newBankAccount = {}, returnedBankAccount = {};
    spyOn(AccountManagement, 'addBankAccount').and.callThrough();

    AccountManagement.getBankAccount('9e05f8c9-2e3b-4f80-a346-00004bceacb1')
      .then(function (mockAccount) {
        returnedBankAccount = mockAccount;
        AccountManagement.addBankAccount(returnedBankAccount)
          .then(function (bankAccount) {
            newBankAccount = bankAccount;
          });
      });

    httpBackend.flush();

    expect(AccountManagement.addBankAccount).toHaveBeenCalled();
    expect(AccountManagement.addBankAccount).toHaveBeenCalledWith(returnedBankAccount);

    expect(newBankAccount.AccountId).toEqual('9e05f8c9-2e3b-4f80-a346-00004bceacb1');
    expect(newBankAccount).toEqual(returnedBankAccount);
  });
});
