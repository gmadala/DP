'use strict';

angular.module('nextgearWebApp')
  .directive('nxgUnappliedFundsWidget', function () {
    return {
      templateUrl: 'scripts/directives/nxgUnappliedFundsWidget/nxgUnappliedFundsWidget.html',
      restrict: 'AC',
      replace: true,
      scope: {},
      controller: 'UnappliedFundsWidgetCtrl'
    };
  })
  .controller('UnappliedFundsWidgetCtrl', function ($scope, $dialog, $filter, Payments) {
    $scope.unappliedFunds = Payments.fetchUnappliedFundsInfo();

    $scope.openRequestPayout = function($event) {
      $event.preventDefault();

      var dialogOptions = {
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'scripts/directives/nxgUnappliedFundsWidget/requestPayoutModal.html',
        controller: 'PayoutModalCtrl',
        resolve: {
          funds: function () {
            return angular.copy($scope.unappliedFunds);
          }
        }
      };

      $dialog.dialog(dialogOptions).open().then(
        function (result) {
          if (result) {
            // wireframes do not specify any kind of success display, so let's just do a simple one
            var title = 'Request submitted',
              msg = 'Your request for a payout in the amount of ' +
                $filter('currency')(result.amount) +
                ' to your account "' + result.account.BankAccountName +
                '" has been successfully submitted.',
              buttons = [{label: 'OK', cssClass: 'btn-primary'}];
            $dialog.messageBox(title, msg, buttons).open();
          }
        }
      );
    };
  })
  .controller('PayoutModalCtrl', function($scope, $filter, dialog, funds, User, Payments) {
    $scope.funds = funds;
    $scope.user = User;
    $scope.selections = {
      amount: undefined,
      account: undefined
    };

    $scope.submit = function () {
      $scope.submitError = null;
      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.validity = angular.copy($scope.form);
      if (!$scope.form.$valid) {
        // form invalid, do not submit
        return;
      }
      $scope.submitInProgress = true;
      Payments.requestUnappliedFundsPayout($scope.selections.amount, $scope.selections.account.BankAccountId).then(
        function (/*result*/) {
          $scope.submitInProgress = false;
          dialog.close($scope.selections);
        }, function (error) {
          $scope.submitInProgress = false;
          $scope.submitError = error || 'Unable to request a payout at this time. Please contact NextGear for assistance.';
        }
      );
    };

    $scope.cancel = function () {
      dialog.close();
    };
  });
