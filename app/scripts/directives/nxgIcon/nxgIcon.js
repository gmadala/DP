'use strict';

angular.module('nextgearWebApp')
  .directive('nxgIcon', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'scripts/directives/nxgIcon/nxgIcon.html',
      compile: function(element, attrs) {
        /*
         * We manually throw the class and id names in here,
         * as opposed to adding to scope and binding in the template,
         * because we can't have an isolate scope (wouldn't let us
         * ng-show and ng-hide properly) and without an isolate scope,
         * more than one icon on a page would cause the final one to
         * overwrite all the others.
         */
        // var mySvg = element.find('svg');
        element.addClass('nxg-'+attrs.nxgIcon);
        element.find('use').attr('xlink:href', '#'+attrs.nxgIcon);
      }
    };
  });
