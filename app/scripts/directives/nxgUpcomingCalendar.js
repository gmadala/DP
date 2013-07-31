'use strict';

angular.module('nextgearWebApp')
  .directive('nxgUpcomingCalendar', function () {
    return {
      template: '<div ui-calendar="options" ng-model="eventSources" calendar="cal"></div>',
      restrict: 'AC',
      scope: {
        display: '=' // week or month
      },
      controller: function($scope) {
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
          }
        };

        $scope.$watch('display', function(newValue) {
          // unfortunately fullCalendar does not have live option setter support, see
          // https://code.google.com/p/fullcalendar/issues/detail?id=293
          $scope.cal.fullCalendar('destroy');
          $scope.cal.fullCalendar(angular.extend({}, $scope.options, {
            weekends: (newValue === 'month'),
            defaultView: newValue === 'month' ? newValue : 'basicWeek'
          }));
        });
      }
    };
  });
