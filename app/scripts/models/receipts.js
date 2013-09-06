'use strict';

angular.module('nextgearWebApp')
  .factory('Receipts', function receipts($q, api) {
    return {
      search: function(params) {
        return api.request('GET', '/receipt/search', params);
      }
    };
  });
