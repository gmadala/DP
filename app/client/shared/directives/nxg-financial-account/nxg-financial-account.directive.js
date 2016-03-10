(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgFinancialAccount', nxgFinancialAccount);

  nxgFinancialAccount.$inject = [
    'gettext',
    'gettextCatalog',
    '$filter',
    'AccountManagement',
    'User',
    'routingNumberFilter',
    'moment',
    'api'
  ];
  /**
   * Directive for rendering a bank account - currently used in account management
   */
  function nxgFinancialAccount(
    gettext,
    gettextCatalog,
    $filter,
    AccountManagement,
    User,
    routingNumberFilter,
    moment,
    api) {

    var directive;
    directive = {
      link: link,
      templateUrl: 'client/shared/directives/nxg-financial-account/nxg-financial-account.html',
      scope: {
        account: '=',
        defaultDepositId: '=',
        defaultPaymentId: '=',
        isStakeholderActive: '=',
        isUnitedStates: '=',
        refreshActiveAchAccounts: '&',
        recentTransaction: '='
      },
      restrict: 'E'
    };

    return directive;

    function link(scope) {

      gettext('n/a');

      scope.status = getStatus();
      scope.bankName = getBankName();
      scope.displayed = isDisplayed();

      scope.routingNumberLabel = routingNumberFilter('', scope.isUnitedStates, true);
      scope.routingNumberDisplay = routingNumberFilter(scope.account.AchAbaNumber, scope.isUnitedStates, false);

      var features = User.getFeatures();
      scope.editBankAccountEnabled = features.hasOwnProperty('editBankAccount') ? features.editBankAccount.enabled : true;

      scope.defaultForBilling = isDefaultForBilling;
      scope.defaultForDisbursement = isDefaultForDisbursement;

      scope.transactionId = scope.recentTransaction !== undefined ? scope.recentTransaction.FinancialTransactionId :'' ;

      scope.isEditable = isEditable;
      scope.generateReceipt = generateReceipt;
      scope.editMode = false;

      scope.dirtyBankName = null;
      scope.dirtyStatus = null;

      scope.editAccount = editAccount;
      scope.cancelAccount = cancelAccount;
      scope.saveAccount = saveAccount;

      scope.recentTransactionExists = recentTransactionExists();

      scope.recentTransactionId = '';
      scope.recentTransactionDate = gettextCatalog.getString('n/a');
      if (scope.recentTransactionExists) {
        scope.recentTransactionId = scope.recentTransaction.FinancialTransactionId;
        scope.recentTransactionDate = $filter('moment')(scope.recentTransaction.MaxDate);
      }

      scope.generateReceipt = generateReceipt;

      /**
       * Switch bank account row to inline edit mode and keep the original value for status and bank name which can be
       * used when the user cancel the edit.
       */
      function editAccount() {
        scope.editMode = true;
        scope.dirtyStatus = getStatus();
        scope.dirtyBankName = getBankName();
      }

      /**
       * Switch to view mode from inline edit mode and restore the original status and bank name value.
       */
      function cancelAccount() {
        scope.editMode = false;
        scope.dirtyStatus = getStatus();
        scope.dirtyBankName = getBankName();
      }

      /**
       * Save changes made in the inline edit.
       */
      function saveAccount() {
        AccountManagement.getBankAccount(scope.account.BankAccountId)
          .then(function (bankAccount) {
            bankAccount.IsActive = scope.dirtyStatus;
            bankAccount.BankName = scope.dirtyBankName;
            return AccountManagement.updateBankAccount(bankAccount);
          })
          .then(function () {
            scope.refreshActiveAchAccounts({});
            setStatus(scope.dirtyStatus);
            setBankName(scope.dirtyBankName);
          })
          .catch(function () {
            scope.dirtyStatus = getStatus();
            scope.dirtyBankName = getBankName();
          });
        scope.editMode = false;
      }

      /**
       * Check if the current bank account have recent date or not.
       * @returns {boolean} true if the current bank account have recent transaction.
       */
      function recentTransactionExists() {
        return scope.recentTransaction !== undefined;
      }

      /**
       * Provides the correct string in the user's language to the account status
       * field. Default if the field is not available will return false.
       * @return {Boolean} Translated string value for account status field.
       */
      function getStatus() {
        return scope.account.IsActive || false;
      }

      function setStatus(newStatus){
        scope.account.IsActive = newStatus;
      }

      /**
       * Provides the bank name for the select account
       * @returns {string|string|*|string|string}
       */
      function getBankName(){
        return scope.account.AchBankName;
      }

      function setBankName(newBankName){
        scope.account.AchBankName = newBankName;
      }

      function isDisplayed() {
        return scope.account.AllowPaymentByAch;
      }

      /**
       * Determines if the current user should be allowed to edit a bank account.
       * @return {Boolean} Allowed to edit a bank account?
       */
      function isEditable() {
        return scope.editBankAccountEnabled && scope.isStakeholderActive && scope.isUnitedStates;
      }

      /**
       * Determines if the bank account is the user's default billing account.
       * @return {Boolean} Account default billing account?
       */
      function isDefaultForBilling() {
        return scope.account.BankAccountId === scope.defaultPaymentId;
      }

      /**
       * Determines if the bank account is the user's default disbursement account.
       * @return {Boolean} Account default disbursement account?
       */
      function isDefaultForDisbursement() {
        return scope.account.BankAccountId === scope.defaultDepositId;
      }

      function generateReceipt(){
        var strUrl =  api.contentLink('/receipt/view/' + scope.recentTransactionId + '/receipt');
        window.open(strUrl, '_blank');
      }
    }

  }
})();
