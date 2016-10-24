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
        readOnly: '@',
        click: "&",
        mouseHover: "&",
        mouseLeave: "&"
      },
      compile: function (element, attrs) {
        if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
          attrs.maxRating = '5';
        }
      },
      controller: 'NxgStarRatingCtrl'
    };
  }
})();
