'use strict';

describe('Service: api', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var api, http, rootScope, cookies;
  beforeEach(inject(function (_api_, $http, $rootScope, $cookieStore) {
    api = _api_;
    http = $http;
    rootScope = $rootScope;
    cookies = $cookieStore;
  }));

  describe('setAuth and hasAuthToken functions', function () {
    it('should set the correct http default Authorization header', function () {
      api.setAuth({ Token: 'foo' });
      expect(http.defaults.headers.common.Authorization).toBe('CT foo');
    });

    it('should store the auth data in a cookie', function () {
      api.setAuth({ Token: 'foo', UserVoiceToken: 'bar' });
      expect(cookies.get('auth')).toEqual({
        Token: 'foo',
        UserVoiceToken: 'bar'
      });
    });

    it('should cause hasAuthToken to return true if a token was provided', function () {
      api.setAuth({ Token: 'foo' });
      expect(api.hasAuthToken()).toBe(true);
    });

    it('should cause hasAuthToken to return false if no token was provided', function () {
      api.setAuth({});
      expect(api.hasAuthToken()).toBe(false);

      api.setAuth({ Token: null });
      expect(api.hasAuthToken()).toBe(false);
    });
  });

  describe('resetAuth function', function () {
    it('should cause hasAuthToken to return false', function() {
      api.setAuth({ Token: 'foo' });
      api.resetAuth();
      expect(api.hasAuthToken()).toBe(false);
    });

    it('should remove the cookie containing the auth data', function() {
      api.setAuth({ Token: 'foo' });
      api.resetAuth();
      expect(cookies.get('auth')).not.toBeDefined();
    });

    it('should remove the HTTP authorization header', function() {
      api.setAuth({ Token: 'foo' });
      api.resetAuth();
      expect(http.defaults.headers.common.Authorization).not.toBeDefined();
    });
  });

  describe('getAuthParam function', function () {

    it('should return undefined when no auth cookie is present', function () {
      cookies.remove('auth');
      expect(api.getAuthParam('foo')).not.toBeDefined();
    });

    it('should return undefined when no property of that name is present on auth cookie', function () {
      cookies.put('auth', { foo: 'bar' });
      expect(api.getAuthParam('bar')).not.toBeDefined();
    });

    it('should return the value when present on auth cookie', function () {
      cookies.put('auth', { foo: 'bar' });
      expect(api.getAuthParam('foo')).toBe('bar');
    });

  });

  describe('setAuthParam function', function () {

    it('should do nothing when no auth cookie is present', function () {
      cookies.remove('auth');
      api.setAuthParam('foo', 'bar');
      expect(cookies.get('auth')).not.toBeDefined();
    });

    it('should set the property when auth cookie is present', function () {
      cookies.put('auth', { foo: 'bar' });
      api.setAuthParam('foo', 'bar2');
      expect(cookies.get('auth').foo).toBe('bar2');
    });

  });

  describe('request function', function () {

    var httpBackend,
      successResponse,
      config,
      messages;

    beforeEach(inject(function ($httpBackend, nxgConfig, _messages_) {
      config = nxgConfig;
      messages = _messages_;
      httpBackend = $httpBackend;
      successResponse = {
        Success: true,
        Data: {}
      };
    }));

    it('should make a call with the specified method', function () {
      httpBackend.expectGET(/.*/).respond(successResponse);
      api.request('GET', '/foo');
      expect(httpBackend.flush).not.toThrow();

      httpBackend.expectPOST(/.*/).respond(successResponse);
      api.request('POST', '/foo');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should make a call to the specified path, with api base config prepended', function () {
      config.apiBase = 'http://api.example.com/v1';

      httpBackend.expectGET('http://api.example.com/v1/foo/bar').respond(successResponse);
      api.request('GET', '/foo/bar');
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the specified data as query string parameters for GET method', function () {
      httpBackend.expectGET('/foo?bar=baz').respond(successResponse);
      api.request('GET', '/foo', { bar: 'baz' });
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the specified data as JSON in the body for POST method', function () {
      httpBackend.expectPOST('/foo').respond(function (method, url, data) {
        expect(data).toBe('{"bar":"baz"}');
        return [200, successResponse, {}];
      });
      api.request('POST', '/foo', { bar: 'baz' });
      expect(httpBackend.flush).not.toThrow();
    });

    it('should send the specified headers', function () {
      httpBackend.expectGET('/foo').respond(function (method, url, data, headers) {
        expect(headers.foo).toBe('bar');
        return [200, successResponse, {}];
      });
      api.request('GET', '/foo', null, { foo: 'bar' });
      expect(httpBackend.flush).not.toThrow();
    });

    it('should return a promise', function () {
      httpBackend.whenGET('/foo').respond(successResponse);
      var result = api.request('GET', '/foo');
      expect(typeof result.then).toBe('function');
    });

    it('should reject the promise with a newly added message service object upon HTTP error', function () {
      httpBackend.whenGET('/foo').respond(404, 'wrong URL');
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      api.request('GET', '/foo').then(success, error);
      httpBackend.flush();
      expect(messages.list().length).toBe(1);
      expect(error).toHaveBeenCalledWith(messages.list()[0]);
      expect(success).not.toHaveBeenCalled();
    });

    it('should reject the promise on 401 with a message that emits a forceLogout event when dismissed', function () {
      httpBackend.whenGET('/foo').respond({
        Success: false,
        Data: {},
        Message: '401'
      });
      spyOn(rootScope, '$emit').andReturn(true);
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      api.setAuth({ Token: 'foo' });
      expect(api.hasAuthToken()).toBe(true);
      api.request('GET', '/foo').then(success, error);
      httpBackend.flush();
      expect(messages.list().length).toBe(1);
      expect(error).toHaveBeenCalledWith(messages.list()[0]);
      expect(success).not.toHaveBeenCalled();
      messages.list()[0].dismiss();
      expect(rootScope.$emit).toHaveBeenCalledWith('event:forceLogout');
    });

    it('should reject the promise with a newly added message service object upon invalid response', function () {
      httpBackend.whenGET('/foo').respond({foo: 'bar'});
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      api.request('GET', '/foo').then(success, error);
      httpBackend.flush();
      expect(messages.list().length).toBe(1);
      expect(error).toHaveBeenCalledWith(messages.list()[0]);
      expect(success).not.toHaveBeenCalled();
    });

    it('should reject the promise with a msg service object containing API message value upon API error', function () {
      httpBackend.whenGET('/foo').respond({
        Success: false,
        Message: 'Error 321'
      });
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      api.request('GET', '/foo').then(success, error);
      httpBackend.flush();
      expect(messages.list().length).toBe(1);
      expect(error).toHaveBeenCalledWith(messages.list()[0]);
      expect(error.mostRecentCall.args[0].text).toBe('Error 321');
      expect(success).not.toHaveBeenCalled();
    });

    it('should resolve the promise with data value upon success', function () {
      httpBackend.whenGET('/foo').respond('{"Success":true,"Data":{"Prop1":"Value1","Prop2":"Value2"}}');
      var success = jasmine.createSpy('success'),
        error = jasmine.createSpy('error');
      api.request('GET', '/foo').then(success, error);
      httpBackend.flush();
      expect(error).not.toHaveBeenCalled();
      expect(success).toHaveBeenCalled();
      expect(angular.equals(success.mostRecentCall.args[0], {
        Prop1: 'Value1',
        Prop2: 'Value2'
      })).toBe(true);
    });

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
      expect(api.toInt('1,200')).toBe(1200);
      expect(api.toInt('1,200,500')).toBe(1200500);
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
      expect(api.toFloat('1200.15')).toBe(1200.15);
      expect(api.toFloat('1,200.15')).toBe(1200.15);
      expect(api.toFloat('1,200,500')).toBe(1200500);
      expect(api.toFloat('1,200,500.23')).toBe(1200500.23);
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
      api.setAuth({ Token: 'SECRET' });
      var url = api.contentLink('/foo/bar');
      expect(url).toBe('http://example.com/api/foo/bar?AuthToken=SECRET');
    });

    it('should return the expected URL when user is logged in, and any params are provided', function () {
      spyOn(user, 'isLoggedIn').andReturn(true);
      api.setAuth({ Token: 'SECRET' });
      var url = api.contentLink('/foo/bar', {param1: 'value1'});
      expect(url).toBe('http://example.com/api/foo/bar?param1=value1&AuthToken=SECRET');
    });
  });

});
