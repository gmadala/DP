'use strict';

/**
 * Validator directive for use on inputs. Differs from built-in max directive
 * by being designed for input type=text (avoiding number stepper control), and
 * allowing any expression for max value.
 *
 * Note that this will skip validation if the entered value cannot be parsed as a
 * number. You can use ng-pattern alongside this to enforce a numeric value.
 */
angular.module('nextgearWebApp')
  .directive('nxgMax', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
        var numberize = function (value) {
          if (/^\-?([0-9]+(\.[0-9]+)?)$/.test(value)) {
            return Number(value);
          }
          return NaN;
        };

        var validate = function (value) {
          var numValue = numberize(value),
            setting = scope.$eval(attrs.nxgMax);
          if (!angular.isNumber(setting)) {setting = Infinity;}
          if (angular.isNumber(numValue) && numValue > setting) {
            ctrl.$setValidity('nxgMax', false);
            return undefined;
          } else {
            ctrl.$setValidity('nxgMax', true);
            return value;
          }
        };

        ctrl.$parsers.push(validate);

        scope.$watch(attrs.nxgMax, function () {
          ctrl.$setViewValue(ctrl.$viewValue);
        });
      }
    };
  });
