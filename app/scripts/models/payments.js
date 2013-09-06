'use strict';

angular.module('nextgearWebApp')
  .factory('Payments', function($q, $filter, api) {

    // Daniel's temporary date comparison function.
    // This will be refactored and relocated.
    // Perhaps we can utilize a proper JavaScript date library.
    var isToday = function(otherDate) {
      var today = new Date(),
          d = new Date(otherDate * 1000);
      return (
        (today.getFullYear() === d.getFullYear()) &&
        (today.getMonth()    === d.getMonth()) &&
        (today.getDate()     === d.getDate())
      );
    };

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
