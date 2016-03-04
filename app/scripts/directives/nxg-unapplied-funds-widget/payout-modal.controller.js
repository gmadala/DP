(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('PayoutModalCtrl', PayoutModalCtrl);

  PayoutModalCtrl.$inject = ['$scope', '$uibModalInstance', 'funds', 'User', 'Payments', 'OptionDefaultHelper'];

  function PayoutModalCtrl($scope, $uibModalInstance, funds, User, Payments, OptionDefaultHelper) {

    var uibModalInstance = $uibModalInstance;

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
          uibModalInstance.close(resultData);
        }, function (/*error*/) {
          $scope.submitInProgress = false;
        }
      );
    };

    $scope.cancel = function () {
      uibModalInstance.close();
    };

  }
})();
