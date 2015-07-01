(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgFinancialAccount', financialAccount);

  /**
   * Directive for rendering a bank account - currently used in account management
   */
  function financialAccount(gettext, $dialog, AccountManagement, features) {

    var directive;
    directive = {
      link: link,
      templateUrl: 'scripts/directives/nxgFinancialAccount/nxgFinancialAccount.html',
      scope: {
        account: '=',
        defaultDisbursementBankAccountId: '=disbursementAccount',
        defaultBillingBankAccountId: '=billingAccount',
        updateBillingAccount: '&',
        updateDisbursementAccount: '&'
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
      scope.editBankAccountEnabled = features.editBankAccount.enabled;

      /**
       * Adds the last 4 digits of the account name to the account only if the account name doesn't contain
       * these same 4 digits since users may commonly already use those numbers in the account name and it is not
       * useful to make the name unnecessarily long.
       * @param account
       */
      function getDescriptiveName() {

        var account = scope.account;

        var partialAccountNumber = account.AchAccountNumberLast4.toString();
        if (account.BankAccountName.indexOf(partialAccountNumber) > -1) {
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
              var options = {
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

        $dialog.dialog(dialogOptions).open().then(function (updatedAccount) {
          if (updatedAccount) {
            if (updatedAccount.IsDefaultPayment) {
              scope.updateBillingAccount({billingAccountId: updatedAccount.AccountId});
            }
            if (updatedAccount.IsDefaultDisbursement) {
              scope.updateDisbursementAccount({disbursementAccountId: updatedAccount.AccountId});
            }
            scope.account.AchBankName = updatedAccount.BankName;
            scope.status = updatedAccount.IsActive ? gettext('Active') : gettext('Inactive');

            var description = updatedAccount.AccountName;
            var partialAccountNumber = scope.account.AchAccountNumberLast4.toString();
            if (updatedAccount.AccountName.indexOf(partialAccountNumber) === -1) {
              description = updatedAccount.AccountName + ' - ' + scope.account.AchAccountNumberLast4;
            }
            scope.descriptiveName = description;
          }
        });
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

