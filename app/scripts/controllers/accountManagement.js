'use strict';

angular.module('nextgearWebApp')
  .controller('AccountManagementCtrl', function($scope, $dialog, AccountManagement, Addresses, gettext, segmentio,
                                                metric, User, api, $q, dealerCustomerSupportPhone, features, gettextCatalog) {

    // TODO remove this once bank accounts content is all done - just mark these for translation in advance
    gettext('Add payment account');
    gettext('Add account');
    /// the date when the account was last modified
    gettext('Last modified');
    /// the date when the account was added
    gettext('Date added');
    /// the date when payment was last made using the account
    gettext('Last payment on');
    gettext('Edit');
    gettext('Disable');

    if(User.isDealer()) {
      segmentio.track(metric.VIEW_ACCOUNT_MANAGEMENT);
    }
    $scope.loading = false;
    $scope.isUnitedStates = User.isUnitedStates();
    $scope.isDealer = User.isDealer();
    $scope.autoPayEnabled = features.autoPay.enabled;
    $scope.addBankAccountEnabled = features.addBankAccount.enabled;

    dealerCustomerSupportPhone.then(function (phoneNumber) {
      $scope.customerSupportPhone = phoneNumber.formatted;
    });

    var prv = {
      edit: function() {
        this.dirtyData = angular.copy(this.data);
        this.editable = true;
      },
      cancel: function() {
        this.dirtyData = this.validation = null;
        this.editable = false;
      },
      save: function() {
        if (!this.validate()) {
          return false;
        }
        if (!this.isDirty()) {
          this.cancel();
          return false;
        }
        if(User.isDealer()) {
          segmentio.track(metric.CHANGE_ACCOUNT_MANAGEMENT);
        } else {
          segmentio.track(metric.CHANGE_AUCTION_SETTINGS);
        }
        return true;
      },
      saveSuccess: function() {
        this.data = this.dirtyData;
        this.dirtyData = this.validation = null;
        this.editable = false;
      }
    };

    var getData;
    if(User.isDealer()) {
      getData = $q.all([AccountManagement.get(), AccountManagement.getFinancialAccountData()])
      .then(function(data) {
        return angular.extend({}, data[0], data[1]);
      });
    } else {
      getData = AccountManagement.get();
    }

    $scope.updateDisbursementAccount = function(disbursementAccountId) {
      var financialDataDefined = $scope.financial && $scope.financial.data;
      if (financialDataDefined) {
        var financialData = $scope.financial.data;
        financialData.disbursementAccount = disbursementAccountId;
      }
    };

    $scope.updateBillingAccount = function(billingAccountId) {
      var financialDataDefined = $scope.financial && $scope.financial.data;
      if (financialDataDefined) {
        var financialData = $scope.financial.data;
        financialData.billingAccount = billingAccountId;
      }
    };

    getData.then(function(results) {
        $scope.loading = true;


        /** BUSINESS SETTINGS **/
        $scope.business = {
          data: {
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
          edit: function() {
            prv.edit.apply(this);
          },
          cancel: function() {
            prv.cancel.apply(this);
          },
          save: function() {
            if (prv.save.apply(this)) {
              var d = this.dirtyData;

              AccountManagement.saveBusiness(d.email, d.enhancedRegistrationEnabled, d.enhancedRegistrationPin,
                d.autoPayEnabled).then(
                prv.saveSuccess.bind(this)
              );
            }
          },
          isDirty: function() {
            return $scope.busSettings.$dirty;
          },
          validate: function() {
            var business = $scope.business;
            business.validation = angular.copy($scope.busSettings);
            return business.validation.$valid;
          },
          confirmDisableEnhanced: function() {
            var dialogOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: true,
              templateUrl: 'views/modals/confirmDisableEnhanced.html',
              controller: 'ConfirmCtrl'
            };
            $dialog.dialog(dialogOptions).open().then(function(result) {
              if (result) {
                $scope.business.dirtyData.enhancedRegistrationPin = null;
                $scope.business.dirtyData.enhancedRegistrationEnabled = false;
              } else {
                $scope.business.dirtyData.enhancedRegistrationEnabled = true;
              }
            });
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
                if (result) {
                  $scope.business.dirtyData.autoPayEnabled = true;
                } else {
                  $scope.business.dirtyData.autoPayEnabled = false;
                }
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
                if (result) {
                  $scope.business.dirtyData.autoPayEnabled = false;
                } else {
                  $scope.business.dirtyData.autoPayEnabled = true;
                }
              });
            },
            isEditable: function () {
              return $scope.business.editable && $scope.business.data.isStakeholder &&
                $scope.business.data.isStakeholderActive;
            },
            isDisplayed: function () {
              return angular.isDefined(results.AutoPayEnabled) && $scope.isDealer && $scope.isUnitedStates &&
                $scope.business.data.isQuickBuyer === false && $scope.business.data.useAutoACH === true && $scope.autoPayEnabled;
            }
          }
        };

        /** FINANCIAL ACCOUNTS SETTINGS **/
        $scope.financial = {
          data: {
            bankAccounts: results.BankAccounts,
            disbursementAccount: results.DefaultDisbursementBankAccountId,
            billingAccount: results.DefaultBillingBankAccountId,
            availableCredit: results.AvailableCredit,
            reserveFunds: results.ReserveFunds,
            lastPayment: {
              amount: results.LastPayment,
              date: results.LastPaymentDate
            },
            unappliedFunds: results.UnappliedFunds,
            totalAvailable: results.TotalAvailable,
            autoDisburseUnappliedFunds: results.AutoDisburseUnappliedFundsDaily
          },
          dirtyData: null, // a copy of the data for editing (lazily built)
          editable: false,
          edit: function() {
            prv.edit.apply(this);
          },
          cancel: function() {
            prv.cancel.apply(this);
          },
          isDirty: function() {
            return $scope.financialSettings.$dirty;
          },
          validate: function() {
            var financial = $scope.financial;
            financial.validation = angular.copy($scope.financialSettings);
            return financial.validation.$valid;
          },
          updateFinancialAccounts: function(updatedData) {
            $scope.financial.data.bankAccounts = updatedData.BankAccounts;
            $scope.financial.data.disbursementAccount = updatedData.DefaultDisbursementBankAccountId;
            $scope.financial.data.billingAccount = updatedData.DefaultBillingBankAccountId;
          },
          addFinancialAccount: function() {
            var dialogOptions = {
              dialogClass: 'modal',
              backdrop: true,
              keyboard: false,
              backdropClick: false,
              templateUrl: 'views/modals/financialAccount.html',
              resolve: {
                options: function () {
                  return {
                    account: {
                      IsActive: true,
                      IsDefaultDisbursement: false,
                      IsDefaultPayment: false
                    }
                  };
                }
              },
              controller: 'FinancialAccountCtrl'
            };

            $dialog.dialog(dialogOptions).open().then(function(updatedAccount) {
              if(updatedAccount) {
                if(updatedAccount.IsDefaultPayment) {
                  $scope.updateBillingAccount(updatedAccount.AccountId);
                }
                if(updatedAccount.IsDefaultDisbursement) {
                  $scope.updateDisbursementAccount(updatedAccount.AccountId);
                }
              }
            }).then(function(/* success */) {
              var title = gettextCatalog.getString('Bank Account Added'),
                msg = gettextCatalog.getString('Your Bank Account has successfully been added.'),
                buttons = [{label: gettextCatalog.getString('Close Window'), cssClass: 'btn-cta cta-secondary'}];
              $dialog.messageBox(title, msg, buttons).open();

              AccountManagement.getFinancialAccountData()
                .then(function(updatedData) {
                  $scope.financial.updateFinancialAccounts(updatedData);
                });
            });
          }
        };

        var titleAddresses = Addresses.getTitleAddresses();
        /** TITLE SETTINGS **/
        $scope.title = {
          data: {
            titleAddress: Addresses.getDefaultTitleAddress(),
            addresses: _.filter(titleAddresses, function(addr) {
              return (addr.IsTitleReleaseAddress === false);
            }),
            extraAddresses: titleAddresses.length > 4 ? titleAddresses.length - 4 : 0, // show 3, but '>4' to account for selected address
            addressCount: titleAddresses.length
          },
          dirtyData: null, // a copy of the data for editing (lazily built)
          editable: false,
          edit: function() {
            prv.edit.apply(this);
            this.updateAddressSelection();
          },
          cancel: function() {
            prv.cancel.apply(this);
            // make sure to close any tooltips left open
            angular.forEach(angular.element('.btn-help'), function(elem) {
              // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
              angular.element(elem).scope().tt_isOpen = false;
              // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
            });
          },
          save: function() {
            if (prv.save.apply(this)) {
              this.updateAddressSelection();
              var d = this.dirtyData;

              AccountManagement.saveTitleAddress(d.titleAddress.AddressId).then(
                prv.saveSuccess.bind(this)
              );
            }
          },
          isDirty: function() {
            return $scope.titleSettings.$dirty;
          },
          validate: function() {
            var title = $scope.title;
            title.validation = angular.copy($scope.titleSettings);
            return title.validation.$valid;
          },
          updateAddressSelection: function() {
            var selectedId = this.dirtyData.titleAddress.AddressId;
            for (var i = 0; i < this.dirtyData.addresses.length; i++) {
              if (selectedId === this.dirtyData.addresses[i].AddressId) {
                this.dirtyData.titleAddress = this.data.addresses[i];
              }
            }
            //need to refresh dirtyData.addresses
            this.dirtyData.addresses = _.filter(titleAddresses, function(addr) {
              return (addr.AddressId !== selectedId);
            });
          }
        };
      },
      function(/*reason*/) {
        $scope.loading = false;
      });

    $scope.onRequestCredIncr = function() {
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

  })

  .controller('ConfirmCtrl', function($scope, dialog) {
    $scope.close = function(result) {
      dialog.close(result);
    };

    $scope.agree = false;
  });
