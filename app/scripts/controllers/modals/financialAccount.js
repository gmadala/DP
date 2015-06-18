(function () {
  'use strict';

  angular.module('nextgearWebApp')
    .controller('FinancialAccountCtrl', FinancialAccountCtrl);

  FinancialAccountCtrl.$inject = ['$scope', 'AccountManagement', 'dialog', 'options'];

  function FinancialAccountCtrl($scope, AccountManagement, dialog, options) {
    $scope.account = options.account || {};
    $scope.defaultForBilling = options.defaultForBilling;
    $scope.defaultForDisbursement = options.defaultForDisbursement;

    var accountNumber = $scope.account.AccountNumber;
    $scope.accountNumberDisplay = accountNumber ? '******' + accountNumber.substr(accountNumber.length - 4) : '';
    $scope.routingNumberDisplay = $scope.account.RoutingtNumber;

    $scope.confirmRequest = confirmRequest;
    $scope.close = closeDialog;

    function confirmRequest () {
      $scope.validity = angular.copy($scope.financialAccountForm);
      if ($scope.validity.$valid) {
        if (!$scope.account.AccountId) {
          $scope.account.AccountNumber = $scope.accountNumberDisplay;
          $scope.account.RoutingtNumber = $scope.routingNumberDisplay;
        }
        AccountManagement.updateBankAccount($scope.account).then(function (updatedBankAccount) {
          dialog.close(updatedBankAccount);
        });
      }
    }

    function closeDialog() {
      dialog.close();
    }
  }

})();
