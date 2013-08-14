'use strict';

angular.module('nextgearWebApp')
  .factory('BusinessSearch', function(api) {
    return {
      searchSeller: function(query) {
        query = query || '*';
        return api.request('GET', '/Dealer/search/seller/' + query);
      }
    };
  });
