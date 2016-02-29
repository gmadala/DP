'use strict';

describe('Filter: list', function () {

  // load the filter's module
  beforeEach(module('nextgearWebApp'));

  // initialize a new instance of the filter before each test
  var list;
  beforeEach(inject(function ($filter) {
    list = $filter('list');
  }));

  it('should return the input if it is not an array' , function () {
    expect(list()).toBe(undefined);
    expect(list(null)).toBe(null);
    expect(list('foo')).toBe('foo');
    expect(list(7)).toBe(7);
  });

  it('should join the array by commas if no separator specified' , function () {
    expect(list(['one', 'two', 'three'])).toBe('one, two, three');
  });

  it('should join the array by the specified separator otherwise' , function () {
    expect(list(['one', 'two', 'three'], '-')).toBe('one-two-three');
  });

});
