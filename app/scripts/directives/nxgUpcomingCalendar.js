'use strict';

angular.module('nextgearWebApp')
  .directive('nxgUpcomingCalendar', function () {
    return {
      template: '<div ui-calendar="options" ng-model="eventSources" calendar="cal"></div>',
      restrict: 'AC',
      scope: {
        display: '=' // week or month
      },
      controller: function($scope, $element) {
        $scope.eventSources = [
          [] // no event data yet
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
            $element.find('.fc-button-prev').toggleClass('fc-state-disabled', view.start.valueOf() < new Date().valueOf());
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
