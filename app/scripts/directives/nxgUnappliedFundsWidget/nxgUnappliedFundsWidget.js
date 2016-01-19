'use strict';

angular.module('nextgearWebApp')
  .directive('nxgUnappliedFundsWidget', function () {
    return {
      templateUrl: 'scripts/directives/nxgUnappliedFundsWidget/nxgUnappliedFundsWidget.html',
      restrict: 'AC',
      replace: true,
      scope: {
        fundsBalance: '=balance',
        fundsAvail: '=available'
      },
      controller: 'UnappliedFundsWidgetCtrl'
    };
  })
  .controller('UnappliedFundsWidgetCtrl', function ($scope, $modal, $filter, api, gettextCatalog, AccountManagement) {

    AccountManagement.get().then(function (result) {
      $scope.autoDisburseUnappliedFunds = result.AutoDisburseUnappliedFundsDaily;
    });


    $scope.openRequestPayout = function($event) {
      $event.preventDefault();

      var dialogOptions = {
        dialogClass: 'modal request-unapplied-funds-modal',
        backdrop: true,
        keyboard: false,
        backdropClick: false,
        templateUrl: 'scripts/directives/nxgUnappliedFundsWidget/requestPayoutModal.html',
        controller: 'PayoutModalCtrl',
        resolve: {
          funds: function () {
            return {
              balance: $scope.fundsBalance,
              available: $scope.fundsAvail
            };
          }
        }
      };

      $modal.dialog(dialogOptions).open().then(
        function (result) {
          if (result) {
            // ** The endpoint returns a single updated balance but we got two
            // to update (total, available) so we update manually **
            result.amount = api.toFloat(result.amount);
            $scope.fundsAvail -= Math.min(result.amount, $scope.fundsAvail);
            $scope.fundsBalance -= Math.min(result.amount, $scope.fundsBalance);

            // wireframes do not specify any kind of success display, so let's just do a simple one
            var title = gettextCatalog.getString('Request submitted'),
              msg = gettextCatalog.getString('Your request for a payout in the amount of {{ amount }} to your account "{{ bankAccountName }}" has been successfully submitted.', {
                amount: $filter('currency')(result.amount),
                bankAccountName: result.account.BankAccountName
              }),
              buttons = [{label: gettextCatalog.getString('OK'), cssClass: 'btn-cta cta-primary'}];
            $modal.messageBox(title, msg, buttons).open();
          }
        }
      );
    };
  })
  .controller('PayoutModalCtrl', function($scope, $filter, $timeout, dialog, funds, User, Payments, OptionDefaultHelper) {
    $scope.funds = funds;
    $scope.selections = {
      amount: null,
      account: null
    };

    User.getInfo().then(function(info) {
      $scope.bankAccounts = info.BankAccounts;

      OptionDefaultHelper.create([
        {
          scopeSrc: 'bankAccounts',
          modelDest: 'account'
        }
      ]).applyDefaults($scope, $scope.selections);
    });

    $scope.submit = function () {
      // take a snapshot of form state -- view can bind to this for submit-time update of validation display
      $scope.validity = angular.copy($scope.form);
      if (!$scope.form.$valid) {
        // form invalid, do not submit
        return;
      }
      $scope.submitInProgress = true;
      Payments.requestUnappliedFundsPayout($scope.selections.amount, $scope.selections.account.BankAccountId).then(
        function (result) {
          $scope.submitInProgress = false;
          var resultData = angular.extend({}, $scope.selections, {
            newAvailableAmount: result.BalanceAfter
          });
          dialog.close(resultData);
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

    $scope.cancel = function () {
      dialog.close();
    };
  });
