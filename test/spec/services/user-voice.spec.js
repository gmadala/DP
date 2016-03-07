'use strict';

describe('Service: UserVoice', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  // instantiate service
  var UserVoice;
  beforeEach(inject(function (_UserVoice_) {
    UserVoice = _UserVoice_;
  }));

  it('should have an init function', function () {
    expect(angular.isFunction(UserVoice.init)).toBe(true);
  });

  it('should have a getAPI function that returns the global UserVoice object', function () {
    expect(angular.isFunction(UserVoice.getAPI())).toBe(false);
    var api = UserVoice.getAPI();
    expect(api).toBe(window.UserVoice);
  });

});
