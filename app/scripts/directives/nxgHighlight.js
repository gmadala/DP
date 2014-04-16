'use strict';


angular.module('nextgearWebApp')
  .directive('nxgHighlight', function ($filter) {
    return {
      restrict: 'A',
      scope: {
        nxgHighlight: '=',
        highlight: '='
      },
      link: function postLink(scope, element) {
        /**
        * When nxgHighlight or highlight change, rerun the following:
        * 1) Sanitize nxgHighlight value
        * 2) Every occurance of highlight, put highlight around
        * 3) Throw into innerHTML of element
        */

        var sanitizeAndHighlight = function sanitizeAndHighlight() {

          // Sanitize
          var stringToSanitize = scope.nxgHighlight;
          if(typeof stringToSanitize !== 'string') {
            stringToSanitize = stringToSanitize.toString();
          }
          var entities = {
            '&amp;' : /&/g,
            '&lt;'  : /</g,
            '&gt;'  : />/g,
            '&quot;': /"/g,
            '&#x27;': /'/g,
            '&#x2F;': /\//g
          };

          stringToSanitize = _.reduce(entities, function(str, dangerousVal, safeVal) {
            return str.replace(dangerousVal, safeVal);
          }, stringToSanitize);


          // Highlight
          var highlightedString = $filter('highlight')(stringToSanitize, scope.highlight);

          // Throw into DOM
          element.html(highlightedString);
        };

        scope.$watch('nxgHighlight', sanitizeAndHighlight);
        scope.$watch('highlight', sanitizeAndHighlight);

      }
    };
  });
