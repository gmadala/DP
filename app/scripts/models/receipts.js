'use strict';

angular.module('nextgearWebApp')
  .factory('Receipts', function receipts($q, api) {
    return {
      search: function(params) {
        return api.request('GET', '/receipt/search', params);
      },
      getReceiptUrl: function (transactionId) {
        return api.contentLink('/receipt/view/' + transactionId);
      }
    };
  });
