'use strict';

describe('Service: api', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var api;
  beforeEach(inject(function (_api_) {
    api = _api_;
  }));

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

  describe('toShortISODate function', function () {
    it('should format a date object to a short ISO string with no time zone skew', function () {
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

});
