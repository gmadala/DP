'use strict';

/**
 * This is currently only being used to demonstrate the infinite scroll directive in the
 * business search modal (dialog) on the "Floor a Car" page. At the moment, it only works with
 * mock data, as the real service returns a 404.
 */
angular.module('nextgearWebApp')
  .service('BusinessSearch', function(api) {
    return api.request('GET', '/Dealer/SearchSeller');
  });
