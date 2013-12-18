'use strict';

describe('Directive: nxgSticky', function () {
  beforeEach(module('nextgearWebApp'));

  var elem,
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

    elem = angular.element('<div nxg-sticky><p>Some dummy content.</p></div>');

    // Initialize style and positioning
    elem.css('height', '300px');
    elem.marginTop = 0;

    $compile(elem)(scope);
    ctrl = elem.controller('nxgSticky', {
      $scope: scope,
    });

    spyOn(scope, 'adjustScroll').andCallThrough();
    spyOn(scope, 'sizeCallback').andCallThrough();
    spyOn(scope, 'getMaxAllowableElHeight').andCallFake(function() {
        return 400;
    });
    spyOn(scope, 'getElHeight').andCallFake(
      function() {
        return 300;
    });
  }))

  it('should have functions to handle page scroll', inject(function () {
    expect(scope.getMaxAllowableElHeight).toBeDefined();
    expect(scope.getElHeight).toBeDefined();
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
      scope.$apply();

      expect(scope.adjustScroll).toHaveBeenCalledWith(500);
      expect(scope.getMaxAllowableElHeight).toHaveBeenCalled();
      expect(elem.css('max-height')).toBe('400px');
      expect(elem.css('overflow-y')).toBe('scroll');
      expect(elem.css('overflow-x')).toBe('hidden');
    });

    it('should remove height cap and scrollbar when its not needed', function() {
      elem.height(200); // trigger height change
      scope.$apply();

      expect(scope.adjustScroll).toHaveBeenCalledWith(200);
      expect(scope.getMaxAllowableElHeight).toHaveBeenCalled();
      expect(elem.css('max-height')).toBe('');
      expect(elem.css('overflow-y')).toBe('visible');
      expect(elem.css('overflow-x')).toBe('visible');
    });
  });
});
