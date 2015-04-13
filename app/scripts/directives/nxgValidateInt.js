'use strict';

/**
 * Strip everything but digits and decimals from a string entered
 * in an input and make sure its length is less than the
 * value sent in, before sending it on down the model.
 *
 * This is very aggressive, so you may want to pair with
 * an ng-pattern validator to make sure the value looked
 * reasonably like a number before stripping.
 *
 * As of Feb 2014, only used on Floor Car and Bulk Flooring pages.
 */
angular.module('nextgearWebApp')
  .directive('nxgValidateInt', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        var regex = /[^\d^A-Za-z\.]/g;

        var parser = function(value) {
          if (typeof value === 'string') {
            var newVal = value.replace(regex, '');
            var valid = newVal.length <= attrs.nxgValidateInt;

            ctrl.$setValidity('maxlength', valid);
            return newVal;
          } else {
            /**
             * If its not a string, it's a number or it's null,
             * so we'll set the maxlength validity back to true
             */
            ctrl.$setValidity('maxlength', true);
            return value;
          }
        };

        ctrl.$parsers.push(parser);
      }
    };
  });
