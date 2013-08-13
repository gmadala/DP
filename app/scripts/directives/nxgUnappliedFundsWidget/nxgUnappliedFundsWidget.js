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
                ' to your account "' + result.accountName +
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
    $scope.accounts = User.getStatics().BankAccounts;
    $scope.selections = {
      amount: undefined,
      accountId: undefined
    };

    $scope.getLocalErrors = function () {
      var form = $scope.form;
      if (form.$valid) {
        return [];
      }

      var msgs = [],
        amountErrors = form.payoutAmt.$error,
        accountErrors = form.payoutBankAcct.$error;

      if (amountErrors.required) {
        msgs.push('Please enter a payout request amount.');
      } else if (amountErrors.pattern) {
        msgs.push('Please enter payout request amount in the format 123.45 or 123');
      } else if (amountErrors.nxgMin || amountErrors.nxgMax) {
        var max = $filter('currency')($scope.funds.available);
        msgs.push('Payout request amount must be $0.01 to ' + max);
      }

      if (accountErrors.required) {
        msgs.push('Please select a bank account for payout.');
      }

      return msgs;
    };

    $scope.submit = function () {
      $scope.submitErrors = $scope.getLocalErrors();
      if ($scope.submitErrors.length > 0) {
        // local validation failed, do not submit
        return;
      }
      $scope.submitInProgress = true;
      Payments.requestUnappliedFundsPayout($scope.selections.amount, $scope.selections.accountId).then(
        function (/*result*/) {
          $scope.submitInProgress = false;
          var selected = angular.extend({}, $scope.selections, {
            accountName: $scope.accounts[$scope.selections.accountId]
          });
          dialog.close(selected);
        }, function (error) {
          $scope.submitInProgress = false;
          $scope.submitErrors = [error || 'Unable to request a payout at this time. Please contact NextGear for assistance.'];
        }
      );
    };

    $scope.cancel = function () {
      dialog.close();
    };
  });
