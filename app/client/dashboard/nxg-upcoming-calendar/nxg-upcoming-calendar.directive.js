(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgUpcomingCalendar', nxgUpcomingCalendar);

  nxgUpcomingCalendar.$inject = ['moment', '$state', '$window'];

  function nxgUpcomingCalendar(moment, $state, $window) {

    return {
      template: '<div class="dash-calendar" ui-calendar="options" ng-model="eventSources" calendar="cal"></div>',
      restrict: 'AC',
      scope: {
        display: '=', // week or month
        language: '=', //english, spanish, or french
        data: '='
      },
      controller: function($scope, $element, $filter) {
        $scope.openDates = {};
        $scope.eventsByDate = {};

        $scope.eventSources = [
          // no data initially
        ];

        $scope.selectedDetail = null;

        $scope.options = {
          defaultView: 'basicWeek',
          weekends: false,
          fixedWeekCount: 'false',
          height: 'auto',
          contentHeight: 150,
          lang: $scope.language,
          header: {
            left: '',
            center: 'prev, title, next',
            right: ''
          },
          views: {
            month: {
              titleFormat: 'MMMM YYYY',
              columnFormat: 'ddd'
            },
            week: {
              titleFormat: 'MMM DD, YYYY',
              columnFormat: 'ddd M/D'
            },
            day: {
              titleFormat: 'MMMM DD, YYYY'
            }
          },
          viewRender: function (view, element) {
            // prevent navigation into the past
            $element.find('.fc-prev-button').toggleClass('fc-state-disabled',
              view.start.valueOf() < new Date().valueOf());

            // notify that the view has changed
            if (($scope.options.defaultView === 'basicWeek') || ($scope.options.defaultView === 'basicDay')) {
              var startOfWeek = view.start.startOf('week').add(4, 'hours');
              var endOfWeek = view.end.endOf('week').add(4,'hours');
              $scope.$emit('setDateRange', startOfWeek.format('YYYY-MM-DD'), endOfWeek.format('YYYY-MM-DD'));
            } else if ($scope.options.defaultView === 'month') {
              // super complex calculation to determine the current month.
              var afterViewStart = view.start.add(20, 'd');
              var startOfMonth = afterViewStart.startOf('month');
              var beforeViewEnd = view.end.subtract(20, 'd');
              var endOfMonth = beforeViewEnd.endOf('month');
              $scope.$emit('setDateRange', startOfMonth.format('YYYY-MM-DD'), endOfMonth.format('YYYY-MM-DD'));
            }

            // un-escape HTML characters in event title to make HTML formatting & entities work
            // see http://code.google.com/p/fullcalendar/issues/detail?id=152
            var dayTitles = element.find('th.fc-day-header');
            angular.forEach(dayTitles, function(value) {
              var dayTitle = angular.element(value);
              dayTitle.html(dayTitle.text());
            });
          },
          dayRender: function(date, cell) {
            var dateKey = angular.isString(date) ? date : $filter('date')(date, 'yyyy-MM-dd');
            // add a styling hook for open vs. closed days for payment
            if (!$scope.openDates[dateKey]) {
              cell.addClass('closed');
            } else {
              cell.removeClass('closed');
            }
            // add a styling hook based on whether there are events on a given date
            if ($scope.eventsByDate[dateKey] && $scope.eventsByDate[dateKey].length > 0) {
              cell.addClass('has-events');
            } else {
              cell.removeClass('has-events');
            }

            // make sure week view gets date numbers and no cells get duplicates
            if (angular.element(cell).find('.fc-day-number').length === 0) {
              var d = moment(dateKey).date();

              angular.element(cell).find('div > .fc-content').before('<div class="fc-day-number">' + d + '</div>');
            }
          },
          eventRender: function(event, element/*, view*/) {
            // un-escape HTML characters in event title to make HTML formatting & entities work
            // see http://code.google.com/p/fullcalendar/issues/detail?id=152
            var dayEvents = element.find('span.fc-title');
            angular.forEach(dayEvents, function(value) {
              var dayEvent = angular.element(value);
              dayEvent.html(dayEvent.text());
            });
            // add styling hook for events that are today
            var eventStart = moment(event.start).format('DD-MM-YYYY');
            var now = moment().format('DD-MM-YYYY');
            if (now===eventStart) {
              element.addClass('today');
            }
            // add styling hook for events that are overdue
            eventStart = moment(event.start);
            if (moment().isAfter(eventStart.add(1, 'day'), 'day')) {
              element.addClass('overdue');
            }

            var inner = element.find('.fc-content');

            inner.append('<span class="fc-event-subtitle">'+event.subTitle+'</span>');
            inner.addClass('link');

            // Wasn't able to add event the angular way, so doing it the vanilla javascript way
            inner[0].addEventListener('click', (function(date) {
              return function() {
                $scope.$apply(function() {
                  $state.transitionTo('payments', {filter: moment(date).format('YYYY-MM-DD')});
                });
              };
            })(event.start), false);


            return element;
          }
        };

        if ($window.innerWidth < 768) {
          $scope.options.defaultView = 'basicDay';
        }

        $scope.$watch('display', function(newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }

          angular.extend($scope.options, {
            defaultView: newValue === 'month' ? newValue : 'basicWeek'
          });
        });

        $scope.$watch('data', function(newValue) {
          if (!newValue) {
            return;
          }

          $scope.openDates = newValue.openDates;
          $scope.eventsByDate = newValue.eventsByDate;
          $scope.eventSources.length = 0;
          $scope.eventSources.push(newValue.dueEvents, newValue.scheduledEvents);

          // hack: force the dayRender logic to run again for each day now that we have data
          $element.find('.fc-day').each(function (index, day) {
            day = angular.element(day);
            $scope.options.dayRender(day.attr('data-date'), day);
          });
        });

      }
    };

  }
})();
