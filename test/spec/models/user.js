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

    it('should post to the expected endpoint with username + trimmed question objects', function () {
      var requestData = null,
        answers = [
          {
            QuestionId: 0,
            QuestionText: 'What is your quest?',
            Answer: 'grail'
          },
          {
            QuestionId: 1,
            QuestionText: 'What is your favorite color?',
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
      expect(requestData.List.length).toBe(2);
      expect(angular.equals(requestData.List[0], {
        QuestionId: 0,
        QuestionText: 'grail'
      })).toBe(true);
      expect(angular.equals(requestData.List[1], {
        QuestionId: 1,
        QuestionText: 'blue'
      })).toBe(true);
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

  describe('Authenticate + isLoggedIn + logout method', function () {

    var segmentio,
      logoutHttpHandler;

    beforeEach(inject(function (_segmentio_) {
      segmentio = _segmentio_;

      httpBackend.whenPOST('/UserAccount/Authenticate').respond({
        Success: true,
        Message: null,
        Data: {
          Token: '12345',
          ShowUserInitialization: true,
          UserVoiceToken: '54321'
        }
      });

      httpBackend.whenGET('/Dealer/Info').respond({
        Success: true,
        Data: {
          BusinessNumber: 1234,
          BusinessName: 'Tricolor Auto'
        }
      });

      httpBackend.whenGET('/Dealer/Static').respond({
        Success: true,
        Data: {}
      });

      logoutHttpHandler = httpBackend.whenGET('/userAccount/logout');
      logoutHttpHandler.respond({
        Success: true,
        Data: {}
      });
    }));

    it('should make the expected POST request', function () {
      httpBackend.expectPOST('/UserAccount/Authenticate');
      user.authenticate('test', 'testpw');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should set the api auth token with the value from the response', function () {
      spyOn(api, 'setAuthToken');
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(api.setAuthToken).toHaveBeenCalledWith('12345', '54321');
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
      spyOn(user, 'refreshInfo').andCallThrough();
      spyOn(user, 'refreshStatics').andCallThrough();
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.refreshInfo).toHaveBeenCalled();
      expect(user.refreshStatics).toHaveBeenCalled();
    });

    it('should identify the user for analytics upon success', function () {
      spyOn(segmentio, 'identify');
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(segmentio.identify).toHaveBeenCalled();
      expect(segmentio.identify.mostRecentCall.args[0]).toBe(1234);
      expect(segmentio.identify.mostRecentCall.args[1]).toEqual({
        name: 'Tricolor Auto',
        username: 'test'
      });
      expect(segmentio.identify.mostRecentCall.args[1].name).toBe('Tricolor Auto');
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

    it('should make the expected logout request to the server on logout', function () {
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      httpBackend.expectGET('/userAccount/logout');
      user.logout();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should reset the auth token and isLoggedIn flag on logout call success', function() {
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      var success = jasmine.createSpy('success');
      var failure = jasmine.createSpy('failure');
      user.logout().then(success, failure);
      expect(user.isLoggedIn()).toBe(true);
      httpBackend.flush();
      expect(user.isLoggedIn()).toBe(false);
      expect(api.hasAuthToken()).toBe(false);
      expect(success).toHaveBeenCalled();
      expect(success.mostRecentCall.args[0]).toEqual({});
      expect(failure).not.toHaveBeenCalled();
    });

    it('should reset the auth token and isLoggedIn flag on logout call error', function() {
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      logoutHttpHandler.respond({
        Success: false,
        Message: 'already logged out',
        Data: null
      });
      var success = jasmine.createSpy('success');
      var failure = jasmine.createSpy('failure');
      user.logout().then(success, failure);
      httpBackend.flush();
      expect(user.isLoggedIn()).toBe(false);
      expect(api.hasAuthToken()).toBe(false);
      expect(success).toHaveBeenCalled();
      expect(success.mostRecentCall.args[0]).toEqual(null);
      expect(failure).not.toHaveBeenCalled();
    });

  });

  describe('dropSession method', function () {
    it('should reset the auth token immediately', function () {
      api.setAuthToken('foo');

      user.dropSession();
      expect(user.isLoggedIn()).toBe(false);
      expect(api.hasAuthToken()).toBe(false);
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

    it('should return true if user is dealer and IsBuyerDirectlyPayable and HasUCC are both true', function () {
      userInfo.DealerAuctionStatusForGA = 'Dealer';
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.canPayBuyer()).toBe(true);
    });

    it('should return false if IsBuyerDirectlyPayable or HasUCC are false in user info', function () {
      userInfo.DealerAuctionStatusForGA = 'Dealer';
      userInfo.IsBuyerDirectlyPayable = false;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.canPayBuyer()).toBe(false);

      userInfo.DealerAuctionStatusForGA = 'Dealer';
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = false;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.canPayBuyer()).toBe(false);
    });

    it('should return false if user is an auction rather than a dealer', function () {
      userInfo.DealerAuctionStatusForGA = 'Auction';
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
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
      userInfo.DealerAuctionStatusForGA = 'Dealer';
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(angular.equals(user.getPaySellerOptions(), [false, true])).toBe(true);
    });

    it('should return only true (force pay seller) if pay buyer is not allowed', function () {
      userInfo.DealerAuctionStatusForGA = 'Dealer';
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
