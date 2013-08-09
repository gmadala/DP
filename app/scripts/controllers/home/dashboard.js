'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $dialog, $log, Payments, Receipts, DealerCredit, Floorplan) {

    $scope.isCollapsed      = true;
    $scope.viewMode         = 'week';

    $scope.credit           = DealerCredit.fetch();
    $scope.floorplanSummary = Floorplan.fetchStatusSummary();
    $scope.recentReceipts   = Receipts.fetchRecent();
    $scope.paymentSummary   = Payments.fetchSummary();
    $scope.upcomingPayments = Payments.fetchUpcomingPayments();

  });
