/**
 * Created by gayathrimadala on 2/23/16.
 */
angular.module('nextgearWebApp')
  .directive('nxgDate', function ($parse, moment) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function preLink(scope, element, attrs, ctrl) {

        var validate = function (value) {



          var currentDate = moment(value);
          var maxDate = moment(scope.$eval(attrs.maxDate));
          var minDate = moment(scope.$eval(attrs.minDate));
          var required = attrs.required;


          if(required)
          {
            ctrl.$setValidity('required', false);
          }

          if (currentDate.isAfter(maxDate))
          {
            ctrl.$setValidity('past', false);
          }
          if (currentDate.isBefore(minDate))
          {
            ctrl.$setValidity('future', false);
          }
        };

        ctrl.$parsers.push(validate);

        scope.$watch(attrs.nxgDate, function () {
          ctrl.$setViewValue(ctrl.$viewValue);
        });
      }
    }
  });
