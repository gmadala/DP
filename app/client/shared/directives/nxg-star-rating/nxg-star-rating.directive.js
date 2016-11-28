(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgStarRating', nxgStarRating);

  nxgStarRating.$inject = [];

  function nxgStarRating() {

    return {
      templateUrl: 'client/shared/directives/nxg-star-rating/nxg-star-rating.html',
      restrict: 'EA',
      scope: {
        ratingValue: '=',
        maxRating: '@',
        click: "&",
        mouseHover: "&",
        mouseLeave: "&"
      },
      controller: 'NxgStarRatingCtrl'
    };
  }
})();
