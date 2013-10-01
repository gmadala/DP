'use strict';

describe('Model: User', function () {

  beforeEach(module('nextgearWebApp'));

  var user, httpBackend, api, $q;

  beforeEach(inject(function ($httpBackend, _$q_, User, _api_) {
    user = User;
    api = _api_;
    httpBackend = $httpBackend;
    $q = _$q_;
  }));

  describe('recoverUserName method', function () {

    var response;

    beforeEach(function () {
      response = {
        Success: true,
        Message: null,
        Data: null
      };
    });

    it('should post to the expected endpoint', function () {
      httpBackend.expectPOST('/userAccount/RecoverUserName/foo@example.com').respond(response);
      user.recoverUserName('foo@example.com');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for the success/failure result', function () {
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      httpBackend.whenPOST('/userAccount/RecoverUserName/foo@example.com').respond(response);
      user.recoverUserName('foo@example.com').then(success, error);
      httpBackend.flush();
      expect(success).toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    });

  });

  describe('fetchPasswordResetQuestions method', function () {

    var response,
      messages;

    beforeEach(inject(function (_messages_) {
      messages = _messages_;
      response = {
        Success: true,
        Message: null,
        Data: {
          List: [
            {
              QuestionId: 0,
              QuestionText: 'foo'
            },
            {
              QuestionId: 1,
              QuestionText: 'bar'
            }
          ]
        }
      };
    }));

    it('should call to the expected endpoint', function () {
      httpBackend.expectGET('/UserAccount/passwordResetQuestions/foouser').respond(response);
      user.fetchPasswordResetQuestions('foouser');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for the question list', function () {
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      httpBackend.whenGET('/UserAccount/passwordResetQuestions/foouser').respond(response);
      user.fetchPasswordResetQuestions('foouser').then(success, error);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(response.Data.List);
      expect(error).not.toHaveBeenCalled();
    });

    it('should reject the promise with a message object if the returned question list is empty', function () {
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      response.Data.List = [];
      httpBackend.whenGET('/UserAccount/passwordResetQuestions/foouser').respond(response);
      user.fetchPasswordResetQuestions('foouser').then(success, error);
      httpBackend.flush();
      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith(messages.list()[0]);
    });

  });

  describe('resetPassword method', function () {

    var response;

    beforeEach(function () {
      response = {
        Success: true,
        Message: null,
        Data: null
      };
    });

    it('should post to the expected endpoint with the expected data', function () {
      var requestData = null,
        answers = [
          {
            QuestionId: 0,
            Answer: 'to seek the holy grail'
          },
          {
            QuestionId: 1,
            Answer: 'blue'
          }
        ];
      httpBackend.expectPOST('/userAccount/resetpassword').respond(function (method, url, data) {
        requestData = angular.fromJson(data);
        return [200, response, {}];
      });
      user.resetPassword('foouser', answers);
      expect(httpBackend.flush).not.toThrow();
      expect(requestData.UserName).toBe('foouser');
      expect(angular.equals(requestData.List, answers)).toBe(true);
    });

    it('should return a promise for the success/failure result', function () {
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      httpBackend.whenPOST('/userAccount/resetpassword').respond(response);
      user.resetPassword('foouser').then(success, error);
      httpBackend.flush();
      expect(success).toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    });

  });

  describe('Authenticate + isLoggedIn method', function () {

    beforeEach(function () {
      httpBackend.whenPOST('/UserAccount/Authenticate').respond({
        Success: true,
        Message: null,
        Data: {
          Token: '12345',
          ShowUserInitialization: true
        }
      });

      httpBackend.whenGET('/Dealer/Info').respond({
        Success: true,
        Data: {}
      });

      httpBackend.whenGET('/Dealer/Static').respond({
        Success: true,
        Data: {}
      });
    });

    it('should make the expected POST request', function () {
      httpBackend.expectPOST('/UserAccount/Authenticate');
      user.authenticate('test', 'testpw');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should set the api auth token with the value from the response', function () {
      spyOn(api, 'setAuthToken');
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(api.setAuthToken).toHaveBeenCalledWith('12345');
    });

    it('should update the isLoggedIn function result', function () {
      expect(user.isLoggedIn()).toBe(false);
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.isLoggedIn()).toBe(true);
    });

    it('should set the auth header for all further requests', inject(function ($http) {
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      httpBackend.expectGET('foo/bar', function (headers) {
        return headers.Authorization === 'CT 12345';
      }).respond({});
      $http.get('foo/bar');
      expect(httpBackend.flush).not.toThrow();
    }));

    it('should refresh statics and info upon auth success', function () {
      spyOn(user, 'refreshInfo').andReturn($q.when({}));
      spyOn(user, 'refreshStatics').andReturn($q.when({}));
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.refreshInfo).toHaveBeenCalled();
      expect(user.refreshStatics).toHaveBeenCalled();
    });

    it('should return a promise for authentication metadata including ShowUserInitialization', function () {
      var out = null;

      user.authenticate('test', 'testpw').then(function (result) {
        out = result;
      });

      httpBackend.flush();

      expect(out).toBeDefined();
      expect(out.showUserInit).toBe(true);
    });

  });

  describe('refreshStatics + getStatics methods', function () {

    var resultData;

    beforeEach(function () {
      resultData = {};
      httpBackend.whenGET('/Dealer/Static').respond({
        Success: true,
        Data: resultData
      });
    });

    it('should be null if not loaded', function () {
      expect(user.getStatics()).toBe(null);
    });

    it('should call the expected endpoint', function () {
      httpBackend.expectGET('/Dealer/Static');
      user.refreshStatics();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for an object with the expected properties (defaulted if missing)', function () {
      user.refreshStatics().then(function (result) {
        expect(result).toBeDefined();
        expect(angular.isArray(result.productTypes)).toBe(true);
        expect(angular.isArray(result.colors)).toBe(true);
        expect(angular.isArray(result.states)).toBe(true);
        expect(angular.isArray(result.locations)).toBe(true);
        expect(angular.isArray(result.bankAccounts)).toBe(true);
        expect(angular.isArray(result.linesOfCredit)).toBe(true);
        expect(angular.isArray(result.titleLocationOptions)).toBe(true);
        expect(angular.isArray(result.paymentMethods)).toBe(true);
      });
      httpBackend.flush();
    });

    it('result should also be cached and available by get method', function () {
      user.refreshStatics().then(function (result) {
        expect(user.getStatics()).toBe(result);
      });
      httpBackend.flush();
    });

    it('should map properties from the API when present', function () {
      angular.extend(resultData,  {
        ProductType: [],
        Colors: [],
        States: [],
        Locations: [],
        BankAccounts: [],
        LinesOfCredit: [],
        TitleLocationOptions: [],
        PaymentMethods: []
      });

      user.refreshStatics();
      httpBackend.flush();
      var statics = user.getStatics();

      expect(statics.productTypes).toBe(resultData.ProductType);
      expect(statics.colors).toBe(resultData.Colors);
      expect(statics.states).toBe(resultData.States);
      expect(statics.locations).toBe(resultData.Locations);
      expect(statics.bankAccounts).toBe(resultData.BankAccounts);
      expect(statics.linesOfCredit).toBe(resultData.LinesOfCredit);
      expect(statics.titleLocationOptions).toBe(resultData.TitleLocationOptions);
      expect(statics.paymentMethods).toBe(resultData.PaymentMethods);
    });

  });

  describe('refreshInfo + getInfo methods', function () {

    var resultData;

    beforeEach(function () {
      resultData = {};
      httpBackend.whenGET('/Dealer/Info').respond({
        Success: true,
        Data: resultData
      });
    });

    it('should be null if not loaded', function () {
      expect(user.getInfo()).toBe(null);
    });

    it('should call the expected endpoint', function () {
      httpBackend.expectGET('/Dealer/Info');
      user.refreshInfo();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for the result data', function () {
      user.refreshInfo().then(function (result) {
        expect(result).toBe(resultData);
      });
      httpBackend.flush();
    });

    it('result should also be cached and available by get method', function () {
      user.refreshInfo().then(function (result) {
        expect(user.getInfo()).toBe(result);
      });
      httpBackend.flush();
    });

  });

  describe('isDealer method', function () {

    it('should return null if dealer info is not yet loaded', function () {
      expect(user.isDealer()).toBe(null);
    });

    it('should return true if dealer info DealerAuctionStatusForGA flag is Dealer', function () {
      httpBackend.whenGET('/Dealer/Info').respond({
        Success: true,
        Data: {
          DealerAuctionStatusForGA: 'Dealer'
        }
      });
      user.refreshInfo();
      httpBackend.flush();
      expect(user.isDealer()).toBe(true);
    });

    it('should return false if dealer info DealerAuctionStatusForGA flag is anything else', function () {
      httpBackend.whenGET('/Dealer/Info').respond({
        Success: true,
        Data: {
          DealerAuctionStatusForGA: 'foo'
        }
      });
      user.refreshInfo();
      httpBackend.flush();
      expect(user.isDealer()).toBe(false);
    });

  });

  describe('canPayBuyer method', function () {

    var userInfo = {};

    beforeEach(function () {
      httpBackend.whenPOST('/UserAccount/Authenticate').respond({
        Success: true,
        Message: null,
        Data: {
          Token: '12345',
          ShowUserInitialization: true
        }
      });

      httpBackend.whenGET('/Dealer/Info').respond({
        Success: true,
        Data: userInfo
      });

      httpBackend.whenGET('/Dealer/Static').respond({
        Success: true,
        Data: {}
      });
    });

    it('should return undefined if user info is not loaded', function () {
      expect(user.canPayBuyer()).not.toBeDefined();
    });

    it('should return true if IsBuyerDirectlyPayable and HasUCC are both true in user info', function () {
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.canPayBuyer()).toBe(true);
    });

    it('should return false if IsBuyerDirectlyPayable or HasUCC are false in user info', function () {
      userInfo.IsBuyerDirectlyPayable = false;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.canPayBuyer()).toBe(false);

      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = false;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.canPayBuyer()).toBe(false);
    });

  });

  describe('getPaySellerOptions method', function () {

    var userInfo = {};

    beforeEach(function () {
      httpBackend.whenPOST('/UserAccount/Authenticate').respond({
        Success: true,
        Message: null,
        Data: {
          Token: '12345',
          ShowUserInitialization: true
        }
      });

      httpBackend.whenGET('/Dealer/Info').respond({
        Success: true,
        Data: userInfo
      });

      httpBackend.whenGET('/Dealer/Static').respond({
        Success: true,
        Data: {}
      });
    });

    it('should return null if user info is not loaded', function () {
      expect(user.getPaySellerOptions()).toBe(null);
    });

    it('should return both options, false (pay buyer) first, if pay buyer is allowed', function () {
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(angular.equals(user.getPaySellerOptions(), [false, true])).toBe(true);
    });

    it('should return only true (force pay seller) if pay buyer is not allowed', function () {
      userInfo.IsBuyerDirectlyPayable = false;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(angular.equals(user.getPaySellerOptions(), [true])).toBe(true);
    });

    it('should return the same array instance on every call to avoid infinite $watch loops', function () {
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      var res1, res2;
      res1 = user.getPaySellerOptions();
      res2 = user.getPaySellerOptions();
      expect(res1 === res2).toBe(true);
    });

  });

});
