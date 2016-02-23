(function() {

  'use strict';

  angular.module('nextgearWebApp')
    .directive('nxgDate', nxgDate);

  function nxgDate(moment) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function preLink(scope, element, attrs, ctrl) {

        function validate(value) {
          var currentDate = moment(value);
          var maxDate = scope.$eval(attrs.maxDate);
          var minDate = scope.$eval(attrs.minDate);

          if (attrs.maxDate && currentDate.isAfter(maxDate)) {
            ctrl.$setValidity('past', false);
            return undefined;
          } else if (attrs.minDate && currentDate.isBefore(minDate)) {
            ctrl.$setValidity('future', false);
            return undefined;
          } else {
            ctrl.$setValidity('future', true);
            ctrl.$setValidity('past', true);
            return value;
          }
        }

        ctrl.$parsers.unshift(validate);
      }
    };
  }

})();
