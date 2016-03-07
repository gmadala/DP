'use strict';

angular.module('nextgearWebApp')
  .directive('nxgBlur', function ($parse) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var fn = $parse(attrs.nxgBlur);
        element.bind('blur', function(event) {
          scope.$apply(function() {
            fn(scope, {$event:event});
          });
        });
      }
    };
  });
