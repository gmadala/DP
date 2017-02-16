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

          ctrl.$setValidity('future', true);
          ctrl.$setValidity('past', true);
          if (attrs.maxDate && currentDate.isAfter(maxDate, 'day')) {
            ctrl.$setValidity('future', false);
          } else if (attrs.minDate && currentDate.isBefore(minDate, 'day')) {
            ctrl.$setValidity('past', false);
          }
          return value;
        }

        ctrl.$parsers.unshift(validate);
      }
    };
  }

})();
