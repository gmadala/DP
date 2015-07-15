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
    $scope.routingNumberDisplay = $scope.account.RoutingNumber;

    $scope.confirmAccountNumberValid = true;

    $scope.inputs = {};

    $scope.accountNumberRegex = /^\d{1,16}$/;
    $scope.routingNumberRegex = /^\d{9}$/;

    $scope.confirmRequest = confirmRequest;
    $scope.close = closeDialog;

    // User cannot have an account that is not active and set as either a default disbursement or default payment.
    function activeValid () {
      return $scope.account.IsActive || (!$scope.account.IsDefaultDisbursement && !$scope.account.IsDefaultPayment);
    }

    function confirmAccountNumberValid () {
      return $scope.account.AccountNumber === $scope.inputs.confirmAccountNumber;
    }

    function confirmRequest (action) {
      $scope.validity = angular.copy($scope.financialAccountForm);
      $scope.activeValid = activeValid();
      $scope.confirmAccountNumberValid = action === 'edit' || confirmAccountNumberValid();

      if ($scope.validity.$valid && $scope.activeValid && $scope.confirmAccountNumberValid) {
        if(action === 'edit') {
          AccountManagement.updateBankAccount($scope.account).then(function () {
            dialog.close($scope.account);
          });
        }
        if(action === 'add') {
          AccountManagement.addBankAccount($scope.account).then(function (bankAccountId) {
            $scope.account.AccountId = bankAccountId;
            dialog.close($scope.account);
          });
        }
      }
    }

    function closeDialog() {
      dialog.close();
    }
  }

})();
