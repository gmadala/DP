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

  describe('Authenticate method', function () {

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

    it('should update the initializationRequired function result', function () {
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.initializationRequired()).toBe(true);
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
