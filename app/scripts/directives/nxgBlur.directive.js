(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgBlur', nxgBlur);

  nxgBlur.$inject = ['$parse'];

  function nxgBlur($parse) {

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

  }
})();
