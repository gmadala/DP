'use strict';

angular.module('nextgearWebApp')
  .factory('AccountManagement', function(api, User) {

    return {
      get: function() {
        return api.request('GET', '/userAccount/settings').then(function(settings) {
          return settings;
        });

      },
      getFinancialAccountData: function() {
        return api.request('GET', '/dealer/summary').then(function(summary) {
          // Any Financial Account data tranformations made here
          return User.getInfo().then(function(info) {
            var settings = {};
            settings.BankAccounts = info.BankAccounts;
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
      saveBusiness: function(email, enhancedRegEnabled, enhancedRegPin) {
        var req = {
          BusinessEmailAddress: email,
          EnhancedRegistrationEnabled: enhancedRegEnabled
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
