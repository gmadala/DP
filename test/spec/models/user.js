'use strict';

describe('Model: User', function () {

  beforeEach(module('nextgearWebApp'));

  var user, httpBackend;

  beforeEach(inject(function ($httpBackend, User) {
    user = User;
    httpBackend = $httpBackend;
  }));

  describe('Authenticate method', function () {

    beforeEach(function () {
      httpBackend.whenPOST('/UserAccount/Authenticate').respond({
        Success: true,
        Data: 12345
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

    it('should setup the auth token and isLoggedIn function', function () {
      expect(user.isLoggedIn()).toBe(false);
      expect(user.getAuthToken()).toBe(null);
      user.authenticate('test', 'testpw');
      httpBackend.flush();
      expect(user.isLoggedIn()).toBe(true);
      expect(user.getAuthToken()).toBe(12345);
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

    it('should also load statics and info upon success', function () {
      user.authenticate('test', 'testpw');
      httpBackend.expectGET('/Dealer/Info');
      httpBackend.expectGET('/Dealer/Static');
      expect(httpBackend.flush).not.toThrow();
      expect(user.getInfo()).not.toBe(null);
      expect(user.getStatics()).not.toBe(null);
    });

  });

});