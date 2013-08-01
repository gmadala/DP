'use strict';

angular.module('nextgearWebApp')
  .directive('nxgUpcomingCalendar', function () {
    return {
      template: '<div ui-calendar="options" ng-model="eventSources" calendar="cal"></div>',
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

        $scope.options = {
          contentHeight: 150,
          titleFormat: {
            month: 'MMMM yyyy',
            week: ''
          },
          columnFormat: {
            month: 'ddd',
            week: 'dddd\nMMMM d'
          },
          viewDisplay: function(view) {
            // prevent navigation into the past
            $element.find('.fc-button-prev').toggleClass('fc-state-disabled',
              view.start.valueOf() < new Date().valueOf());

            // load the data for this view
            Payments.fetchUpcomingCalendar(view.start, view.end).then(
              function (results) {
                $scope.openDates = results.openDates;
                $scope.eventsByDate = results.eventsByDate;
                $scope.eventSources.length = 0;
                $scope.eventSources.push(results.dueEvents, results.scheduledEvents);
              }, function (error) {
                // TODO: Do something with the error
                console.log('calendar population failed');
              }
            )
          },
          dayRender: function(date, cell) {
            var dateKey = $filter('date')(date, 'yyyy-MM-dd');
            // add information about open vs. closed days for payment
            if (!$scope.openDates[dateKey]) {
              cell.addClass('closed');
            }
            // add information about whether there are events on a given date
            if ($scope.eventsByDate[dateKey] && $scope.eventsByDate[dateKey].length > 0) {
              cell.addClass('has-events');
            }
          },
          eventRender: function(event, element, view) {
            if (view.name === 'month') {
              // don't render events directly on month calendar (user must click a day to see events in a popup)
              return false;
            }
            return element;
          }
        };

        $scope.$watch('display', function(newValue) {
          // unfortunately fullCalendar does not have live option setter support, see
          // https://code.google.com/p/fullcalendar/issues/detail?id=293
          // TODO: test this to make sure it doesn't break the ng-model support in the calendar
          $scope.cal.fullCalendar('destroy');
          $scope.cal.fullCalendar(angular.extend($scope.options, {
            weekends: (newValue === 'month'),
            defaultView: newValue === 'month' ? newValue : 'basicWeek'
          }));
        });
      }
    };
  });
