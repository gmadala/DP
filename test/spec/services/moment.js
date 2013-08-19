'use strict';

describe('Service: moment', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var moment;
  beforeEach(inject(function (_moment_) {
    moment = _moment_;
  }));

  it('should provide the moment.js global function', function () {
    expect(typeof moment).toBe('function');
    expect(typeof moment.utc).toBe('function');
  });

});
