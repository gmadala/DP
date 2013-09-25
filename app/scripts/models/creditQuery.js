'use strict';

angular.module('nextgearWebApp')
  .factory('CreditQuery', function(api) {
    return {
      get: function(businessId) {
        return api.request('GET', '/credit/creditQueryandlog/' + businessId).then(
          function(results) {
            return results.LinesOfCredit;
          }
        );
      }
    };
  });
