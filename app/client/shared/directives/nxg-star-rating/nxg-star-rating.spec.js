'use strict';

describe("Directive: nxgStarRatingCtrl", function () {
  beforeEach(module('nextgearWebApp'));

  var scope, controller;

  describe("Controller: NxgStarRatingCtrl", function () {
    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      controller = $controller('NxgStarRatingCtrl', {
        '$scope': scope
      });
    }));

    it("mouse leave to reset rating back to previous current ratingValue or 0", function () {
      scope.ratingValue = 4;
      scope.isolatedMouseLeave();

      expect(scope._rating).toEqual(4);
      expect(scope.hoverValue).toEqual(0);
    });

    it("mouse hover to set temp values for stars", function () {
      scope.isolatedMouseHover(12);

      expect(scope._rating).toEqual(0);
      expect(scope.hoverValue).toEqual(12);
    });

    it("click star to set raingValue, hoverValue and _rating", function () {
      scope.isolatedClick(4);

      expect(scope.ratingValue).toEqual(4);
      expect(scope._rating).toEqual(4);
      expect(scope.hoverValue).toEqual(0);
    });
  });
});
