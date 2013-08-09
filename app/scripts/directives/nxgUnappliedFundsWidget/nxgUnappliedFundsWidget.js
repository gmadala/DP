'use strict';

angular.module('nextgearWebApp')
  .directive('nxgUnappliedFundsWidget', function () {
    return {
      templateUrl: 'scripts/directives/nxgUnappliedFundsWidget/nxgUnappliedFundsWidget.html',
      restrict: 'AC',
      replace: true,
      scope: {},
      controller: function ($scope, $dialog, Payments) {
        $scope.unappliedFunds = Payments.fetchUnappliedFundsInfo();

        $scope.openRequestPayout = function($event) {
          $event.preventDefault();

          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'scripts/directives/nxgUnappliedFundsWidget/requestPayoutModal.html',
            controller: 'PayoutModalCtrl'
          };

          $dialog.dialog(dialogOptions).open();
          // TODO: Add MVC integration so that user gets a confirmation message when successful.
        };
      }
    };
  })
  .controller('PayoutModalCtrl', function($scope, dialog) {
    $scope.close = function() {
      // actually send data for payout here.
      dialog.close();
    };
  });
