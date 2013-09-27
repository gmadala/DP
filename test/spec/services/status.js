'use strict';

describe('Service: status', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var status;
  beforeEach(inject(function (_status_) {
    status = _status_;
  }));

  it('should default to status visible', function () {
    expect(status.isShown()).toBe(true);
  });

  it('should allow status display to be disabled globally', function () {
    status.hide();
    expect(status.isShown()).toBe(false);
  });

  it('should allow status display to be re-enabled globally', function () {
    status.hide();
    status.show();
    expect(status.isShown()).toBe(true);
  });

  it('should gracefully handle duplicate instructions', function () {
    status.hide();
    status.hide();
    expect(status.isShown()).toBe(false);
    status.show();
    expect(status.isShown()).toBe(true);
    status.show();
    expect(status.isShown()).toBe(true);
    status.hide();
    expect(status.isShown()).toBe(false);
  });

});
