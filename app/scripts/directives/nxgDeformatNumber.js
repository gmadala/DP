'use strict';

/**
 * Strip everything but digits and . from a string entered
 * in an input, before sending it on down the ng-model chain.
 *
 * This is very aggressive, so you may want to pair with
 * an ng-pattern validator to make sure the value looked
 * reasonably like a number before stripping.
 */
angular.module('nextgearWebApp')
  .directive('nxgDeformatNumber', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        var parser = function(value) {
          if (typeof value === 'string') {
            return value.replace(/[^\d\.]/g, '');
          } else {
            return value;
          }
        };

        ctrl.$parsers.push(parser);
      }
    };
  });
