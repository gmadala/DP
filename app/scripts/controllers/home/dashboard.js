'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $dialog, $log, Dashboard) {

    $scope.viewMode = 'week';

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
      $scope.dashboardData = Dashboard.fetchDealerDashboard(startDate, endDate);
    });

  });
