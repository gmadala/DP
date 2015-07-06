(function () {
  'use strict';

  angular.module('nextgearWebApp')
    .controller('FinancialAccountCtrl', FinancialAccountCtrl);

  FinancialAccountCtrl.$inject = ['$scope', 'AccountManagement', 'dialog', 'options'];

  function FinancialAccountCtrl($scope, AccountManagement, dialog, options) {
    $scope.account = options.account || {};
    console.log($scope.account);

    $scope.defaultForBilling = options.defaultForBilling;
    $scope.defaultForDisbursement = options.defaultForDisbursement;

    var accountNumber = $scope.account.AccountNumber;
    $scope.accountNumberDisplay = accountNumber ? '******' + accountNumber.substr(accountNumber.length - 4) : '';
    $scope.routingNumberDisplay = $scope.account.RoutingNumber;

    $scope.confirmRequest = confirmRequest;
    $scope.close = closeDialog;

    function confirmRequest () {
      $scope.validity = angular.copy($scope.financialAccountForm);
      console.log($scope.financialAccountForm);
      if ($scope.validity.$valid) {
        if (!$scope.account.AccountId) {
          $scope.account.AccountNumber = $scope.accountNumberDisplay;
          $scope.account.RoutingNumber = $scope.routingNumberDisplay;
        }

        console.log($scope.account);

        AccountManagement.updateBankAccount($scope.account).then(function () {
          dialog.close($scope.account);
        });
      }
    }

    function closeDialog() {
      dialog.close();
    }
  }

})();
