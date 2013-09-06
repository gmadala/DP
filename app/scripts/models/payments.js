'use strict';

angular.module('nextgearWebApp')
  .factory('Payments', function($q, $filter, api) {

    return {
      requestUnappliedFundsPayout: function (amount, bankAccountId) {
        return api.request('POST', '/payment/payoutUnappliedFunds', {
          RequestAmount: amount,
          BankAccountId: bankAccountId
        });
      },
      search: function(searchData) {
        var defaults = {
          Criteria:     null, // Search string
          DueDateStart: null, // Earliest due date to include (UNIX time)
          DueDateEnd:   null, // Latest due date to include (UNIX time)
          OrderBy:      null, // Field to order records by
          PageNumber:   null, // Page number to return
          PageSize:     null  // Number of records to return
        };
        return api.request('GET', '/payment/search', angular.extend(defaults, searchData)).then(function(result) {
          return {
            'payments': result.SearchResults || [],
            'fees': result.AccountFees || []
          };
        });
      }
    };
  });
