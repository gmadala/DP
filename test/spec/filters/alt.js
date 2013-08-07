'use strict';

describe('Filter: alt', function () {

  // load the filter's module
  beforeEach(module('nextgearWebApp'));

  // initialize a new instance of the filter before each test
  var alt;
  beforeEach(inject(function ($filter) {
    alt = $filter('alt');
  }));

  it('should return the input if the input is defined, not null, and not an empty string"', function () {
    expect(alt('foo')).toBe('foo');
    expect(alt(10)).toBe(10);
    expect(alt(0)).toBe(0);
    expect(alt(false)).toBe(false);
    expect(alt(true)).toBe(true);

    var obj = {foo: 'bar'};
    expect(alt(obj)).toBe(obj);
  });

  it('should return the alternate if the input is undefined, null, or an empty string"', function () {
    expect(alt(undefined)).toBe('?');
    expect(alt(null)).toBe('?');
    expect(alt('')).toBe('?');
  });

  it('should allow a custom alternate"', function () {
    expect(alt(undefined, 'X')).toBe('X');
  });

});
