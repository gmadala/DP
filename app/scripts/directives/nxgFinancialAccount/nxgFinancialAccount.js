'use strict';

angular.module('nextgearWebApp')
  .directive('nxgFinancialAccount', function (gettext, gettextCatalog) {

    /**
     * Adds the last 4 digits of the account name to the account only if the account name doesn't contain
     * these same 4 digits since users may commonly already use those numbers in the account name and it is not
     * useful to make the name unnecessarily long.
     * @param account
     */
    function getDescriptiveAccountName(account) {

      if (account.BankAccountName.indexOf(account.AccountNumberLast4Digits) > -1) {
        return account.BankAccountName;
      } else {
        return account.BankAccountName + ' - ' + account.AccountNumberLast4Digits;
      }
    }

    function getAccountStatus(account) {
      return account.IsActive ? gettext('Active') : gettext('Inactive');
    }

    function isDisplayed(account) {
      return account.AllowPaymentByAch;
    }

    return {
      templateUrl: 'scripts/directives/nxgFinancialAccount/nxgFinancialAccount.html',
      scope: {
        account: '=',
        defaultDisbursementBankAccountId: '=disbursementAccount',
        defaultBillingBankAccountId: '=billingAccount'
      },
      restrict: 'E',
      link: function (scope/*, element, attr */) {
        var generateDefaults = function () {
          var defaults = [];
          if (scope.account.BankAccountId === scope.defaultBillingBankAccountId) {
            defaults.push(gettextCatalog.getString('Default Payment'));
          }
          if (scope.account.BankAccountId === scope.defaultDisbursementBankAccountId) {
            defaults.push(gettextCatalog.getString('Default Disbursement'));
          }
          // TODO revisit how this is displayed should display this differently so that it will be better for i18n
          return defaults.join(', ');
        };
        scope.defaults = generateDefaults();
        scope.getDescriptiveAccountName = getDescriptiveAccountName.bind(null, scope.account);
        scope.getAccountStatus = getAccountStatus.bind(null, scope.account);
        scope.isDisplayed = isDisplayed.bind(null, scope.account);
      }
    };
  });

