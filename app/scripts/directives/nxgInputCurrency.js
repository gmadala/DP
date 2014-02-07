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
                return validformats.test(value) ? parseFloat(value.replace(removeSymbols, ''), 10) : value;
              } else {
                return value;
              }
            };

        ctrl.$parsers.unshift(function(viewValue) {
          var newVal = formatViewValue(viewValue);
          var valid = newVal < attrs.nxgInputCurrency;

          // check if our value is greater than the max
          ctrl.$setValidity('max', valid);
          return newVal;
        });
      }
    };
  });
