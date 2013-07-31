'use strict';

/**
 * This is just one idea about how to create reusable a "model" (actually an AngularJS service).
 * Feel free to discard this implementation in favor of something else.
 *
 * This is currently only being used to demonstrate the infinite scroll directive in the
 * business search modal (dialog) on the "Floor a Car" page. At the moment, it only works with
 * mock data, as the real service returns a 404.
 *
 * @see http://localhost:9000/?mock#/floorcar
 */
angular.module('nextgearWebApp')
  .factory('BusinessSearch', function($http, nxgConfig) {
    var BusinessSearch = function() {
      this.results = [];
      this.loading = false;
    };

    BusinessSearch.prototype.loadMore = function() {
      if (this.loading) {
        return;
      }
      this.loading = true;

      $http.get(nxgConfig.apiBase + '/Dealer/SearchSeller').success(function(result) {
        this.results = this.results.concat(result.Data.DealerInfoList);
        this.loading = false;
      }.bind(this));
    };

    return BusinessSearch;
  });
