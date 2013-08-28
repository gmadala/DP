'use strict';

describe('Service: Blackbook', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var Blackbook;
  beforeEach(inject(function (_Blackbook_) {
    Blackbook = _Blackbook_;
  }));

  it('should do something', function () {
    expect(!!Blackbook).toBe(true);
  });

});
