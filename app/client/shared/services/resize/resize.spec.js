'use strict';

describe('Service: resize', function () {

  // load the service's module
  beforeEach(module('nextgearWebApp'));

  var resize, winWidth;
  
  beforeEach(inject(function (_resize_, $window) {
    resize = _resize_;
    winWidth = $window.innerWidth;
  }));

  it('isMobile should be defined', function () {

    expect(resize.isMobile()).toBeDefined();
  });

  describe('Check resize is mobile', function () {
    it('isMobile() method should return "true" if < 768px or "false" if >= 768px', function () {
      if (winWidth >= 768) {
        expect(resize.isMobile()).toBeFalsy();
      } else {
        expect(resize.isMobile()).toBeTruthy();
      }
    });
  });
});
