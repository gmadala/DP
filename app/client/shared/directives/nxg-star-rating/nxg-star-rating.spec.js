'use strict';

describe("Directive: nxgStarRatingCtrl", function () {
  beforeEach(module('nextgearWebApp', 'client/shared/directives/nxg-star-rating/nxg-star-rating.html'));

  var scope, controller, element1, element2;

  describe("Directive: NxgStarRating", function () {
    beforeEach(inject(function ($compile, _$rootScope_) {
      scope = _$rootScope_.$new();

      element1 = angular.element("<nxg-star-rating max-rating='10'></nxg-star-rating>");
      element1 = $compile(element1)(scope);

      element2 = angular.element("<nxg-star-rating></nxg-star-rating>");
      element2 = $compile(element2)(scope);
      scope.$digest();
    }));


    it("check max rating is being set correctly when not passed", function () {
      expect(element1.attr("max-rating")).toEqual("10");
      expect(element1.find(".glyphicon").length).toEqual(10);
    });

    it("check max rating is being set correctly when not passed", function () {
      expect(element2.find(".glyphicon").length).toEqual(5);
    });
  });

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
