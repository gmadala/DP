(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgFinancialAccount', financialAccount);

  /**
   * Directive for rendering a bank account - currently used in account management
   */
  function financialAccount(gettext, gettextCatalog, $dialog, AccountManagement, User, routingNumberFilter, moment, api) {

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

      gettext('Not Applicable');

      scope.status = getStatus();
      scope.displayed = isDisplayed();
      scope.defaultForBilling = isDefaultForBilling();
      scope.defaultForDisbursement = isDefaultForDisbursement();
      scope.routingNumberLabel = routingNumberFilter('', scope.isUnitedStates, true);
      scope.routingNumberDisplay = routingNumberFilter(scope.account.AchAbaNumber, scope.isUnitedStates, false);
      scope.editFinancialAccount = editFinancialAccount;
      scope.editBankAccountEnabled = User.getFeatures().hasOwnProperty('editBankAccount') ? User.getFeatures().editBankAccount.enabled : true;
      scope.isEditable = isEditable;

      scope.recentTransactionId = '';
      scope.recentTransactionDate = gettextCatalog.getString('Not Applicable');
      if (!recentTransactionExists()) {
        scope.recentTransactionId = scope.recentTransaction.FinancialTransactionId;
        scope.recentTransactionDate = moment(scope.recentTransaction.MaxDate).format('YYYY-MM-DD');
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
