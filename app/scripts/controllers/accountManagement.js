'use strict';

angular.module('nextgearWebApp')
  .controller('AccountManagementCtrl', AccountManagementCtrl)
  .controller('ConfirmCtrl', ConfirmCtrl);

function AccountManagementCtrl($scope, $dialog, AccountManagement, Addresses, gettext,
                               User, api, $q, dealerCustomerSupportPhone, segmentio, metric,
                               routingNumberFilter) {

  segmentio.track(metric.DEALER_VIEW_ACCOUNT_MANAGEMENT_PAGE);

  $scope.loading = false;
  $scope.isUnitedStates = User.isUnitedStates();
  $scope.isDealer = User.isDealer();
  $scope.autoPayEnabled = User.getFeatures().hasOwnProperty('autoPay') ? User.getFeatures().autoPay.enabled : true;
  $scope.contactInfoEnabled = User.getFeatures().hasOwnProperty('contactInfo') ? User.getFeatures().contactInfo.enabled : true;
  $scope.addBankAccountEnabled = User.getFeatures().hasOwnProperty('addBankAccount') ? User.getFeatures().addBankAccount.enabled : true;
  $scope.editBankAccountEnabled = User.getFeatures().hasOwnProperty('editBankAccount') ? User.getFeatures().editBankAccount.enabled : true;
  $scope.editDefaultAccount = false;
  $scope.getFinancialData = getFinancialData;


  //to retreive the latest transaction date
  if ($scope.isDealer) {
    AccountManagement.getTransactionDate().then(function (results) {
      $scope.recentTransactions = results;
    });
  }
  $scope.getLatestTransaction = function (bankAccountId) {
    return _.find($scope.recentTransactions, function (recentTransaction) {
      return recentTransaction.BankAccountId === bankAccountId;
    });
  };

  /**
   * Format the customer support phone for the address settings help text
   */
  dealerCustomerSupportPhone.then(function (phoneNumber) {
    $scope.customerSupportPhone = phoneNumber.formatted;
  });

  /**
   * Generic functions for edit, cancel, save, and success
   * Can be used for business settings, address settings, and [brand] settings
   * @type {{edit: Function, cancel: Function, save: Function, saveSuccess: Function}}
   */
  var prv = {
    edit: function () {
      this.dirtyData = angular.copy(this.data);
      this.editable = true;
    },
    cancel: function () {
      this.dirtyData = this.validation = null;
      this.editable = false;
    },
    save: function () {
      if (!this.validate()) {
        return false;
      }
      if (!this.isDirty()) {
        this.cancel();
        return false;
      }
      return true;
    },
    saveSuccess: function () {
      this.data = this.dirtyData;
      this.dirtyData = this.validation = null;
      this.editable = false;
    }
  };

  /**
   * retrieve information concerning the user's account settings, and save it in the data object as two arrays
   */
  var getData;

  function handleData(data) {
    return angular.extend({}, data[0], data[1]);
  }

  if (User.isDealer()) {
    getData = $q.all([AccountManagement.get(), AccountManagement.getFinancialAccountData()])
      .then(handleData);
  } else {
    getData = AccountManagement.get();
  }

  $scope.editDefaultAccount = false;
  /**
   * Updates the default disbursement account
   * @param disbursementAccountId
   */
  $scope.updateDisbursementAccount = function (disbursementAccountId) {
    var financialDataDefined = $scope.financial && $scope.financial.data;
    if (financialDataDefined) {
      var financialData = $scope.financial.data;
      financialData.disbursementAccount = disbursementAccountId;
    }
  };

  /**
   * Updates the default billing account
   * @param billingAccountId
   */
  $scope.updateBillingAccount = function (billingAccountId) {
    var financialDataDefined = $scope.financial && $scope.financial.data;
    if (financialDataDefined) {
      var financialData = $scope.financial.data;
      financialData.billingAccount = billingAccountId;
    }
  };

  function getFinancialData(){
    AccountManagement.getFinancialAccountData().then(function(result){
      $scope.financial.data.getActiveAchAccounts = getActiveAchAccounts(result.BankAccounts);
    });
  }

  function getActiveAchAccounts(accounts) {
    var activeAccounts = _.filter(accounts, function (account) {
      return (account.IsActive === true);
    });
    return _.filter(activeAccounts, function (account) {
      return (account.AllowPaymentByAch === true);
    });
  }

  getData.then(function (results) {
      $scope.loading = true;


      /** BUSINESS SETTINGS **/
      $scope.business = {
        data: {
          phone: '1-234-567-8910',
          fax: '1-234-567-8912',
          email: results.BusinessEmail,
          enhancedRegistrationEnabled: results.EnhancedRegistrationEnabled,
          enhancedRegistrationPin: null,
          autoPayEnabled: results.AutoPayEnabled,
          isQuickBuyer: results.IsQuickBuyer,
          isStakeholderActive: results.IsStakeholderActive,
          isStakeholder: results.IsStakeholder,
          useAutoACH: results.UseAutoACH
        },
        dirtyData: null, // a copy of the data for editing (lazily built)
        editable: false,
        edit: function () {
          prv.edit.apply(this);
        },
        cancel: function () {
          prv.cancel.apply(this);
        },
        save: function () {
          if (prv.save.apply(this)) {
            var d = this.dirtyData;

            AccountManagement.saveBusiness(d.email, d.enhancedRegistrationEnabled, d.enhancedRegistrationPin,
              d.autoPayEnabled).then(prv.saveSuccess.bind(this))
              .then(User.setAutoPayEnabled.bind(this, d.autoPayEnabled));
          }
        },
        isDirty: function () {
          return $scope.busSettings.$dirty;
        },
        validate: function () {
          var business = $scope.business;
          business.validation = angular.copy($scope.busSettings);
          return business.validation.$valid;
        },
        confirmDisableEnhanced: function () {
          var dialogOptions = {
            backdrop: true,
            keyboard: true,
            backdropClick: true,
            templateUrl: 'views/modals/confirmDisableEnhanced.html',
            controller: 'ConfirmCtrl'
          };
          $dialog.dialog(dialogOptions).open().then(function (result) {
            if (result) {
              $scope.business.dirtyData.enhancedRegistrationPin = null;
              $scope.business.dirtyData.enhancedRegistrationEnabled = false;
            } else {
              $scope.business.dirtyData.enhancedRegistrationEnabled = true;
            }
          });
        },
        contactInfo: {
          isDisplayed: function () {
            return $scope.isDealer && $scope.isUnitedStates && $scope.contactInfoEnabled;
          }
        }

      };

      /** BRAND SETTINGS **/
      $scope.brand = {
        data: {
          autoPayEnabled: results.AutoPayEnabled
        },
        dirtyData: null,
        editable: false,
        edit: function () {
          prv.edit.apply(this);
        },
        cancel: function () {
          prv.cancel.apply(this);
        },
        save: function () {
          if (prv.save.apply(this)) {
            var d = this.dirtyData;

            AccountManagement.saveBusiness($scope.business.data.email, $scope.business.data.enhancedRegistrationEnabled, $scope.business.data.enhancedRegistrationPin,
              d.autoPayEnabled).then(prv.saveSuccess.bind(this))
              .then(User.setAutoPayEnabled.bind(this, d.autoPayEnabled));
          }
        },
        isDirty: function () {
          return $scope.brandSettings.$dirty;
        },
        validate: function () {
          var brand = $scope.brand;
          brand.validation = angular.copy($scope.brandSettings);
          return brand.validation.$valid;
        },
        autoPay: {
          confirmEnable: function () {
            var dialogOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: true,
              templateUrl: 'views/modals/confirmEnableAutoPay.html',
              controller: 'ConfirmCtrl'
            };
            $dialog.dialog(dialogOptions).open().then(function (result) {
              $scope.brand.dirtyData.autoPayEnabled = !!result;
            });
          },
          confirmDisable: function () {
            var dialogOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: true,
              templateUrl: 'views/modals/confirmDisableAutoPay.html',
              controller: 'ConfirmCtrl'
            };
            $dialog.dialog(dialogOptions).open().then(function (result) {
              $scope.brand.dirtyData.autoPayEnabled = !result;
            });
          },
          isEditable: function () {
            return $scope.brand.editable && $scope.business.data.isStakeholder &&
              $scope.business.data.isStakeholderActive;
          },
          isDisplayed: function () {
            return angular.isDefined(results.AutoPayEnabled) && $scope.isDealer && $scope.isUnitedStates &&
              $scope.business.data.isQuickBuyer === false && $scope.business.data.useAutoACH === true && $scope.autoPayEnabled;
          }
        }
      };

      /**
       *gets the bank name of the default account for disbursement.
       * @returns {*}
       */
      function getDefaultDisbursement(disbursementId, accounts) {
        return _.find(accounts, function (account) {
          return account.BankAccountId === disbursementId;
        });
      }

      /**
       * gets the bank name of the default account for billing
       */
      function getDefaultBilling(billingId, accounts) {
        return _.find(accounts, function (account) {
          return account.BankAccountId === billingId;
        });
      }

      /**
       * gets the account object for the default accounts for payment and deposit
       * @type {Mixed}
       */
      $scope.defaultPayment = _.find(results.BankAccounts, function (account) {
        return account.BankAccountId === results.DefaultBillingBankAccountId;
      });

      $scope.defaultDeposit = _.find(results.BankAccounts, function (account) {
        return account.BankAccountId === results.DefaultDisbursementBankAccountId;
      });

      function getActiveBankAccounts(accounts) {
        return _.filter(accounts, function (account) {
          return (account.IsActive === true);
        });
      }

      function getInactiveBankAccounts(accounts) {
        return _.filter(accounts, function (account) {
          return (account.IsActive === false);
        });
      }

      var dirtyPayment = null;
      var dirtyDeposit = null;

      /** FINANCIAL ACCOUNTS SETTINGS **/
      $scope.financial = {
        data: {
          bankAccounts: results.BankAccounts,
          activeBankAccounts: getActiveBankAccounts(results.BankAccounts),
          inactiveBankAccounts: getInactiveBankAccounts(results.BankAccounts),
          getActiveAchAccounts: getActiveAchAccounts(results.BankAccounts),
          selectedAccount: null,
          selectedForPayment: null,
          selectedForDeposit: null,
          routingNumberLabel: routingNumberFilter('', $scope.isUnitedStates, true),
          disbursementAccount: getDefaultDisbursement(results.DefaultDisbursementBankAccountId, results.BankAccounts),
          billingAccount: getDefaultBilling(results.DefaultBillingBankAccountId, results.BankAccounts)
        },
        dirtyData: null, // a copy of the data for editing (lazily built)
        editable: false,
        edit: function () {
          $scope.editDefaultAccount = true;
          dirtyPayment = $scope.defaultPayment;
          dirtyDeposit = $scope.defaultDeposit;
        },
        cancel: function () {
          $scope.defaultPayment = dirtyPayment;
          $scope.defaultDeposit = dirtyDeposit;
          $scope.editDefaultAccount = false;
        },
        save: function () {
          if ($scope.defaultDeposit.BankAccountId === $scope.defaultPayment.BankAccountId) {
            var account;
            AccountManagement.getBankAccount($scope.defaultDeposit.BankAccountId)
              .then(function (response) {
                account = response;
                account.IsDefaultDisbursement = true;
                account.IsDefaultPayment = true;
              })
              .then(function () {
                return AccountManagement.updateBankAccount(account);
              })
              .then(function () {
                $scope.editDefaultAccount = false;
              });
          } else {
            var accounts;
            $q.all([AccountManagement.getBankAccount($scope.defaultDeposit.BankAccountId),
              AccountManagement.getBankAccount($scope.defaultPayment.BankAccountId)])
              .then(function (responses) {
                accounts = responses;
                accounts[0].IsDefaultDisbursement = true;
                accounts[1].IsDefaultPayment = true;
              })
              .then(function () {
                return AccountManagement.updateBankAccount(accounts[0]);
              })
              .then(function () {
                return AccountManagement.updateBankAccount(accounts[1]);
              })
              .then(function () {
                $scope.editDefaultAccount = false;
              });
          }
        },
        /**
         * Determines if the current user should be allowed to add a bank account.
         * @return {Boolean} Is the user allowed to add a bank account?
         */
        isAddBankAccountEditable: function () {
          return ($scope.addBankAccountEnabled && $scope.business.data.isStakeholder &&
          $scope.business.data.isStakeholderActive && $scope.isUnitedStates);
        },
        /**
         * Updates the local financial account data to keep consistent with
         * the endpoint data.
         * @param  {Object} updatedAccount A bank account that was added.
         * @return {void}
         */
        updateFinancialAccounts: function (updatedAccount) {
          var accNumber = updatedAccount.AccountNumber,
            processedBankAccount = {
              BankAccountId: updatedAccount.AccountId,
              BankAccountName: updatedAccount.AccountName,
              AchAccountNumberLast4: accNumber.length > 4 ? accNumber.substr(accNumber.length - 4) : accNumber,
              IsActive: updatedAccount.IsActive,
              AchAbaNumber: updatedAccount.RoutingNumber,
              AchBankName: updatedAccount.BankName,
              AllowPaymentByAch: true
            };

          $scope.financial.data.bankAccounts.unshift(processedBankAccount);
        },
        /**
         * Opens the add bank account modal and processes the bank account if
         * one is submitted
         * @return {void}
         */
        addFinancialAccount: function () {
          var dialogOptions = {
            dialogClass: 'modal',
            backdrop: true,
            keyboard: false,
            backdropClick: false,
            templateUrl: 'views/modals/financialAccount.html',
            resolve: {
              options: function () {
                return {
                  modal: 'add',
                  account: {
                    AccountNumber: '',
                    IsActive: true,
                    IsDefaultDisbursement: false,
                    IsDefaultPayment: false
                  }
                };
              }
            },
            controller: 'FinancialAccountCtrl'
          };

          $dialog.dialog(dialogOptions).open()
            .then(updateLocalFinancialData);

          /**
           * Helper function: Propogate bank account changes to local data to
           * keep consistent with endpoint data.
           * @param  {Object} updatedAccount Bank account that was added to
           * endpoint.
           * @return {void}
           */
          function updateLocalFinancialData(updatedAccount) {
            if (updatedAccount) {
              // Refresh cached endpoint info for active bank accounts. See /Dealer/v1_2/Info/.
              User.refreshInfo();

              if (updatedAccount.IsDefaultPayment) {
                $scope.updateBillingAccount(updatedAccount.AccountId);
              }
              if (updatedAccount.IsDefaultDisbursement) {
                $scope.updateDisbursementAccount(updatedAccount.AccountId);
              }
              // Update local data
              $scope.financial.updateFinancialAccounts(updatedAccount);
            }
          }
        }
      };

      var titleAddresses = Addresses.getTitleAddresses();
      /** TITLE SETTINGS **/
      $scope.title = {
        data: {
          titleAddress: Addresses.getDefaultTitleAddress(),
          addresses: _.filter(titleAddresses, function (addr) {
            return (addr.IsTitleReleaseAddress === false);
          }),
          extraAddresses: titleAddresses.length > 4 ? titleAddresses.length - 4 : 0, // show 3, but '>4' to account for selected address
          addressCount: titleAddresses.length
        },
        dirtyData: null, // a copy of the data for editing (lazily built)
        editable: false,
        edit: function () {
          prv.edit.apply(this);
          this.updateAddressSelection();
        },
        cancel: function () {
          prv.cancel.apply(this);
          // make sure to close any tooltips left open
          angular.forEach(angular.element('.btn-help'), function (elem) {
            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            angular.element(elem).scope().tt_isOpen = false;
            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
          });
        },
        save: function () {
          if (prv.save.apply(this)) {
            this.updateAddressSelection();
            var d = this.dirtyData;

            AccountManagement.saveTitleAddress(d.titleAddress.AddressId).then(
              prv.saveSuccess.bind(this)
            );
          }
        },
        isDirty: function () {
          return $scope.titleSettings.$dirty;
        },
        validate: function () {
          var title = $scope.title;
          title.validation = angular.copy($scope.titleSettings);
          return title.validation.$valid;
        },
        updateAddressSelection: function () {
          var selectedId = this.dirtyData.titleAddress.AddressId;
          for (var i = 0; i < this.dirtyData.addresses.length; i++) {
            if (selectedId === this.dirtyData.addresses[i].AddressId) {
              this.dirtyData.titleAddress = this.data.addresses[i];
            }
          }
          //need to refresh dirtyData.addresses
          this.dirtyData.addresses = _.filter(titleAddresses, function (addr) {
            return (addr.AddressId !== selectedId);
          });
        }
      };
    },
    function (/*reason*/) {
      $scope.loading = false;
    });

  $scope.onRequestCredIncr = function () {
    var dialogOptions = {
      dialogClass: 'modal request-credit-increase',
      backdrop: true,
      keyboard: false,
      backdropClick: false,
      templateUrl: 'views/modals/requestCreditIncrease.html',
      controller: 'RequestCreditIncreaseCtrl'
    };

    $dialog.dialog(dialogOptions).open();
  };

  $scope.feeScheduleUrl = api.contentLink(
    '/dealer/feeschedule/FeeSchedule',
    {}
  );

}

function ConfirmCtrl($scope, dialog) {
  $scope.close = function (result) {
    dialog.close(result);
  };

  $scope.agree = false;
}
