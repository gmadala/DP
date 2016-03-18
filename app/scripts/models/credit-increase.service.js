(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('CreditIncrease', CreditIncrease);

  CreditIncrease.$inject = ['api'];

  function CreditIncrease(api) {

    return {
      getActiveLinesOfCredit: function() {
        return api.request('GET', '/dealer/ActiveLinesOfCredit').then(function(response) {
          return _.map(response.LinesOfCredit, function(line) {
            return {
              id: line.LineOfCreditId,
              type: line.CreditTypeName,
              amount: line.Limit
            };
          });
        });
      },
      requestCreditIncrease: function(lineOfCreditId, isTemporary, amount) {
        var data = {
          LineOfCreditId: lineOfCreditId,
          IsTemporary: isTemporary,
          Amount: amount
        };

        return api.request('POST', '/dealer/requestCreditIncrease', data);
      }
    };

  }
})();
