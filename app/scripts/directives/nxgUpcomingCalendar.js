'use strict';

angular.module('nextgearWebApp')
  .directive('nxgUpcomingCalendar', function () {
    return {
      template: '<div ui-calendar="options" ng-model="eventSources" calendar="cal"></div>',
      restrict: 'E',
      scope: {
        display: '=' // week or month
      },
      controller: function($scope) {
        $scope.eventSources = [
          [] // no event data yet
        ];

        $scope.options = {
          contentHeight: 150
        };

        $scope.$watch('display', function(newValue) {
          $scope.cal.fullCalendar('changeView', newValue === 'month' ? newValue : 'basicWeek');
        });
      }
    };
  });
