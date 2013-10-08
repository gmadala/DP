'use strict';

angular.module('nextgearWebApp')
  .factory('CreditQuery', function(api) {
    return {
      get: function(businessId) {
        return api.request('POST', '/dealer/creditQueryandlog/' + businessId).then(
          function(results) {
            return results.LinesOfCredit;
          }
        );
      }
    };
  });
