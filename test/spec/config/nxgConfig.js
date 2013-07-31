'use strict';

describe('Service: nxgConfig', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var nxgConfig;
  beforeEach(inject(function (_nxgConfig_) {
    nxgConfig = _nxgConfig_;
  }));

  it('should have an apiBase', function () {
    expect(nxgConfig.apiBase).toBeDefined();
  });

});
