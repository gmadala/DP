'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $dialog, $log, Payments, Receipts, DealerCredit, Floorplan, Dashboard) {

    // OLD STUFF, migrating away from this
    $scope.credit           = DealerCredit.fetch();
    $scope.floorplanSummary = Floorplan.fetchStatusSummary();
    $scope.recentReceipts   = Receipts.fetchRecent();
    $scope.paymentSummary   = Payments.fetchSummary();
    $scope.upcomingPayments = Payments.fetchUpcomingPayments();
    // END OLD STUFF

    $scope.viewMode = 'week';

    $scope.$on('setDateRange', function (event, startDate, endDate) {
      $scope.dashboardData = Dashboard.fetchDealerDashboard(startDate, endDate);
    });

  });
