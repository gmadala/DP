'use strict';

describe('Service: apiBaseUrl', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var apiBaseUrl;
  beforeEach(inject(function (_apiBaseUrl_) {
    apiBaseUrl = _apiBaseUrl_;
  }));

  it('should do something', function () {
    expect(!!apiBaseUrl).toBe(true);
  });

});
