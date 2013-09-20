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
});
