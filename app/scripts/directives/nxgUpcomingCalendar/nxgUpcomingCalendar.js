'use strict';

angular.module('nextgearWebApp')
  .directive('nxgUpcomingCalendar', function () {
    return {
      template: '<div ui-calendar="options" ng-model="eventSources" calendar="cal"></div>' +
        '<div nxg-upcoming-detail-popup></div>',
      restrict: 'AC',
      scope: {
        display: '=' // week or month
      },
      controller: function($scope, $element, $filter, Payments) {
        $scope.openDates = {};
        $scope.eventsByDate = {};

        $scope.eventSources = [
          // no data initially
        ];

        $scope.selectedDetail = null;

        $scope.options = {
          defaultView: 'basicWeek',
          weekends: false,
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
            month: '<b>ddd</b> <b>MMM d</b>',
            week: '<b>ddd</b> <b>MMM d</b>'
          },
          viewDisplay: function(view) {
            // prevent navigation into the past
            //$element.find('.fc-button-prev').toggleClass('fc-state-disabled',
              //view.start.valueOf() < new Date().valueOf());

            // load the data for this view
            Payments.fetchUpcomingCalendar(view.start, view.end).then(
              function (results) {
                $scope.openDates = results.openDates;
                $scope.eventsByDate = results.eventsByDate;
                $scope.eventSources.length = 0;
                $scope.eventSources.push(results.dueEvents, results.scheduledEvents);
                // hack: force the dayRender logic to run again for each day now that we have data
                $element.find('.fc-day').each(function (index, day) {
                  day = angular.element(day);
                  $scope.options.dayRender(day.attr('data-date'), day);
                });
              }, function (/*error*/) {
                // TODO: Do something with the error
                console.log('calendar population failed');
              }
            );
          },
          viewRender: function (view, element) {
            // un-escape HTML characters in event title to make HTML formatting & entities work
            // see http://code.google.com/p/fullcalendar/issues/detail?id=152
            var dayTitles = element.find('th.fc-day-header');
            angular.forEach(dayTitles, function(value, key) {
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
          eventRender: function(event, element, view) {
            // un-escape HTML characters in event title to make HTML formatting & entities work
            // see http://code.google.com/p/fullcalendar/issues/detail?id=152
            var dayEvents = element.find('span.fc-event-title');
            angular.forEach(dayEvents, function(value, key) {
              var dayEvent = angular.element(value);
              dayEvent.html(dayEvent.text());
            });
            element.find('.fc-event-inner').append('<span class="fc-event-subtitle">'+event.subTitle+'</span>');
            return element;
          },
        };

        $scope.$watch('display', function(newValue, oldValue) {
          if (newValue === oldValue) {
            return;
          }
          // unfortunately fullCalendar does not have live option setter support, see
          // https://code.google.com/p/fullcalendar/issues/detail?id=293
          $scope.cal.fullCalendar('destroy');
          $scope.cal.fullCalendar(angular.extend($scope.options, {
            //weekends: (newValue === 'month'),
            defaultView: newValue === 'month' ? newValue : 'basicWeek'
          }));
        });
      }
    };
  })
