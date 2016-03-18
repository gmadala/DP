(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgEnter', nxgEnter);

  nxgEnter.$inject = [];

  function nxgEnter() {

    return function(scope, element, attrs) {
      element.bind('keydown keypress', function(event) {
        if (event.which === 13 /*enter key code*/) {
          scope.$apply(function() {
            scope.$eval(attrs.nxgEnter);
          });
          event.preventDefault();
        }
      });
    };

  }
})();
