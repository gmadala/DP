'use strict';

describe('Model: AccountManagement', function() {

  beforeEach(module('nextgearWebApp'));

  var httpBackend,
      $q,
      accountManagement,
      emailStub,
      securityAnswersStub,
      user,
      success,
      isDealer;

  beforeEach(inject(function ($httpBackend, _$q_, AccountManagement, User) {
    httpBackend = $httpBackend;
    $q = _$q_;
    accountManagement = AccountManagement;
    emailStub = 'peanutbutter@jellytime.com';
    user = User;
    isDealer = true;
    user.isDealer = function() {
      return isDealer;
    };
    spyOn(user, 'getStatics').andReturn({
      BankAccounts: []
    });


    success = {
      Success: true,
      Message: null,
      Data: null
    };

    httpBackend.whenGET('/userAccount/settings').respond({
      Success: true,
      Message: null,
      Data: {
        "Username": "10264DG",
        "Email": "diana.guarin@manheim.com",
        "CellPhone": "2143301800",
        "BusinessEmail": "diana.guarin@manheim.com",
        "EnhancedRegistrationEnabled": false,
        "Addresses": [
          {
            "BusinessAddressId": "be9b22cb-5896-4356-86a0-e932293faa6a",
            "City": "Dallas",
            "Fax": "2143399361",
            "IsTitleReleaseAddress": false,
            "Line1": "5333 West Kiest Blvd",
            "Line2": null,
            "State": "TX",
            "Zip": "75236",
            "Phone": "2143301800"
          },
          {
            "BusinessAddressId": "be9b22cb-5896-4356-86a0-e93rwrfaa6a",
            "City": "Beverly Hills",
            "Fax": "2143399361",
            "IsTitleReleaseAddress": true,
            "Line1": "123 Dollar Ave.",
            "Line2": null,
            "State": "CA",
            "Zip": "90210",
            "Phone": "5553301800"
          }
        ]
      }
    });


    httpBackend.whenGET('/dealer/summary').respond({
      Success: true,
      Message: null,
      Data: {
        ReserveFundsBalance: 234253,
        TotalAvailableCredit: 1234.56,
        LastPaymentDate: "2013-01-01",
        LastPaymentAmount: 180.00,
        UnappliedFundsTotal: 2222,
        TotalAvailableUnappliedFunds: 1111
      }
    });

  }));

  it('should call get method', function() {

    httpBackend.expectGET('/userAccount/settings');
    var res;
    accountManagement.get().then(function (result) {
      res = result;
    });
    httpBackend.flush();
    expect(res).toBeDefined();
    expect(res.CurrentTitleReleaseAddress).toBe(res.Addresses[1]);
  });

  it('should call getFinancialAccountData method', function() {
    httpBackend.expectGET('/dealer/summary');

    var res;
    accountManagement.getFinancialAccountData().then(function (result) {
      res = result;
    });

    httpBackend.flush();

    expect(res).toBeDefined();

    var expected = {
      TotalAvailableCredit: 1234.56,
      ReserveFundsBalance: 234253,
      LastPaymentAmount: 180.00,
      LastPaymentDate: '2013-01-01',
      UnappliedFundsTotal: 2222,
      TotalAvailableUnappliedFunds: 1111,
    };

    // Any Financial Account data tranformations made here
    expect(res.BankAccounts).toBe(user.getStatics().bankAccounts);
    expect(res.AvailableCredit).toBe(expected.TotalAvailableCredit);
    expect(res.ReserveFunds).toBe(expected.ReserveFundsBalance);
    expect(res.LastPayment).toBe(expected.LastPaymentAmount);
    expect(res.LastPaymentDate).toBe(expected.LastPaymentDate);
    expect(res.UnappliedFunds).toBe(expected.UnappliedFundsTotal);
    expect(res.TotalAvailable).toBe(expected.TotalAvailableUnappliedFunds);



  });

  it('should call saveBusiness method', function() {
    httpBackend.expectPOST('/UserAccount/businessSettings').respond(success);
    accountManagement.saveBusiness('email', true, true);
    expect(httpBackend.flush).not.toThrow();
  });

  it('should call saveTitleAddress method', function() {
    httpBackend.expectPOST('/UserAccount/titleSettings').respond(success);
    accountManagement.saveTitleAddress(5);
    expect(httpBackend.flush).not.toThrow();
  });

});