'use strict';

angular.module('nextgearWebApp')
  .directive('nxgDateField', function ($parse, $strapConfig) {
    return {
      templateUrl: 'scripts/directives/nxgDateField/nxgDateField.html',
      replace: true,
      restrict: 'A',
      compile: function (element, attrs) {
        // move the id and ng-model down onto the enclosed input
        element.removeAttr('id').removeAttr('ng-model');
        element.find('input').attr('id', attrs.id).attr('ng-model', attrs.ngModel);

        // link function
        return {
          pre: function (scope, element, attrs) {
            // adds support for an attribute like before-show-day="someScopeObj.configureDate(date)"
            // see https://github.com/eternicode/bootstrap-datepicker#beforeshowday for allowed return values
            if (angular.isDefined(attrs.beforeShowDay)) {
              var showCode = $parse(attrs.beforeShowDay);
              $strapConfig.datepicker.beforeShowDay = function (date) {
                return showCode(scope, {date: date});
              };
            } else {
              $strapConfig.datepicker.beforeShowDay = angular.noop;
            }
          }
        };
      }
    };
  })
  .value('$strapConfig', {
    datepicker: {
      beforeShowDay: angular.noop
    }
  });
