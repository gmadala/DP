(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('AccountManagement', AccountManagement);

  AccountManagement.$inject = ['$q', 'api', 'User'];

  function AccountManagement($q, api, User) {

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
        return api.request('GET', '/Dealer/bankAccount/' + accountId).then(function (bankAccount) {
          return bankAccount;
        });
      },
      updateBankAccount: function(bankAccount) {
        if (!bankAccount) {
          throw new Error('Bank account is required.');
        }
        return api.request('PUT', '/Dealer/bankAccount/', bankAccount).then(function (bankAccount) {
          return bankAccount;
        });
      },
      addBankAccount: function(bankAccount) {
        if(!bankAccount) {
          throw new Error('Bank account is required.');
        }
        return api.request('POST', '/Dealer/bankAccount/', bankAccount).then(function (bankAccountId) {
          return bankAccountId;
        });
      },
      getFinancialAccountData: function() {
        return $q.all([this.getDealerSummary(), User.refreshInfo()]).then(function(responds) {
          var settings = {};
          settings.BankAccounts = responds[0].BankAccounts;
          settings.DefaultDisbursementBankAccountId = responds[1].DefaultDisbursementBankAccountId;
          settings.DefaultBillingBankAccountId = responds[1].DefaultBillingBankAccountId;
          settings.AvailableCredit = responds[0].TotalAvailableCredit;
          settings.ReserveFunds = responds[0].ReserveFundsBalance;
          settings.LastPayment = responds[0].LastPaymentAmount;
          settings.LastPaymentDate = responds[0].LastPaymentDate;
          settings.UnappliedFunds = responds[0].UnappliedFundsTotal;
          settings.TotalAvailable = responds[0].TotalAvailableUnappliedFunds;
          return settings;
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
      },
      getTransactionDate: function(){
        return api.request('GET', '/dealer/recenttransaction').then(function(results){
          return results;
        });
      },
      getDealerSummary: function() {
        return api.request('GET', '/dealer/v1_1/summary');
      }
    };

  }
})();
