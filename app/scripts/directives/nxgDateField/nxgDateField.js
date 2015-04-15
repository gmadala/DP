/* global $ */
'use strict';

angular.module('nextgearWebApp')
  .directive('nxgDateField', function ($parse, $strapConfig, moment, $timeout, gettextCatalog) {
    return {
      templateUrl: 'scripts/directives/nxgDateField/nxgDateField.html',
      replace: true,
      restrict: 'A',
      require: '^form',
      compile: function (element, attrs) {
        var inputName = attrs.name,
            required = attrs.required;

        // compile --> trigger change --> trigger compile
        // cycling there.
        // changing attribute, setting it etc will trigger change.

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

        if(attrs.dateAllow === 'past') {
          attrs.beforeShowDay = 'notFutureDates(date)';
          element.attr('before-show-day', 'notFutureDates(date)');
        } else if (attrs.dateAllow === 'future') {
          attrs.beforeShowDay = 'notPastDates(date)';
          element.attr('before-show-day', 'notPastDates(date)');
        }

        if(!attrs.hidePlaceholder) {
          element.find('input').attr('placeholder', 'mm/dd/yyyy');
        }

        // Automatically load in current language
        var currentLanguage = gettextCatalog.currentLanguage;
        if (currentLanguage !== 'en') {
          var dateLang = moment().lang();
          $strapConfig.datepicker.language = currentLanguage;
          $.fn.datepicker.dates[currentLanguage] = {
            days: dateLang._weekdays,
            daysMin: dateLang._weekdaysMin,
            daysShort: dateLang._weekdaysMin,
            months: dateLang._months,
            monthsShort: dateLang._monthsShort
          };
        }

        // link function
        return {
          pre: function (scope, element, attrs, formCtrl) {
            scope.isDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
            var showCode = $parse(attrs.beforeShowDay),
                $input = element.children('input'),
                datepickerIsOpen = false,
                datepickerPopup;

            element.on('show', function() {
              datepickerIsOpen = true;


              // In IE10, date wasn't getting selected without double-clicking. The "click"
              // event wasn't getting triggered on click, so this adds a mousedown listener
              // that in turn triggers a click event. If removing or changing this, ensure
              // that single-clicks can still select a date in IE (specifically IE10).
              // Relates to VO-1099.
              if(!datepickerPopup) {
                datepickerPopup = angular.element('.datepicker');
                datepickerPopup.find('td').on('mousedown', function(){
                  angular.element(this).trigger('click');
                });
              }

            });

            // a bit round-about, but passing ngModel here the data errs are not applied yet,
            // hence we do some digging and IF this field has a date error, reset the input to
            // reflect that bad data
            element.on('change', function() {
              var errs = formCtrl.$error.date,
                  utcVal;

              // IE9 has an issue with timezones - if date isn't set at midnight,
              // then the date will be wrong for timezones west of GMT. Correct for this
              if(this.value && this.value.getHours() !== 0) {
                this.value.setTime(this.value.getTime() + this.value.getTimezoneOffset()*60*1000);
              }

              if (errs && errs.length > 0) {
                angular.forEach(errs, function(err){
                  //for invalid format dates, parse with the moment library
                  if (err.$name === inputName) {
                    utcVal = moment(element.find('input').val()).toDate();
                    formCtrl[inputName].$setViewValue(utcVal);
                    formCtrl[inputName].$setValidity('date', true);
                  }
                });
              }
            });

            // Make the current date get filled by default when you hit
            // enter (keyCode 13) and there isn't already a value in the input.
            $input.on('keydown', function(event) {
              if(event.keyCode === 13){
                if(datepickerIsOpen) {
                  if(false === showCode(scope, {date: new Date(this.value)})){
                    // The date selected is invalid

                    // stops other handlers from firing and closing the datepicker
                    event.stopImmediatePropagation();
                    // stops form from submitting (and showing red validation errors)
                    event.preventDefault();
                  } else if(this.value === ''){
                    var $this = angular.element(this);
                    $this.datepicker('setValue', new Date());
                    $this.trigger({
                      type: 'changeDate', // Send the 'changeDate' event
                      date: new Date() //, passing in the current date
                    });
                  }
                } else {
                  // Datepicker not open, ensure valid date
                  if(!$input.val().match(scope.isDate)) {
                    formCtrl[inputName].$setValidity('date', false);
                  }
                }
              }
            });

            // On instances with no form validation, every keypress triggers an input event,
            // which parses a (obviously incomplete) date prematurely. This stops that from
            // happening before blur or hitting "enter".
            $input.on('input', function(event) {
              event.stopImmediatePropagation();
            });

            $input.on('blur', function() {
              if(!this.value.match(scope.isDate) && this.value !== '') {
                formCtrl[inputName].$setValidity('date', false);
              } else {
                formCtrl[inputName].$setValidity('date', true);
              }
            });

            // When date changes (esp with a click), make sure focus remains on the input element.
            element.on('hide', function() {
              datepickerIsOpen = false;

              // In IE10, date wasn't getting selected without double-clicking. The "click"
              // event wasn't getting triggered on click, so this adds a mousedown listener
              // that in turn triggers a click event. If removing or changing this, ensure
              // that single-clicks can still select a date in IE (specifically IE10).
              // Relates to VO-1099.
              if(datepickerPopup) {
                datepickerPopup.find('td').off('mousedown');
                datepickerPopup = null;
              }

              if(false === showCode(scope, {date: new Date(this.value)})) {
                $input.val('');
              }

              // If value is outside allowed date range element.val() will be the invalid date
              // but $input.val() will show the minimum valid date. When they don't match, clear
              // the input.
              var displayDate = moment($input.val(), 'MM/DD/YYYY');
              var memoryDate = moment(element.val());
              if(!displayDate || !displayDate.isValid() || !memoryDate || !memoryDate.isValid() || !displayDate.isSame(memoryDate, 'day')) {
                $input.val('');
                $input.trigger({
                  type: 'changeDate', // Send the 'changeDate' event
                  date: null
                });

              }

              if(document.activeElement !== $input.get()[0]) {
                $input.focus();

                // In IE the focus() causes the datepicker to re-open,
                // so it must be manually hidden (and its execution delayed slightly)
                $timeout(function() {
                  $input.datepicker('hide');
                });
              }
            });

            if (attrs.dateAllow === 'past') {
              scope.$watch(attrs.ngModel, function(newValue) {
                formCtrl[inputName].$setValidity('past', scope.notFutureDates(newValue), formCtrl[inputName]);
              });
            } else if (attrs.dateAllow === 'future') {
              scope.$watch(attrs.ngModel, function(newValue) {
                formCtrl[inputName].$setValidity('future', scope.notPastDates(newValue), formCtrl[inputName]);
              });
            }

            // When navigating to another state, hide all datepickers
            element.bind('$destroy', function() {
              $input.datepicker('hide');
            });

            scope.notFutureDates = function(date) {
              if (date !== date || !date) { // Stop NaN or null from getting into the function
                return true;
              }
              return !(moment().isBefore(moment(date), 'day'));
            };

            scope.notPastDates = function(date) {
              if (date !== date || !date) { // Stop NaN or null from getting into the function
                return true;
              }
              return !(moment().isAfter(moment(date), 'day'));
            };

            // adds support for an attribute like before-show-day="someScopeObj.configureDate(date)"
            // see https://github.com/eternicode/bootstrap-datepicker#beforeshowday for allowed return values
            if (angular.isDefined(attrs.beforeShowDay)) {
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
