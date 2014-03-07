'use strict';

describe('Model: AccountManagement', function() {

  beforeEach(module('nextgearWebApp'));

  var httpBackend, $q, accountManagement, emailStub, securityAnswersStub, user, success;

  beforeEach(inject(function ($httpBackend, _$q_, AccountManagement, User) {
    httpBackend = $httpBackend;
    $q = _$q_;
    accountManagement = AccountManagement;
    emailStub = 'peanutbutter@jellytime.com';
    user = User;

    success = {
      Success: true,
      Message: null,
      Data: null
    };
  }));

  it('should call get method', function() {

    httpBackend.expectGET('/userAccount/settings').respond({
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


    httpBackend.expectGET('/dealer/summary').respond({
      Success: true,
      Message: null,
      Data: {
        ReserveFunds: 234253,
        LastPayment: 2343,
        LastPaymentDate: '2013-12-13'
      }
    });


    httpBackend.expectGET(/\/dealer\/buyer\/dashboard\/[0-9-]{10}\/[0-9-]{10}/).respond({
      Success: true,
      Message: null,
      Data: {
        "UnappliedFundsTotal": 2222,
        "TotalAvailableUnappliedFunds": 1111,
      }
    });


    spyOn(user, 'getStatics').andReturn({
      BankAccounts: []
    });

    var res;
    accountManagement.get().then(function (result) {
      res = result;
    });
    httpBackend.flush();
    expect(res).toBeDefined();
    expect(res.CurrentTitleReleaseAddress).toBe(res.Addresses[1]);
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