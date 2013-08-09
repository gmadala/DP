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
            if (view.name === 'month') {
              // don't render events directly on month calendar (user must click a day to see events in a popup)
              return false;
            }
            element.find('.fc-event-inner').append('<span class="fc-event-subtitle">'+event.subTitle+'</span>');
            return element;
          },
          dayClick: function(date, allDay, jsEvent, view) {
            var dateKey = $filter('date')(date, 'yyyy-MM-dd');
            if (view.name === 'month' && $scope.openDates[dateKey]) {
              var dayElement = this; // the <td> that was clicked
              $scope.$apply(function () {
                $scope.selectedDetail = {
                  date: date,
                  events: $scope.eventsByDate[dateKey],
                  positionFrom: angular.element(dayElement)
                };
              });
            }
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
            weekends: (newValue === 'month'),
            defaultView: newValue === 'month' ? newValue : 'basicWeek'
          }));
        });
      }
    };
  })

/**
 * Private-ish helper directive for showing the details popup when user clicks a date on the month view
 */
  .directive('nxgUpcomingDetailPopup', function () {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'scripts/directives/nxgUpcomingCalendar/nxgUpcomingDetailPopup.html',
      link: function(scope, element) {
        element.hide().appendTo('body');
        scope.$on('$destroy', function () {
          element.remove();
        });
      },
      controller: function($scope, $element) {
        $scope.close = function () {
          $element.hide();
        };

        $scope.$watch('selectedDetail', function (detail) {
          if (detail) {
            var origin = detail.positionFrom.offset();
            origin.left += detail.positionFrom.width() + 10;
            origin.top -= 20;
            $element.show().offset(origin);
          } else {
            $scope.close();
          }
        });
      }
    };
  });
