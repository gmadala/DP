(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgStarRating', nxgStarRating);

  nxgStarRating.$inject = ['$compile'];

  function nxgStarRating($compile) {

    return {
      templateUrl: 'client/shared/directives/nxg-star-rating/nxg-star-rating.html',
      restrict: 'EA',
      scope: {
        ratingValue: '=',
        maxRating: '@',
        readOnly: '@',
        click: "&",
        mouseHover: "&",
        mouseLeave: "&"
      },
      controller: 'NxgStarRatingCtrl'
    };
  }
})();
