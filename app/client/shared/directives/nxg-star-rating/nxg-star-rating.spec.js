'use strict';

describe("Directive: nxgStarRatingCtrl", function () {
  beforeEach(module('nextgearWebApp'));

  var scope, controller, compile, element;

  describe("Directive: NxgStarRating", function () {
    beforeEach(inject(function (_$compile_, _$rootScope_) {
      scope = _$rootScope_.$new();
      compile = _$compile_;

      element = angular.element('<nxg-star-rating max-rating="10"></nxg-star-rating>');
      element = compile(element)(scope);
      scope.$digest();
    }));


    it("check max rating is being set correctly when not passed", function () {
      console.log(scope.maxRating);

      expect(scope.maxRating).toEqual(5);
    });


  });

  describe("Controller: NxgStarRatingCtrl", function () {
    beforeEach(inject(function ($rootScope, $controller, _$compile_) {
      scope = $rootScope.$new();
      compile = _$compile_;
      controller = $controller('NxgStarRatingCtrl', {
        '$scope': scope
      });
    }));

    // fit('replace the element with appropriate content', function() {
    //   var elm = compile("<nxg-star-rating></nxg-star-rating")(rootScope);
    //
    //   rootScope.$digest();
    //   expect(scope.maxRating).toEqual(5);
    //   expect(scope.maxRatings.length).toEqual(5);
    // });

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
