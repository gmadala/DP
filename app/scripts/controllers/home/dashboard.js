'use strict';

angular.module('nextgearWebApp')
  .controller('DashboardCtrl', function($scope, $dialog, $log, Payments) {
    $scope.viewMode = 'week';

    $scope.isCollapsed = true;

    Payments.fetchSummary().then(
      function(results) { $scope.summary = results; },
      function(error) { $log.error(error); }
    );

    Payments.fetchUpcomingPayments().then(function(results) {
      $scope.upcomingPayments = results;
    });

    // dummy data
    $scope.unappliedFunds = 2641.00;
    $scope.totalAvailable = 2641.90;

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
