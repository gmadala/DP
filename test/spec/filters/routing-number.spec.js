'use strict';

describe('Filter: routing number', function() {

  // Load the filter's module
  beforeEach(module('nextgearWebApp'));

  var routingNumberData,
    notStringData;

  // Inject the filter function before each test
  var routingNumber;
  beforeEach(inject(function($filter) {
    routingNumber = $filter('routingNumber');
    notStringData = 123456789;
    routingNumberData = '012345678'
  }));

  it('should return a string', function() {
    expect(routingNumber(notStringData, true, false)).toBe('123456789');
  });

  it('should return the same number for US users.', function () {
    expect(routingNumber(routingNumberData, true, false)).toBe('012345678');
  });

  it('should return a Canadian users routing number from 012345678 to 45678-123.', function() {
    expect(routingNumber(routingNumberData, false, false)).toBe('45678-123');
  });

  it('should return the US label of routing number.', function() {
    expect(routingNumber('', true, true)).toBe('Routing Number');
  });

  it('should return the Canadian label of routing number.', function () {
    expect(routingNumber('', false, true)).toBe('Transit/Institution Number');
  });
});

