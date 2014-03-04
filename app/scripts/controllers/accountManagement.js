'use strict';

angular.module('nextgearWebApp')
  .controller('AccountManagementCtrl', function($scope, $dialog, AccountManagement, segmentio, metric, User) {
    if(User.isDealer()) {
      segmentio.track(metric.VIEW_ACCOUNT_MANAGEMENT);
    }
    $scope.loading = false;

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

    AccountManagement.get().then(function(results) {
        $scope.loading = true;


        /** BUSINESS SETTINGS **/
        $scope.business = {
          data: {
            email: results.BusinessEmail,
            enhancedRegistrationEnabled: results.EnhancedRegistrationEnabled,
            enhancedRegistrationPin: null
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

              AccountManagement.saveBusiness(d.email, d.enhancedRegistrationEnabled, d.enhancedRegistrationPin).then(
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
              controller: 'ConfirmDisableCtrl',
            };
            $dialog.dialog(dialogOptions).open().then(function(result) {
              if (result) {
                $scope.business.dirtyData.enhancedRegistrationPin = null;
                $scope.business.dirtyData.enhancedRegistrationEnabled = false;
              } else {
                $scope.business.dirtyData.enhancedRegistrationEnabled = true;
              }
            });
          }
        };

        /** FINANCIAL ACCOUNTS SETTINGS **/
        $scope.financial = {
          data: {
            bankAccounts: results.BankAccounts,
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
        };

        /** TITLE SETTINGS **/
        $scope.title = {
          data: {
            longFormatAddressText: results,
            titleAddress: results.CurrentTitleReleaseAddress,
            addresses: _.filter(results.Addresses, function(addr) {
              return (addr.IsTitleReleaseAddress === false);
            }),
            extraAddresses: results.Addresses.length > 4 ? results.Addresses.length - 4 : 0
          },
          dirtyData: null, // a copy of the data for editing (lazily built)
          editable: false,
          edit: function() {
            prv.edit.apply(this);
            this.updateAddressSelection();
          },
          cancel: function() {
            prv.cancel.apply(this);
          },
          save: function() {
            if (prv.save.apply(this)) {
              this.updateAddressSelection();
              var d = this.dirtyData;

              AccountManagement.saveTitleAddress(d.titleAddress.BusinessAddressId).then(
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
            var selectedId = this.dirtyData.titleAddress.BusinessAddressId;
            for (var i = 0; i < this.dirtyData.addresses.length; i++) {
              if (selectedId === this.dirtyData.addresses[i].BusinessAddressId) {
                this.dirtyData.titleAddress = this.data.addresses[i];
              }
            }
          },
          toShortAddress: function(address) {
            return address ? address.Line1 + (address.Line2 ? ' ' + address.Line2 : '') + ' / ' + address.City + ' ' + address.State : '';
          }
        };
      },
      function(/*reason*/) {
        $scope.loading = false;
      });
  })

  .controller('ConfirmDisableCtrl', function($scope, dialog) {
    $scope.close = function(result) {
      dialog.close(result);
    };
  });
