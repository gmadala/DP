(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .factory('CreditQuery', CreditQuery);

  CreditQuery.$inject = ['api'];

  function CreditQuery(api) {

    return {
      get: function(businessId) {
        return api.request('POST', '/dealer/creditQueryandlog/' + businessId).then(
          function(results) {
            return results.LinesOfCredit;
          }
        );
      }
    };

  }
})();
