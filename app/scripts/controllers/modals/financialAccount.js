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

    $scope.accountValid = accountValid;
    $scope.confirmRequest = confirmRequest;
    $scope.close = closeDialog;

    // User cannot have an account that is not active and set as either a default disbursement or default payment
    function accountValid() {
      if( !$scope.account.IsActive && ($scope.account.IsDefaultDisbursement || $scope.account.IsDefaultPayment) ) {
        throw new Error('Account must be active for it to be set as default disbursement or default payment.');
      }
    }

    function confirmRequest (action) {
      $scope.validity = angular.copy($scope.financialAccountForm);
      if ($scope.validity.$valid) {
        $scope.accountValid();
        if(action === 'edit') {
          AccountManagement.updateBankAccount($scope.account).then(function () {
            dialog.close($scope.account);
          });
        }
        if(action === 'add') {
          AccountManagement.addBankAccount($scope.account).then(function () {
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
