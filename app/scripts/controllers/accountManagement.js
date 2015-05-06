'use strict';

angular.module('nextgearWebApp')
  .controller('AccountManagementCtrl', function($scope, $dialog, AccountManagement, Addresses, segmentio, metric, User, api, $q, dealerCustomerSupportPhone) {
    if(User.isDealer()) {
      segmentio.track(metric.VIEW_ACCOUNT_MANAGEMENT);
    }
    $scope.loading = false;

    // TODO: fill this financialAccounts array with return value from API call
    $scope.financialAccounts = [
      {
        Id: 1,
        AccountName: 'Example Account Name',
        LastModified: '2015-04-05',
        DateAdded: '2015-04-01',
        BankName: 'Some Bank',
        City: 'Some City',
        State: 'Some State',
        Status: true,
        AccountNumber: 'XXXXXX2110',
        RoutingNumber: '123452112',
        PrimaryPayment: true,
        PrimaryDisbursement: false
      },
      {
        Id: 2,
        AccountName: 'Other Example Account Name',
        LastModified: '2015-04-06',
        DateAdded: '2015-04-01',
        BankName: 'Other Some Bank',
        City: 'Other Some City',
        State: 'Other Some State',
        Status: true,
        AccountNumber: 'XXXXXX2111',
        RoutingNumber: '123452112',
        PrimaryPayment: false,
        PrimaryDisbursement: true
      },
      {
        Id: 3,
        AccountName: 'Another Example Account Name',
        LastModified: '2015-04-07',
        DateAdded: '2015-04-01',
        BankName: 'Another Some Bank',
        City: 'Another Some City',
        State: 'Another Some State',
        Status: false,
        AccountNumber: 'XXXXXX2112',
        RoutingNumber: '123452112',
        PrimaryPayment: false,
        PrimaryDisbursement: false
      }
    ];

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

    getData.then(function(results) {
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
              controller: 'ConfirmDisableCtrl'
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
              /*jshint camelcase: false */
              angular.element(elem).scope().tt_isOpen = false;
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

    $scope.isUnited = User.isUnitedStates();
  })

  .controller('ConfirmDisableCtrl', function($scope, dialog) {
    $scope.close = function(result) {
      dialog.close(result);
    };
  });
