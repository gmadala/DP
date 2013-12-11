'use strict';

angular.module('nextgearWebApp')
  .directive('nxgDateField', function ($parse, $strapConfig, moment) {
    return {
      templateUrl: 'scripts/directives/nxgDateField/nxgDateField.html',
      replace: true,
      restrict: 'A',
      require: '^form',
      compile: function (element, attrs) {
        var inputName = attrs.name,
            required = attrs.required;

        // move the id and ng-model down onto the enclosed input
        element.removeAttr('id').removeAttr('ng-model').removeAttr('name');
        element.find('input').attr('id', attrs.id).attr('ng-model', attrs.ngModel).attr('name', attrs.name);

        if(required) {
          element.removeAttr('required');
          element.find('input').attr('required', true);
        }

        if(attrs.ngPattern) {
          element.removeAttr('ng-pattern');
          element.find('input').attr('ng-pattern', attrs.ngPattern);
        }

        // link function
        return {
          pre: function (scope, element, attrs, formCtrl) {
            // a bit round-about, but passing ngModel here the data errs are not applied yet,
            // hence we do some digging and IF this field has a date error, reset the input to
            // reflect that bad data
            element.on('change', function() {
              var errs = formCtrl.$error.date,
                  utcVal;

              if (errs && errs.length > 0) {
                angular.forEach(errs, function(err){
                  if (err.$name === inputName) {
                    utcVal = moment(element.find('input').val()).toDate();
                    formCtrl[inputName].$setViewValue(utcVal);
                    formCtrl[inputName].$setValidity('date', true);
                  }
                });
              }

              if(!scope.$$phase) {
                scope.$apply();
              }

            });

            // Make the current date get filled by default when you hit
            // enter (keyCode 13) and there isn't already a value in the input.
            element.children('input').on('keydown', function(event) {
              if(event.keyCode === 13 && this.value === ''){
                var $this = angular.element(this);
                $this.datepicker('setValue', new Date());
                $this.trigger({
                  type: 'changeDate', // Send the 'changeDate' event
                  date: new Date() //, passing in the current date
                });
              }
            });

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
