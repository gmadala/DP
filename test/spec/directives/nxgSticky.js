'use strict';

describe('Directive: nxgSticky', function () {
  beforeEach(module('nextgearWebApp'));

  var elem,
      scrollElem,
      scope,
      ctrl,
      win,
      offset;

  beforeEach(inject(function ($controller, $rootScope, $compile, $window) {
    scope = $rootScope.$new();

    win = angular.element($window);
    offset = {
      top: 150
    };

    elem = angular.element('<div nxg-sticky header="h4" scroll=".well-out"><h4>Some Title</h4><div class="well-out"><p>Some dummy content.</p></div></div>');
    scrollElem = elem.find('.well-out');
    // Initialize style and positioning
    elem.css('height', '300px');
    scrollElem.css('height', '250px');
    elem.marginTop = 0;

    $compile(elem)(scope);
    ctrl = elem.controller('nxgSticky', {
      $scope: scope,
    });

    spyOn(scope, 'adjustScroll').andCallThrough();
    spyOn(scope, 'sizeCallback').andCallThrough();
    spyOn(scope, 'getMaxAllowableElHeight').andCallFake(function() {
        return 300;
    });
    spyOn(scope, 'getElHeight').andCallFake(
      function() {
        return 300;
    });

    spyOn(scope, 'getScrollElHeight').andCallFake(
      function() {
        return 250;
    });
  }))

  it('should have functions to handle page scroll', inject(function () {
    expect(scope.getMaxAllowableElHeight).toBeDefined();
    expect(scope.getElHeight).toBeDefined();
    expect(scope.getScrollElHeight).toBeDefined();
    expect(scope.adjustScroll).toBeDefined();
    expect(scope.sizeCallback).toBeDefined();
  }));

  it('should update the position of the div when the user scrolls', function() {
    win.scrollTop(200);
    scope.$apply();

    expect(scope.sizeCallback).toHaveBeenCalled();
  });

  describe('adjustScroll', function() {
    it('should shrink the div height when it gets too big', function() {
      elem.height(500); // trigger height change
      scrollElem.height(450); // trigger height change
      scope.$apply();

      expect(scope.adjustScroll).toHaveBeenCalledWith(450);
      expect(scope.getMaxAllowableElHeight).toHaveBeenCalled();
      expect(scrollElem.css('max-height')).toBe('300px');
      expect(scrollElem.css('overflow-y')).toBe('scroll');
      expect(scrollElem.css('overflow-x')).toBe('hidden');
    });

    it('should remove height cap and scrollbar when its not needed', function() {
      elem.height(200); // trigger height change
      scrollElem.height(150); // trigger height change
      scope.$apply();

      expect(scope.adjustScroll).toHaveBeenCalledWith(150);
      expect(scope.getMaxAllowableElHeight).toHaveBeenCalled();
      expect(scrollElem.height()).toBe(150);
      expect(scrollElem.css('overflow-y')).toBe('visible');
      expect(scrollElem.css('overflow-x')).toBe('visible');
    });
  });

});
