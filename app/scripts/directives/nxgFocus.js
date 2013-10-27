'use strict';

angular.module('nextgearWebApp')
  .directive('nxgFocus', function ($parse) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var fn = $parse(attrs.nxgFocus);
        element.bind('focus', function(event) {
          scope.$apply(function() {
            fn(scope, {$event:event});
          });
        });
      }
    };
  });
