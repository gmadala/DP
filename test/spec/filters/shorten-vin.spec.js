'use strict';

describe('Filter: shortenVIN', function () {

  // load the filter's module
  beforeEach(module('nextgearWebApp'));

  // initialize a new instance of the filter before each test
  var shortenVIN;
  beforeEach(inject(function ($filter) {
    shortenVIN = $filter('shortenVIN');
  }));

  it('should shorten to 6 characters', function() {
    expect(shortenVIN('abcdefg')).toBe('...bcdefg');
  });

  it('should do nothing if the input is already 6 characters or less', function() {
    expect(shortenVIN('abcdef')).toBe('abcdef');
  });

  it('should do nothing if the input is not a string', function() {
    var obj = {},
      arr = [];
    expect(shortenVIN(null)).toBe(null);
    expect(shortenVIN(obj)).toBe(obj);
    expect(shortenVIN(arr)).toBe(arr);
  });

});
