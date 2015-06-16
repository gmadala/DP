'use strict';

angular.module('nextgearWebApp')
  .factory('AccountManagement', function(api, User) {

    return {
      get: function() {
        return api.request('GET', '/userAccount/v1_1/settings').then(function(settings) {
          return settings;
        });

      },
      getBankAccount: function(accountId) {
        if (!accountId) {
          throw new Error('Account id is required.');
        }
        return api.request('GET', '/Dealer/bankaccount/' + accountId).then(function (bankAccount) {
          return bankAccount;
        });
      },
      updateBankAccount: function(bankAccount) {
        if (!bankAccount) {
          throw new Error('Bank account is required.');
        }
        return api.request('PUT', '/Dealer/bankaccount/', bankAccount).then(function (bankAccount) {
          return bankAccount;
        });
      },
      getFinancialAccountData: function() {
        return api.request('GET', '/dealer/v1_1/summary').then(function(summary) {
          // Any Financial Account data tranformations made here
          return User.getInfo().then(function(info) {
            var settings = {};
            settings.BankAccounts = summary.BankAccounts;
            settings.DefaultDisbursementBankAccountId = info.DefaultDisbursementBankAccountId;
            settings.DefaultBillingBankAccountId = info.DefaultBillingBankAccountId;
            settings.AvailableCredit = summary.TotalAvailableCredit;
            settings.ReserveFunds = summary.ReserveFundsBalance;
            settings.LastPayment = summary.LastPaymentAmount;
            settings.LastPaymentDate = summary.LastPaymentDate;
            settings.UnappliedFunds = summary.UnappliedFundsTotal;
            settings.TotalAvailable = summary.TotalAvailableUnappliedFunds;
            return settings;
          });
        });
      },
      saveBusiness: function(email, enhancedRegEnabled, enhancedRegPin, autoPayEnabled) {
        var req = {
          BusinessEmailAddress: email,
          EnhancedRegistrationEnabled: enhancedRegEnabled,
          AutoPayEnabled: autoPayEnabled
        };
        if (enhancedRegEnabled) {
          req.EnhancedRegistrationPin = enhancedRegPin;
        }
        return api.request('POST', '/UserAccount/businessSettings', req);
      },
      saveTitleAddress: function(addressId) {
        var req = {
          TitleReleaseAddressId: addressId
        };
        return api.request('POST', '/UserAccount/titleSettings', req);
      }
    };

  });
