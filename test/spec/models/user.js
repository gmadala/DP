
'use strict';

describe('Model: User', function () {

  beforeEach(module('nextgearWebApp'));

  var user, httpBackend, api, $q, $rootScope;

  beforeEach(inject(function ($httpBackend, _$q_, User, _api_, _$rootScope_) {
    user = User;
    api = _api_;
    httpBackend = $httpBackend;
    $q = _$q_;
    $rootScope = _$rootScope_;
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
      httpBackend.expectPOST('/userAccount/RecoverUserName/foo@example.com/false').respond(response);
      user.recoverUserName('foo@example.com');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for the success/failure result', function () {
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      httpBackend.whenPOST('/userAccount/RecoverUserName/foo@example.com/false').respond(response);
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
      httpBackend.expectGET('/UserAccount/passwordResetQuestions/foouser?lang=1').respond(response);
      user.fetchPasswordResetQuestions('foouser');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for the question list', function () {
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      httpBackend.whenGET('/UserAccount/passwordResetQuestions/foouser?lang=1').respond(response);
      user.fetchPasswordResetQuestions('foouser').then(success, error);
      httpBackend.flush();
      expect(success).toHaveBeenCalledWith(response.Data.List);
      expect(error).not.toHaveBeenCalled();
    });

    it('should reject the promise with a message object if the returned question list is empty', function () {
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      response.Data.List = [];
      httpBackend.whenGET('/UserAccount/passwordResetQuestions/foouser?lang=1').respond(response);
      user.fetchPasswordResetQuestions('foouser').then(success, error);
      httpBackend.flush();
      expect(success).not.toHaveBeenCalled();
      expect(error).toHaveBeenCalledWith(messages.list()[0]);
    });
  });

  describe('initSession', function() {
    it('should call appropriate methods', function() {
      spyOn(api, 'setAuth');
      spyOn(user, 'refreshInfo').andReturn('a');
      spyOn(user, 'refreshStatics').andReturn('b');
      spyOn($q, 'all').andReturn($q.when(true));
      var auth = {};
      user.initSession(auth);
      expect(api.setAuth).toHaveBeenCalled();
      expect(api.setAuth.calls[0].args[0]).toBe(auth);
      expect(user.refreshInfo).toHaveBeenCalled();
      expect(user.refreshStatics).toHaveBeenCalled();
      expect($q.all).toHaveBeenCalledWith(['a', 'b']);
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
      httpBackend.expectPOST('/userAccount/v1_2/resetpassword').respond(function (method, url, data) {
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
      expect(requestData.IsMobileApp).toBe(false);
    });

    it('should return a promise for the success/failure result', function () {
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      httpBackend.whenPOST('/userAccount/v1_2/resetpassword').respond(response);
      user.resetPassword('foouser').then(success, error);
      httpBackend.flush();
      expect(success).toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    });
  });

  describe('Authenticate + isLoggedIn + logout method', function () {
    var segmentio,
      logoutHttpHandler,
      infoHttpHandler,
      infoUnitedStates,
      infoCanada;

    beforeEach(inject(function (_segmentio_) {
      segmentio = _segmentio_;

      infoUnitedStates = {
        Success: true,
        Data: {
          BusinessNumber: 1234,
          BusinessName: 'Tricolor Auto',
          CountryId:'29ec136a-1416-46ed-93cd-254d0fb0b820'
        }
      };

      infoCanada = {
        Success: true,
        Data: {
          BusinessNumber: 1234,
          BusinessName: 'Tricolor Auto',
          CountryId:'29ec136a-1416-46ed-93cd-254d0fb0b821'
        }
      };

      httpBackend.whenPOST('/UserAccount/Authenticate').respond({
        Success: true,
        Message: null,
        Data: {
          Token: '12345',
          ShowUserInitialization: true,
          UserVoiceToken: '54321'
        }
      });

      infoHttpHandler = httpBackend.whenGET('/Dealer/v1_2/Info');

      httpBackend.whenGET('/Dealer/v1_2/Static').respond({
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
      infoHttpHandler.respond(infoUnitedStates);
      httpBackend.expectPOST('/UserAccount/Authenticate');
      user.authenticate('test', 'testpw');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should set the api auth token with the value from the response', function () {
      infoHttpHandler.respond(infoUnitedStates);
      spyOn(api, 'setAuth');
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(api.setAuth).toHaveBeenCalled();
      expect(api.setAuth.mostRecentCall.args[0]).toEqual({
        Token: '12345',
        ShowUserInitialization: true,
        UserVoiceToken: '54321'
      });
    });

    it('should update the isLoggedIn function result', function () {
      infoHttpHandler.respond(infoUnitedStates);
      expect(user.isLoggedIn()).toBe(false);
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.isLoggedIn()).toBe(true);
    });

    it('should set the auth header for all further requests', inject(function ($http) {
      infoHttpHandler.respond(infoUnitedStates);
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      httpBackend.expectGET('foo/bar', function (headers) {
        return headers.Authorization === 'CT 12345';
      }).respond({});
      $http.get('foo/bar');
      expect(httpBackend.flush).not.toThrow();
    }));

    it('should refresh statics and info upon auth success', function () {
      infoHttpHandler.respond(infoUnitedStates);
      spyOn(user, 'refreshInfo').andCallThrough();
      spyOn(user, 'refreshStatics').andCallThrough();
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.refreshInfo).toHaveBeenCalled();
      expect(user.refreshStatics).toHaveBeenCalled();
    });

    it('should identify the user for analytics upon success', function () {
      infoHttpHandler.respond(infoUnitedStates);
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

    it('should return a promise for authentication result data', function () {
      var out = null;

      infoHttpHandler.respond(infoUnitedStates);
      user.authenticate('test', 'testpw').then(function (result) {
        out = result;
      });

      httpBackend.flush();

      expect(out).toEqual({
        Token: '12345',
        ShowUserInitialization: true,
        UserVoiceToken: '54321'
      });
    });

    it('should make the expected logout request to the server on logout', function () {
      infoHttpHandler.respond(infoUnitedStates);
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      httpBackend.expectGET('/userAccount/logout');
      user.logout();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should reset the auth token and isLoggedIn flag on logout call success', function() {
      infoHttpHandler.respond(infoUnitedStates);
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
      infoHttpHandler.respond(infoUnitedStates);
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

    it('should check for the user - UnitedStates', function () {
      infoHttpHandler.respond(infoUnitedStates);
      httpBackend.whenPOST('/UserAccount/Authenticate').respond(function () {
        return [200, {Success: true, Message: null, Data: {Token: 'key'}}, ''];
      });
      user.authenticate('user', 'pass');
      httpBackend.flush();
      expect(user.isUnitedStates()).toBeTruthy();
    });

    it('should check for the user - Canadian', function () {
      infoHttpHandler.respond(infoCanada);
      httpBackend.whenPOST('/UserAccount/Authenticate').respond(function () {
        return [200, {Success: true, Message: null, Data: {Token: 'key'}}, ''];
      });
      user.authenticate('user', 'pass');
      httpBackend.flush();
      expect(user.isUnitedStates()).toBeFalsy();
    });

  });

  describe('dropSession method', function () {
    it('should reset the auth token immediately', function () {
      api.setAuth({ Token: 'foo' });

      user.dropSession();
      expect(user.isLoggedIn()).toBe(false);
      expect(api.hasAuthToken()).toBe(false);
    });
  });

  describe('refreshStatics + getStatics methods', function () {
    var resultData;

    beforeEach(function () {
      resultData = {};
      httpBackend.whenGET('/Dealer/v1_2/Static').respond({
        Success: true,
        Data: resultData
      });
    });

    it('should call the expected endpoint', function () {
      httpBackend.expectGET('/Dealer/v1_2/Static');
      var result;

      user.refreshStatics().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for an object with the expected properties (defaulted if missing)', function () {
      var result;

      user.refreshStatics().then(function (_result_) {
        result = _result_;
      });
      httpBackend.flush();
      $rootScope.$digest();
      expect(result).toBeDefined();
      expect(angular.isArray(result.productTypes)).toBe(true);
      expect(angular.isArray(result.colors)).toBe(true);
      expect(angular.isArray(result.states)).toBe(true);
      expect(angular.isArray(result.titleLocationOptions)).toBe(true);
      expect(angular.isArray(result.paymentMethods)).toBe(true);
    });

    it('should map properties from the API when present', function () {
      angular.extend(resultData,  {
        ProductType: [],
        Colors: [],
        States: [],
        TitleLocationOptions: [],
        PaymentMethods: []
      });

      var result;
      user.refreshStatics().then(function(_result_) {
        result = _result_;
      });
      httpBackend.flush();
      $rootScope.$digest();

      expect(result.productTypes).toBe(resultData.ProductType);
      expect(result.colors).toBe(resultData.Colors);
      expect(result.states).toBe(resultData.States);
      expect(result.titleLocationOptions).toBe(resultData.TitleLocationOptions);
      expect(result.paymentMethods).toBe(resultData.PaymentMethods);
    });
  });

  describe('refreshInfo + getInfo + infoPromise methods', function () {
    var resultData;

    beforeEach(function () {
      resultData = {};
      httpBackend.whenGET('/Dealer/v1_2/Info').respond({
        Success: true,
        Data: resultData
      });
    });

    it('should call the expected endpoint', function () {
      httpBackend.expectGET('/Dealer/v1_2/Info');
      var result;

      user.refreshInfo().then(function(_result_) {
        result = _result_;
      });

      $rootScope.$digest();
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise for an object', function () {
      var result;

      user.refreshInfo().then(function (_result_) {
        result = _result_;
      });
      httpBackend.flush();
      $rootScope.$digest();
      expect(result).toBe(resultData);
    });
  });

  describe('isDealer method', function () {

    it('should return null if dealer info is not yet loaded', function () {
      expect(user.isDealer()).toBe(null);
    });

    it('should return true if dealer info DealerAuctionStatusForGA flag is Dealer', function () {
      httpBackend.whenGET('/Dealer/v1_2/Info').respond({
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
      httpBackend.whenGET('/Dealer/v1_2/Info').respond({
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

  describe('isUserInitRequired + clearUserInitRequired methods', function () {

    var $cookieStore;
    beforeEach(inject(function (_$cookieStore_) {
      $cookieStore = _$cookieStore_;
    }));

    it('should return false normally', function () {
      expect(user.isUserInitRequired()).toBe(false);
    });

    it('should return true when flag is present in auth cookie', function () {
      $cookieStore.put('auth', { ShowUserInitialization: true });
      expect(user.isUserInitRequired()).toBe(true);
    });

    it('should return false once clear is called', function () {
      $cookieStore.put('auth', { ShowUserInitialization: true });
      user.clearUserInitRequired();
      expect(user.isUserInitRequired()).toBe(false);
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

      httpBackend.whenGET('/Dealer/v1_2/Info').respond({
        Success: true,
        Data: userInfo
      });

      httpBackend.whenGET('/Dealer/v1_2/Static').respond({
        Success: true,
        Data: {}
      });
    });

    it('should call user.getInfo', function() {
      spyOn(user, 'getInfo').andReturn($q.when({}));
      var result;

      user.canPayBuyer().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(user.getInfo).toHaveBeenCalled();
      expect(result).toBe(false); // since the properties to check are all undefined

    });

    // it('should return undefined if user info is not loaded', function () {
    //   expect(user.canPayBuyer()).not.toBeDefined();
    // });

    it('should return true if user is dealer and IsBuyerDirectlyPayable and HasUCC are both true', function () {
      userInfo.DealerAuctionStatusForGA = 'Dealer';
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      var result;
      user.canPayBuyer().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe(true);
    });

    it('should return false if IsBuyerDirectlyPayable or HasUCC are false in user info', function () {
      userInfo.DealerAuctionStatusForGA = 'Dealer';
      userInfo.IsBuyerDirectlyPayable = false;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      var result;
      user.canPayBuyer().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe(false);

      userInfo.DealerAuctionStatusForGA = 'Dealer';
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = false;
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      user.canPayBuyer().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe(false);
    });

    it('should return false if user is an auction rather than a dealer', function () {
      userInfo.DealerAuctionStatusForGA = 'Auction';
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      var result;
      user.canPayBuyer().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(result).toBe(false);
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

      httpBackend.whenGET('/Dealer/v1_2/Info').respond({
        Success: true,
        Data: userInfo
      });

      httpBackend.whenGET('/Dealer/v1_2/Static').respond({
        Success: true,
        Data: {}
      });
    });

    it('should return both options, false (pay buyer) first, if pay buyer is allowed', function () {
      userInfo.DealerAuctionStatusForGA = 'Dealer';
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      var result;
      user.getPaySellerOptions().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(angular.equals(result, [false, true])).toBe(true);
    });

    it('should return only true (force pay seller) if pay buyer is not allowed', function () {
      userInfo.DealerAuctionStatusForGA = 'Dealer';
      userInfo.IsBuyerDirectlyPayable = false;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      var result;
      user.getPaySellerOptions().then(function(_result_) {
        result = _result_;
      });
      $rootScope.$digest();
      expect(angular.equals(result, [true])).toBe(true);
    });

    it('should return the same array instance on every call to avoid infinite $watch loops', function () {
      userInfo.IsBuyerDirectlyPayable = true;
      userInfo.HasUCC = true;
      user.authenticate('test', 'testpw');
      httpBackend.flush();

      var res1, res2;
      user.getPaySellerOptions().then(function(_result_) {
        res1 = _result_;
      });
      user.getPaySellerOptions().then(function(_result_) {
        res2 = _result_;
      });
      $rootScope.$digest();
      expect(res1 === res2).toBe(true);
    });
  });
});
