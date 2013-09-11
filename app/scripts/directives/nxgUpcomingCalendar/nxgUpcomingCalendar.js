'use strict';

angular.module('nextgearWebApp')
  .directive('nxgUpcomingCalendar', function (moment) {
    return {
      template: '<div ui-calendar="options" ng-model="eventSources" calendar="cal"></div>',
      restrict: 'AC',
      scope: {
        display: '=', // week or month
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
          weekMode: 'liquid',
          header: {
            left: 'prev',
            center: '',
            right: 'today, next'
          },
          contentHeight: 150,
          titleFormat: {
            month: 'MMM yyyy',
            week: ''
          },
          columnFormat: {
            month: '<b>ddd</b>',
            week: '<b>ddd</b> <b>MMM d</b>'
          },
          viewDisplay: function(view) {
            // prevent navigation into the past
            $element.find('.fc-button-prev').toggleClass('fc-state-disabled',
              view.start.valueOf() < new Date().valueOf());

            // notify that the view has changed
            $scope.$emit('setDateRange', view.start, view.end);
          },
          viewRender: function (view, element) {
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
          },
          eventRender: function(event, element/*, view*/) {
            // un-escape HTML characters in event title to make HTML formatting & entities work
            // see http://code.google.com/p/fullcalendar/issues/detail?id=152
            var dayEvents = element.find('span.fc-event-title');
            angular.forEach(dayEvents, function(value) {
              var dayEvent = angular.element(value);
              dayEvent.html(dayEvent.text());
            });
            // add styling hook for events that are today
            if (moment().isSame(event.start, 'day')) {
              element.addClass('today');
            }
            element.find('.fc-event-inner').append('<span class="fc-event-subtitle">'+event.subTitle+'</span>');
            return element;
          }
        };

        $scope.$watch('display', function(newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          // unfortunately fullCalendar does not have live option setter support, see
          // https://code.google.com/p/fullcalendar/issues/detail?id=293
          $scope.cal.fullCalendar('destroy');
          $scope.cal.fullCalendar(angular.extend($scope.options, {
            defaultView: newValue === 'month' ? newValue : 'basicWeek'
          }));
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
  });
