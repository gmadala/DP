'use strict';

describe('Filter: ifMissing', function () {

  // load the filter's module
  beforeEach(module('nextgearWebApp'));

  // initialize a new instance of the filter before each test
  var ifMissing;
  beforeEach(inject(function ($filter) {
    ifMissing = $filter('ifMissing');
  }));

  it('should return the input if the input is defined, not null, and not an empty string"', function () {
    expect(ifMissing('foo')).toBe('foo');
    expect(ifMissing(10)).toBe(10);
    expect(ifMissing(0)).toBe(0);
    expect(ifMissing(false)).toBe(false);
    expect(ifMissing(true)).toBe(true);

    var obj = {foo: 'bar'};
    expect(ifMissing(obj)).toBe(obj);
  });

  it('should return the alternate if the input is undefined, null, or an empty string"', function () {
    expect(ifMissing(undefined)).toBe('?');
    expect(ifMissing(null)).toBe('?');
    expect(ifMissing('')).toBe('?');
  });

  it('should allow a custom alternate"', function () {
    expect(ifMissing(undefined, 'X')).toBe('X');
  });

});
