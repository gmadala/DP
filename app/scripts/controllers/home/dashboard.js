'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $dialog, $log, Payments, Receipts, DealerCredit, Floorplan) {

    $scope.credit           = DealerCredit.fetch();
    $scope.floorplanSummary = Floorplan.fetchStatusSummary();
    $scope.recentReceipts   = Receipts.fetchRecent();
    $scope.paymentSummary   = Payments.fetchSummary();
    $scope.upcomingPayments = Payments.fetchUpcomingPayments();

    $scope.$watch('viewMode', function(newValue, oldValue) {
      if (newValue === oldValue) { return; }
      $scope.paymentSummary = Payments.fetchSummary($scope.viewMode);
    });

  });
