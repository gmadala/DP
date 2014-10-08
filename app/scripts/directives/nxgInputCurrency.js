'use strict';

angular.module('nextgearWebApp')
  .directive('nxgInputCurrency', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        var removeSymbols = /[^\d\.]/g,
            validformats = /^[0-9]{1,3}(?:,?[0-9]{3})*(\.[0-9]{1,2})?$/,

            formatViewValue = function(value) {
              if( typeof value === 'string') {
                return parseFloat(value.replace(removeSymbols, ''), 10);
              } else {
                return value;
              }
            };

        ctrl.$parsers.unshift(function(viewValue) {
          //if the validation pattern is wrong, set the pattern validity to false here rather than as part of the
          //ng-pattern validation. This allows us to control the case where the input value is so large that the validation
          //fails in ng-pattern but not when checked here.
          if(validformats.test(viewValue)){
            ctrl.$setValidity('pattern', true);
            var newVal = formatViewValue(viewValue);
            var valid = newVal <= attrs.nxgInputCurrency;
            // check if our value is greater than the max
            ctrl.$setValidity('max', valid);
            return newVal;
          }
          else{
            ctrl.$setValidity('pattern', false);
            return viewValue;
          }
        });
      }
    };
  });
