'use strict';

angular.module('nextgearWebApp')
  .directive('nxgGreaterThan', function ($parse) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        scope.$watch(function() {
          var otherValParsed = $parse(attrs.nxgGreaterThan)(scope);
          if(ctrl.$modelValue && ctrl.$modelValue !== '' && otherValParsed && otherValParsed !== '') {
            var thisVal = parseFloat(ctrl.$modelValue);
            var otherVal = parseFloat(otherValParsed);
            return thisVal > otherVal;
          } else {
            return true;
          }
        }, function (greaterThan) {
          ctrl.$setValidity('greaterThan', greaterThan );
        });

      }
    };
  });
