'use strict';

describe('Service: Receipts', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var receipts;
  beforeEach(inject(function (_Receipts_) {
    receipts = _Receipts_;
  }));

  it('should do something', function () {
    expect(!!receipts).toBe(true);
  });

});
