'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $dialog, $log, Payments, Receipts, DealerCredit, Floorplan) {

    $scope.credit           = DealerCredit.fetch();
    $scope.floorplanSummary = Floorplan.fetchStatusSummary();
    $scope.isCollapsed      = true;
    $scope.recentReceipts   = Receipts.fetchRecent();
    $scope.summary          = Payments.fetchSummary();
    $scope.unappliedFunds   = Payments.fetchUnappliedFundsInfo();
    $scope.upcomingPayments = Payments.fetchUpcomingPayments();
    $scope.viewMode         = 'week';

    // move this + PayoutCtrl into a directive?
    $scope.openRequestPayout = function() {
      var dialogOptions = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        templateUrl: 'views/modals/requestPayout.html',
        controller: 'PayoutCtrl'
      };

      $dialog.dialog(dialogOptions).open();
      // TODO: Add MVC integration so that user gets a confirmation message when successful.
    };
  })
  .controller('PayoutCtrl', function($scope, dialog) {
    $scope.close = function() {
      // actually send data for payout here.
      dialog.close();
    };
  });
