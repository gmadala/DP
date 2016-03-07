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

          // Sanitize - set element text content, then get innerHTML
          // Same way jQuery.text() works, and how AngularJS sanitizes bound values
          var memory = document.createElement('div');
          memory.textContent = scope.nxgHighlight;
          var sanitizedString = memory.innerHTML;

          // Sanitize highlighting string - it's treated like a regex, so regex special
          // characters need to be escaped
          var highlightString = scope.highlight && scope.highlight.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

          // Highlight
          var highlightedString = $filter('highlight')(sanitizedString, highlightString);

          // Throw into DOM
          element.html(highlightedString);
        };

        scope.$watch('nxgHighlight', sanitizeAndHighlight);
        scope.$watch('highlight', sanitizeAndHighlight);

      }
    };
  });
