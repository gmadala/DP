'use strict';

angular.module('nextgearWebApp')
  .factory('AccountManagement', function($q, api, User, moment) {

    return {
      get: function() {

        var startDate = api.toShortISODate(moment(new Date()).subtract('days', 1).toDate());
        var endDate = api.toShortISODate(new Date());

        return $q.all([
          api.request('GET', '/userAccount/settings'),
          api.request('GET', '/dealer/summary'),
          api.request('GET', '/dealer/buyer/dashboard/' + startDate + '/' + endDate)
        ]).then(function(responses) {
            var settings = responses[0];
            var summary = responses[1];
            var dashboardInfo = responses[2];

            for (var i = 0; i < settings.Addresses.length; i++) {
              var addr = settings.Addresses[i];
              if (addr.IsTitleReleaseAddress) {
                settings.CurrentTitleReleaseAddress = addr;
              }
            }

            // Any Financial Account data tranformations made here
            settings.BankAccounts = User.getStatics().bankAccounts;
            settings.AvailableCredit = summary.TotalAvailableCredit;
            settings.ReserveFunds = summary.ReserveFundsBalance;
            settings.LastPayment = summary.LastPaymentAmount;
            settings.LastPaymentDate = summary.LastPaymentDate;
            settings.UnappliedFunds = dashboardInfo.UnappliedFundsTotal;
            settings.TotalAvailable = dashboardInfo.TotalAvailableUnappliedFunds;

            return settings;
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
