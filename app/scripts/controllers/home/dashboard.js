'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $dialog, $log, Payments, Receipts, DealerCredit, Floorplan, Dashboard) {

    // OLD STUFF, migrating away from this
    $scope.credit           = DealerCredit.fetch();
    $scope.floorplanSummary = Floorplan.fetchStatusSummary();
    $scope.recentReceipts   = Receipts.fetchRecent();
    $scope.paymentSummary   = Payments.fetchSummary();
    $scope.upcomingPayments = Payments.fetchUpcomingPayments();

    $scope.$watch('viewMode', function(newValue, oldValue) {
      if (newValue === oldValue) { return; }
      $scope.paymentSummary = Payments.fetchSummary($scope.viewMode);
    });
    // END OLD STUFF

    $scope.$on('setDateRange', function (event, startDate, endDate) {
      $scope.dashboardData = Dashboard.fetchDealerDashboard(startDate, endDate);
    });

    // temp - hardcode the date range until the calendar gets re-wired to drive this:
    $scope.$emit('setDateRange', new Date(2013, 8, 2), new Date(2013, 8, 6));

  });
