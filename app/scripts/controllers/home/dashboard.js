'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $state, $dialog, $log, Dashboard, segmentio, metric, moment, $filter) {

    segmentio.track(metric.VIEW_MAIN_DASHBOARD);

    $scope.viewMode = 'week';

    $scope.getDueStatus = function (payment) {
      var due = moment(payment.DueDate),
        today = moment();

      if (due.isBefore(today, 'day')) {
        return 'overdue';
      } else if (due.isSame(today, 'day')) {
        return 'today';
      } else {
        return 'future';
      }
    };

    $scope.isPast = function() {
      var now = angular.element('.dash-calendar').fullCalendar('getDate');

      if (now.getFullYear() > new Date().getFullYear() || now.getMonth() > new Date().getMonth()) {
        return false;
      } else {
        return true;
      }
    };

    $scope.onClickPrev = function() {
      if (!$scope.isPast()) {
        angular.element('.dash-calendar').fullCalendar('prev');
      }
    };

    $scope.onClickNext = function() {
      angular.element('.dash-calendar').fullCalendar('next');
    };

    $scope.onClickToday = function() {
      angular.element('.dash-calendar').fullCalendar('today');
    };

    $scope.onRequestCredIncr = function() {
      var dialogOptions = {
        dialogClass: 'modal request-credit-increase',
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'views/modals/requestCreditIncrease.html',
        controller: 'RequestCreditIncreaseCtrl'
      };

      $dialog.dialog(dialogOptions).open();
    };

    // Determines if the length of the rendered number is too long
    // to fit inside the pie charts on the dashboard.
    // This method is a terrible separation of view/controller, but
    // it's necessary to shrink numbers that don't fit.
    $scope.tooLong = function(number, format) {
      if($filter('numeral')(number, format).length >= 7) {
        return true;
      } else {
        return false;
      }
    };

    $scope.filterPayments = function(filter) {
      var param;
      if(filter) {
        param = {filter: filter};
      }
      $state.transitionTo('home.payments', param);
    };

    /**
     * Flow of control is a little weird here, because the calendar's current visible
     * date range controls what displays in several dashboard elements (and is a
     * required parameter for loading ANY and all dashboard data).
     *
     * As a result, flow goes like this: the viewMode gets set, or the user pages to a
     * different week or month in the calendar, which then causes the calendar to (re)render,
     * and when it does, it sends a notification with its new date range, which we then use to
     * drive (re)loading of all data, using that date range.
     */
    $scope.$on('setDateRange', function (event, startDate, endDate) {
      Dashboard.fetchDealerDashboard(startDate, endDate).then(
        function (result) {
          $scope.dashboardData = result;
        }
      );
    });

  });
