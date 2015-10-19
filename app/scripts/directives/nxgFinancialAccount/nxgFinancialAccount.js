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
      scope.editFinancialAccount = editFinancialAccount;
      scope.editBankAccountEnabled = User.getFeatures().hasOwnProperty('editBankAccount') ? User.getFeatures().editBankAccount.enabled : true;
      scope.isEditable = isEditable;
      scope.isRecentDate = isRecentDate();
      scope.isNoRecentDate = isNoRecentDate();
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
        scope.bankName = scope.dirtyBankName;
        scope.status = scope.dirtyStatus;
      };
      scope.saveAccount = function(){
        AccountManagement.getBankAccount(scope.account.BankAccountId)
          .then(function (bankAccount){
            bankAccount.IsActive = getStatus();
            bankAccount.BankName = getBankName();
            return AccountManagement.updateBankAccount(bankAccount);
          });
        scope.editMode = false;
      };

      function isRecentDate(){
        if(scope.recentTransaction !== undefined){
          scope.RecentTransaction = moment(scope.recentTransaction.MaxDate).format('YYYY-MM-DD');
          return true;
        } else {
          return false;
        }
      }

      scope.recentTransactionExists = recentTransactionExists();

      scope.recentTransactionId = '';
      scope.recentTransactionDate = gettextCatalog.getString('n/a');
      if (scope.recentTransactionExists) {
        scope.recentTransactionId = scope.recentTransaction.FinancialTransactionId;
        scope.recentTransactionDate = $filter('moment')(scope.recentTransaction.MaxDate);
      }

      function isNoRecentDate(){
        if(scope.recentTransaction === undefined) {
          return true;
        } else {
          return false;
        }
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

      /**
       * Provides the bank name for the select account
       * @returns {string|string|*|string|string}
       */
      function getBankName(){
        return scope.account.AchBankName;
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

      /**
       * Opens the edit bank account modal and processes the user's changes if
       * a bank account is changed.
       * @return {void}
       */

      scope.edit = function(){
        scope.editMode = true;
      };
      function editFinancialAccount() {
        var dialogOptions = {
          dialogClass: 'modal',
          backdrop: true,
          keyboard: false,
          backdropClick: false,
          templateUrl: 'views/modals/financialAccount.html',
          resolve: {
            options: function () {
              var options = {
                modal: 'edit',
                defaultForBilling: scope.defaultForBilling,
                defaultForDisbursement: scope.defaultForDisbursement
              };
              return AccountManagement.getBankAccount(scope.account.BankAccountId).then(function (bankAccount) {
                angular.extend(options, {
                  account: bankAccount
                });
                return options;
              });
            }
          },
          controller: 'FinancialAccountCtrl'
        };

        $dialog.dialog(dialogOptions).open()
          .then(updateLocalFinancialData);

        /**
         * Helper function: Propogate bank account changes to local data to
         * keep consistent with endpoint data.
         * @param  {Object} updatedAccount The edited bank account.
         * @return {void}
         */
        function updateLocalFinancialData (updatedAccount) {
          if (updatedAccount) {
            // Refresh cached endpoint info for active bank accounts. See /Dealer/v1_2/Info/.
            User.refreshInfo();

            if (updatedAccount.IsDefaultPayment) {
              scope.updateBillingAccount({billingAccountId: updatedAccount.AccountId});
            }
            if (updatedAccount.IsDefaultDisbursement) {
              scope.updateDisbursementAccount({disbursementAccountId: updatedAccount.AccountId});
            }
            scope.account.AchBankName = updatedAccount.BankName;
            scope.status = updatedAccount.IsActive;
          }
        }
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
