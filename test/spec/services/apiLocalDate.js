'use strict';

describe('Service: ApiLocalDate', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var ApiLocalDate;
  beforeEach(inject(function (_ApiLocalDate_) {
    ApiLocalDate = _ApiLocalDate_;
  }));

  it('should convert a number into the same local date & time regardless of time zone', function () {
    // can't actually simulate other timezone settings within JS, but IE test will run this in
    // Pacific time if using ievms default settings
    var date = new ApiLocalDate(1378339199);
    expect(date.getFullYear()).toBe(2013);
    expect(date.getMonth()).toBe(8);
    expect(date.getDate()).toBe(4);
    expect(date.getHours()).toBe(23);
    expect(date.getMinutes()).toBe(59);
    expect(date.getSeconds()).toBe(59);
  });

});
