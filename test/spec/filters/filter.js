'use strict';

describe('Filter: routing number', function() {

  // Load the filter's module
  beforeEach(module('nextgearWebApp'));

  var routingNumberData;

  // Inject the filter function before each test
  var routingNumber;
  beforeEach(inject(function($filter) {
    routingNumber = $filter('routingNumber');
    routingNumberData = 123456789;
  }));

  it('should return a string', function() {
    expect(routingNumber(routingNumberData, true, false)).toBe('123456789');
  });

  it('should return a Canadian users routing number as BBBBB-CCC with the first digit removed.', function() {
    expect(routingNumber(routingNumberData, false, false)).toBe('23456-789');
  });

  it('should return the US label of routing number.', function() {
    expect(routingNumber('', true, true)).toBe('Routing Number');
  });

  it('should return the Canadian label of routing number.', function () {
    expect(routingNumber('', false, true)).toBe('Transit/Institution Number');
  });
});

