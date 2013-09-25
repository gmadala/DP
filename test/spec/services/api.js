'use strict';

describe('Service: api', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var api, http;
  beforeEach(inject(function (_api_, $http) {
    api = _api_;
    http = $http;
  }));

  describe('setAuthToken and hasAuthToken functions', function () {
    it('should set the correct http default Authorization header', function () {
      api.setAuthToken('foo');
      expect(http.defaults.headers.common.Authorization).toBe('CT foo');
    });

    it('should cause hasAuthToken to return true if a token was provided', function () {
      api.setAuthToken('foo');
      expect(api.hasAuthToken()).toBe(true);
    });

    it('should cause hasAuthToken to return false if no token was provided', function () {
      api.setAuthToken(null);
      expect(api.hasAuthToken()).toBe(false);

      api.setAuthToken();
      expect(api.hasAuthToken()).toBe(false);
    });
  });

  describe('request function', function () {
    // TODO: Add test coverage for request function
  });

  describe('toBoolean function', function () {
    it('should coerce the string "true" to true', function () {
      expect(api.toBoolean('true')).toBe(true);
    });

    it('should leave existing boolean values unmodified', function () {
      expect(api.toBoolean(true)).toBe(true);
      expect(api.toBoolean(false)).toBe(false);
    });

    it('should make null or undefined into null', function () {
      expect(api.toBoolean(null)).toBe(null);
      expect(api.toBoolean(undefined)).toBe(null);
    });

    it('should coerce anything else to false', function () {
      expect(api.toBoolean('false')).toBe(false);
      expect(api.toBoolean('TRUE')).toBe(false);
      expect(api.toBoolean('')).toBe(false);
      expect(api.toBoolean('YES')).toBe(false);
      expect(api.toBoolean(0)).toBe(false);
      expect(api.toBoolean(400)).toBe(false);
      expect(api.toBoolean({})).toBe(false);
    });
  });

  describe('toInt function', function () {
    it('should coerce strings containing numeric values into integers', function () {
      expect(api.toInt('0')).toBe(0);
      expect(api.toInt('-1')).toBe(-1);
      expect(api.toInt('1')).toBe(1);
      expect(api.toInt('1200')).toBe(1200);
      expect(api.toInt('3.1415')).toBe(3);
      expect(api.toInt('-3.1415')).toBe(-3);
    });

    it('should leave existing integers unmodified', function () {
      expect(api.toInt(0)).toBe(0);
      expect(api.toInt(-1)).toBe(-1);
      expect(api.toInt(1)).toBe(1);
    });

    it('should strip the fractional portion off non-integer numbers', function () {
      expect(api.toInt(0.2345)).toBe(0);
      expect(api.toInt(-1.456)).toBe(-1);
      expect(api.toInt(1.0004)).toBe(1);
    });

    it('should make null or undefined into null', function () {
      expect(api.toInt(null)).toBe(null);
      expect(api.toInt(undefined)).toBe(null);
    });
  });

  describe('toFloat function', function () {
    it('should coerce strings containing numeric values into floats', function () {
      expect(api.toFloat('0')).toBe(0);
      expect(api.toFloat('-1')).toBe(-1);
      expect(api.toFloat('1')).toBe(1);
      expect(api.toFloat('1200')).toBe(1200);
      expect(api.toFloat('3.1415')).toBe(3.1415);
      expect(api.toFloat('-3.1415')).toBe(-3.1415);
    });

    it('should leave existing numeric values unmodified', function () {
      expect(api.toFloat(0)).toBe(0);
      expect(api.toFloat(-1)).toBe(-1);
      expect(api.toFloat(1)).toBe(1);
      expect(api.toFloat(1.63)).toBe(1.63);
    });

    it('should make null, undefined, or non-numeric strings into null', function () {
      expect(api.toFloat(null)).toBe(null);
      expect(api.toFloat(undefined)).toBe(null);
      expect(api.toFloat('abcdef')).toBe(null);
    });
  });

  describe('toShortISODate function', function () {
    it('should format a date object to a short ISO string with no skew from local time', function () {
      expect(api.toShortISODate(new Date(2013, 1, 1))).toBe('2013-02-01');
    });

    it('should make null or undefined into null', function () {
      expect(api.toShortISODate(null)).toBe(null);
      expect(api.toShortISODate(undefined)).toBe(null);
    });

    it('should reject strings (pending implementation of safe, robust string reformatting, if needed)', function () {
      expect(function () {
        api.toShortISODate('05/13/2000');
      }).toThrow();
      expect(function () {
        api.toShortISODate('2013-04-05');
      }).toThrow();
    });
  });

  describe('contentLink function', function () {
    var user,
      originalBase;

    beforeEach(inject(function (User, nxgConfig) {
      user = User;
      nxgConfig.apiBase = 'http://example.com/api';
    }));

    afterEach(inject(function (nxgConfig) {
      nxgConfig.apiBase = originalBase;
    }));

    it('should throw an error if no path is provided', function () {
      expect(api.contentLink).toThrow();
    });

    it('should return the expected URL when user is not logged in, and no params are provided', function () {
      spyOn(user, 'isLoggedIn').andReturn(false);
      var url = api.contentLink('/foo/bar');
      expect(url).toBe('http://example.com/api/foo/bar');
    });

    it('should return the expected URL when user is not logged in, and 1 param is provided', function () {
      spyOn(user, 'isLoggedIn').andReturn(false);
      var url = api.contentLink('/foo/bar', {param1: 'value1'});
      expect(url).toBe('http://example.com/api/foo/bar?param1=value1');
    });

    it('should return the expected URL when user is not logged in, and 2+ params are provided', function () {
      spyOn(user, 'isLoggedIn').andReturn(false);
      var url = api.contentLink('/foo/bar', {param1: 'value1', param2: 'value2'});
      expect(url === 'http://example.com/api/foo/bar?param1=value1&param2=value2' ||
        url === 'http://example.com/api/foo/bar?param2=value2&param1=value1').toBe(true);
    });

    it('should return the expected URL when user is logged in, and no params are provided', function () {
      spyOn(user, 'isLoggedIn').andReturn(true);
      api.setAuthToken('SECRET');
      var url = api.contentLink('/foo/bar');
      expect(url).toBe('http://example.com/api/foo/bar?token=SECRET');
    });

    it('should return the expected URL when user is logged in, and any params are provided', function () {
      spyOn(user, 'isLoggedIn').andReturn(true);
      api.setAuthToken('SECRET');
      var url = api.contentLink('/foo/bar', {param1: 'value1'});
      expect(url).toBe('http://example.com/api/foo/bar?param1=value1&token=SECRET');
    });
  });

});
