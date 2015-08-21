(function() {
  'use strict';

  angular.module('nextgearWebApp')
    .controller('FinancialAccountCtrl', FinancialAccountCtrl);

  FinancialAccountCtrl.$inject = ['$scope', 'AccountManagement', 'dialog', 'options', 'segmentio', 'metric'];

  function FinancialAccountCtrl($scope, AccountManagement, dialog, options, segmentio, metric) {
    $scope.account = options.account || {};
    $scope.defaultForBilling = options.defaultForBilling;
    $scope.defaultForDisbursement = options.defaultForDisbursement;

    var accountNumber = $scope.account.AccountNumber;
    $scope.accountNumberDisplay = accountNumber ? '******' + lastFour(accountNumber) : '';
    $scope.routingNumberDisplay = $scope.account.RoutingNumber;

    $scope.inputs = {
      confirmAccountNumber: ''
    };
    $scope.isAccountNumberValid = false;
    $scope.tosVisited = false;

    $scope.accountNumberRegex = /^\d{1,16}$/;
    $scope.routingNumberRegex = /^\d{9}$/;

    /* Discover limits account and bank name to 50 chars but account name appends 7 chars to bank name when adding account.
     * If there ever comes a point where bank name exceeds 43 character, will need to refactor to be consistent between
     * front-end max-length and discover max-length for account and bank name */
    $scope.maxBankLength = 43;

    $scope.isAddModal = isAddModal();
    $scope.isEditModal = isEditModal();
    $scope.visitTOS = visitTOS;

    $scope.confirmRequest = confirmRequest;
    $scope.close = closeDialog;

    /**
     * Decides whether the modal is an add bank account modal.
     * @return {Boolean} Is modal an add modal?
     */
    function isAddModal() {
      return options.modal === 'add';
    }

    /**
     * Decides if the modal is an edit bank account modal.
     * @return {Boolean} Is modal an edit modal?
     */
    function isEditModal() {
      return options.modal === 'edit';
    }

    /**
     * Toggles all relevant flags regarding the Terms of Service to true.
     * @return {void}
     */
    function visitTOS() {
      if (!$scope.tosVisited) {
        $scope.account.TOSAcceptanceFlag = true;
      }
      $scope.tosVisited = true;
    }

    /**
     * Formats a string to the following format last4Char - suffix
     * @param  {String} str    The string to take the last 4 characters from.
     * @param  {String} suffix The string to append after the last 4 characters.
     * @return {String}        last4CharOfStr - suffix
     */
    function lastFour(str, suffix) {
      suffix = suffix || '';
      var charFromEnd = str.length < 4 ? str.length : 4;
      return !!str ? str.substr(str.length - charFromEnd) + suffix : '';
    }
    /**
     * A group of non-native angular validation steps performed to ensure a valid bank account submission.
     * @return {Boolean} Is the submission a valid bank account?
     */
    function isValidSubmission() {
      // User cannot have an account that is not active and set as either a default disbursement or default payment.
      var isActiveValid = $scope.account.IsActive || (!$scope.account.IsDefaultDisbursement && !$scope.account.IsDefaultPayment);
      $scope.isAccountNumberValid = $scope.account.AccountNumber === $scope.inputs.confirmAccountNumber;

      return isActiveValid && ($scope.isEditModal || ($scope.isAccountNumberValid && $scope.account.TOSAcceptanceFlag));
    }

    /**
     * Submits the bank account and closes the dialog after checking a series
     * of validation steps.
     * @return {void}
     */
    function confirmRequest() {
      $scope.validity = angular.copy($scope.financialAccountForm);
      var validSubmission = isValidSubmission();

      if ($scope.validity.$valid && validSubmission) {
        if ($scope.isEditModal) {
          AccountManagement.updateBankAccount($scope.account).then(function() {
            segmentio.track(metric.DEALER_EDIT_BANK_ACCOUNT);
            dialog.close($scope.account);
          });
        } else if ($scope.isAddModal) {
          $scope.account.AccountName = $scope.account.BankName;
          AccountManagement.addBankAccount($scope.account).then(function(bankAccountId) {
            segmentio.track(metric.DEALER_ADD_BANK_ACCOUNT);
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

    /**
     * Closes the dialog.
     * @return {void}
     */
    function closeDialog() {
      dialog.close();
    }

    $scope.$watch(accountNumberAndBankName, updateAccountNameDisplay);

    /**
     * Helper function to watch both account.bankName and account.Number.
     * @return {String} account.bankName + account.accountNumber
     */
    function accountNumberAndBankName () {
      return $scope.account.AccountNumber + $scope.account.BankName;
    }

    /**
     * Updates the displayed account.accountName.
     * @return {void}
     */
    function updateAccountNameDisplay () {
      var bankName = $scope.account.BankName;
      var accNumber = $scope.account.AccountNumber;

      $scope.accountNameDisplay = (bankName && accNumber) ? lastFour(accNumber, ' - ') + bankName : '';
    }
  }

})();
