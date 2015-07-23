(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgFinancialAccount', financialAccount);

  /**
   * Directive for rendering a bank account - currently used in account management
   */
  function financialAccount(gettext, $dialog, AccountManagement, User, features, routingNumberFilter) {

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
        isUnitedStates: '='
      },
      restrict: 'E'
    };

    return directive;

    function link(scope) {

      scope.status = getStatus();
      scope.displayed = isDisplayed();
      scope.defaultForBilling = isDefaultForBilling();
      scope.defaultForDisbursement = isDefaultForDisbursement();
      scope.routingNumberLabel = routingNumberFilter('', scope.isUnitedStates, true);
      scope.routingNumberDisplay = routingNumberFilter(scope.account.AchAbaNumber, scope.isUnitedStates, false);
      scope.editFinancialAccount = editFinancialAccount;
      scope.editBankAccountEnabled = features.editBankAccount.enabled;
      scope.isEditable = isEditable;

      function getStatus() {
        return scope.account.IsActive ? gettext('Active') : gettext('Inactive');
      }

      function isDisplayed() {
        return scope.account.AllowPaymentByAch;
      }

      function isEditable() {
        return scope.editBankAccountEnabled && scope.isStakeholderActive && scope.isUnitedStates;
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

        $dialog.dialog(dialogOptions).open().then(function (updatedAccount) {
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
            scope.status = updatedAccount.IsActive ? gettext('Active') : gettext('Inactive');
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

