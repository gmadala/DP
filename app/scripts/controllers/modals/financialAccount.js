(function () {
  'use strict';

  angular.module('nextgearWebApp')
    .controller('FinancialAccountCtrl', FinancialAccountCtrl);

  FinancialAccountCtrl.$inject = ['$scope', 'AccountManagement', 'dialog', 'options'];

  function FinancialAccountCtrl($scope, AccountManagement, dialog, options) {
    $scope.account = options.account || {};
    $scope.defaultForBilling = options.defaultForBilling;
    $scope.defaultForDisbursement = options.defaultForDisbursement;
    $scope.modal = options.modal;

    var accountNumber = $scope.account.AccountNumber;
    $scope.accountNumberDisplay = accountNumber ? '******' + lastFour(accountNumber) : '';
    $scope.routingNumberDisplay = $scope.account.RoutingNumber;

    $scope.confirmAccountNumberValid = true;

    $scope.inputs = {
      confirmAccountNumber: ''
    };

    $scope.accountNumberRegex = /^\d{1,16}$/;
    $scope.routingNumberRegex = /^\d{9}$/;

    /* Discover limits account and bank name to 50 chars but account name appends 7 chars to bank name when adding account.
     * If there ever comes a point where bank name exceeds 43 character, will need to refactor to be consistent between
     * front-end max-length and discover max-length for account and bank name */
    $scope.maxBankLength = 43;

    $scope.confirmRequest = confirmRequest;
    $scope.close = closeDialog;

    function lastFour(str, suffix) {
      suffix = suffix || '';
      var charFromEnd = str.length < 4 ? str.length : 4;
      return !!str ? str.substr(str.length - charFromEnd) + suffix : '';
    }

    // User cannot have an account that is not active and set as either a default disbursement or default payment.
    function activeValid () {
      return $scope.account.IsActive || (!$scope.account.IsDefaultDisbursement && !$scope.account.IsDefaultPayment);
    }

    function confirmAccountNumberValid () {
      return $scope.modal === 'edit' || $scope.account.AccountNumber === $scope.inputs.confirmAccountNumber;
    }

    function confirmRequest () {
      $scope.validity = angular.copy($scope.financialAccountForm);
      $scope.activeValid = activeValid();
      $scope.confirmAccountNumberValid = confirmAccountNumberValid();

      if ($scope.validity.$valid && $scope.activeValid && $scope.confirmAccountNumberValid) {
        if($scope.modal === 'edit') {
          AccountManagement.updateBankAccount($scope.account).then(function () {
            dialog.close($scope.account);
          });
        }
        else if($scope.modal === 'add') {
          $scope.account.AccountName = $scope.account.BankName;
          AccountManagement.addBankAccount($scope.account).then(function (bankAccountId) {
            $scope.account.AccountId = bankAccountId;
            dialog.close($scope.account);
          });
        }
        // Fail gracefully if somehow modal was opened
        else {
          dialog.close();
        }
      }
    }

    function closeDialog() {
      dialog.close();
    }

    $scope.$watch(
      function() {
        return $scope.account.BankName + $scope.account.AccountNumber;
      },
      function() {
        var bankName = $scope.account.BankName;
        var accNumber = $scope.account.AccountNumber;

        $scope.accountNameDisplay = (bankName && accNumber) ? lastFour(accNumber, ' - ') + bankName : '';
      }
    );
  }

})();
