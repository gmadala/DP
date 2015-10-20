(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgFinancialAccount', financialAccount);

  /**
   * Directive for rendering a bank account - currently used in account management
   */
  function financialAccount(gettext, gettextCatalog, $dialog, $filter, AccountManagement, User, routingNumberFilter, moment, api) {

    var directive;
    directive = {
      link: link,
      templateUrl: 'scripts/directives/nxgFinancialAccount/nxgFinancialAccount.html',
      scope: {
        account: '=',
        defaultDisbursementBankAccountId: '=disbursementAccount',
        defaultBillingBankAccountId: '=billingAccount',
        updateBillingAccount: '&',
        updateDisbursementAccount: '&',
        isStakeholderActive: '=',
        isUnitedStates: '=',
        getFinancialData: '&',
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
      scope.defaultForBilling = isDefaultForBilling();
      scope.defaultForDisbursement = isDefaultForDisbursement();
      scope.routingNumberLabel = routingNumberFilter('', scope.isUnitedStates, true);
      scope.routingNumberDisplay = routingNumberFilter(scope.account.AchAbaNumber, scope.isUnitedStates, false);
      scope.editBankAccountEnabled = User.getFeatures().hasOwnProperty('editBankAccount') ? User.getFeatures().editBankAccount.enabled : true;
      scope.isEditable = isEditable;
      scope.transactionId = scope.recentTransaction !== undefined ? scope.recentTransaction.FinancialTransactionId :'' ;
      scope.generateReceipt = generateReceipt;
      scope.editMode = false;

      scope.dirtyBankName = null;
      scope.dirtyStatus = null;
      scope.editAccount = function(){
        scope.editMode=true;
        scope.dirtyBankName = getBankName();
        scope.dirtyStatus = getStatus();
      };
      scope.cancelAccount = function(){
        scope.editMode=false;
        setBankName(scope.dirtyBankName);
        setStatus(scope.dirtyStatus);
      };
      scope.saveAccount = function(){
        AccountManagement.getBankAccount(scope.account.BankAccountId)
          .then(function (bankAccount){
            bankAccount.IsActive = getStatus();
            bankAccount.BankName = getBankName();
            AccountManagement.updateBankAccount(bankAccount).then(function(){
              scope.getFinancialData({});
            });
          });
        scope.editMode = false;
      };

      scope.recentTransactionExists = recentTransactionExists();

      scope.recentTransactionId = '';
      scope.recentTransactionDate = gettextCatalog.getString('n/a');
      if (scope.recentTransactionExists) {
        scope.recentTransactionId = scope.recentTransaction.FinancialTransactionId;
        scope.recentTransactionDate = $filter('moment')(scope.recentTransaction.MaxDate);
      }

      scope.generateReceipt = generateReceipt;

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
        return scope.account.BankAccountId === scope.defaultBillingBankAccountId;
      }

      /**
       * Determines if the bank account is the user's default disbursement account.
       * @return {Boolean} Account default disbursement account?
       */
      function isDefaultForDisbursement() {
        return scope.account.BankAccountId === scope.defaultDisbursementBankAccountId;
      }

      function generateReceipt(){
        var strUrl =  api.contentLink('/receipt/view/' + scope.recentTransactionId + '/Receipt');
        window.open(strUrl, '_blank');
      }

      scope.$watch('defaultBillingBankAccountId', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          scope.defaultForBilling = isDefaultForBilling();
        }
      });

      scope.$watch('defaultDisbursementBankAccountId', function(newVal, oldVal) {
        if (newVal !== oldVal) {
          scope.defaultForDisbursement = isDefaultForDisbursement();
        }
      });
    }
  }

})();
