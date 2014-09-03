'use strict';

describe('Filter: address', function () {

  // load the filter's module
  beforeEach(module('nextgearWebApp'));

  // initialize a new instance of the filter before each test
  var address;
  beforeEach(inject(function ($filter) {
    address = $filter('address');
  }));

  describe('default template', function() {
    it('should format a date with a Line 2 address', function () {
      var data = {
        Line1: '123 Main St',
        Line2: 'Suite 3',
        City: 'Rochester',
        State: 'NY',
        Zip: '14623'
      };
      expect(address(data)).toBe('123 Main St Suite 3 / Rochester NY 14623');
    });

    it('should format a date without a Line 2 address', function () {
      var data = {
        Line1: '123 Main St',
        City: 'Rochester',
        State: 'NY',
        Zip: '14623'
      };
      expect(address(data)).toBe('123 Main St / Rochester NY 14623');
    });
  });
});
