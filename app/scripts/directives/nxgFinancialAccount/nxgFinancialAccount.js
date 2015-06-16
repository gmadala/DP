(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgFinancialAccount', financialAccount);

  /**
   * Directive for rendering a bank account - currently used in account management
   */
  function financialAccount(gettext, $dialog, features) {

    var directive = {
      link: link,
      templateUrl: 'scripts/directives/nxgFinancialAccount/nxgFinancialAccount.html',
      scope: {
        account: '=',
        defaultDisbursementBankAccountId: '=disbursementAccount',
        defaultBillingBankAccountId: '=billingAccount'
      },
      restrict: 'E'
    };

    return directive;

    function link(scope) {

      scope.descriptiveName = getDescriptiveName();
      scope.status = getStatus();
      scope.displayed = isDisplayed();
      scope.defaultForBilling = isDefaultForBilling();
      scope.defaultForDisbursement = isDefaultForDisbursement();
      scope.editFinancialAccount = editFinancialAccount;
      scope.editBankAccount = features.editBankAccount.enabled;

      /**
       * Adds the last 4 digits of the account name to the account only if the account name doesn't contain
       * these same 4 digits since users may commonly already use those numbers in the account name and it is not
       * useful to make the name unnecessarily long.
       * @param account
       */
      function getDescriptiveName() {

        var account = scope.account;

        if (account.BankAccountName.indexOf(account.AchAccountNumberLast4) > -1) {
          return account.BankAccountName;
        } else {
          return account.BankAccountName + ' - ' + account.AchAccountNumberLast4;
        }
      }

      function getStatus() {
        return scope.account.IsActive ? gettext('Active') : gettext('Inactive');
      }

      function isDisplayed() {
        return scope.account.AllowPaymentByAch;
      }

      function isDefaultForBilling() {
        return scope.account.BankAccountId === scope.defaultBillingBankAccountId;
      }

      function isDefaultForDisbursement() {
        return scope.account.BankAccountId === scope.defaultDisbursementBankAccountId;
      }

      function editFinancialAccount() {
        var dialogOptions = {
          dialogClass: 'modal',
          backdrop: true,
          keyboard: false,
          backdropClick: false,
          templateUrl: 'views/modals/financialAccount.html',
          resolve: {
            options: function () {
              return {
                account: angular.copy(scope.account),
                defaultForBilling: scope.defaultForBilling,
                defaultForDisbursement: scope.defaultForDisbursement
              };
            }
          },
          controller: 'FinancialAccount'
        };

        $dialog.dialog(dialogOptions).open();
      }
    }
  }

})();

