(function() {
  'use strict';
  angular
    .module('nextgearWebApp')
    .controller('NxgStarRatingCtrl', NxgStarRatingCtrl);

  NxgStarRatingCtrl.$inject = ['$scope'];

  function NxgStarRatingCtrl($scope) {

    $scope.maxRatings = [];

    // console.log($scope.maxRatings);

    for (var i = 1; i <= $scope.maxRating; i++) {
      $scope.maxRatings.push({});
    }

    // console.log($scope.maxRatings);

    $scope._rating = $scope.ratingValue;

    $scope.isolatedClick = function (param) {
      $scope.ratingValue = param;
      $scope._rating = param;
      $scope.hoverValue = 0;
    };

    $scope.isolatedMouseHover = function (param) {
      $scope._rating = 0;
      $scope.hoverValue = param;
    };

    $scope.isolatedMouseLeave = function () {
      $scope._rating = $scope.ratingValue;
      $scope.hoverValue = 0;
    };

  }

})();
