(function() {
  'use strict';
  angular
    .module('nextgearWebApp')
    .controller('NxgStarRatingCtrl', NxgStarRatingCtrl);

  NxgStarRatingCtrl.$inject = ['$scope'];

  function NxgStarRatingCtrl($scope) {

    $scope.maxRatings = [];

    if (!$scope.maxRating || (Number($scope.maxRating <= 0))) {
      $scope.maxRating = 5;
    }

    $scope.maxRatings = new Array(Number($scope.maxRating));

    $scope._rating = $scope.ratingValue;

    $scope.isolatedClick = function (starIndex) {
      $scope.ratingValue = starIndex;
      $scope._rating = starIndex;
      $scope.hoverValue = 0;
    };

    $scope.isolatedMouseHover = function (starIndex) {
      $scope._rating = 0;
      $scope.hoverValue = starIndex;
    };

    $scope.isolatedMouseLeave = function () {
      $scope._rating = $scope.ratingValue;
      $scope.hoverValue = 0;
    };

  }

})();
