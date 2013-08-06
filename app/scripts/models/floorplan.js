'use strict';

angular.module('nextgearWebApp')
  .factory('Floorplan', function(api) {
    return {
      fetchStatusSummary: function() {
        return api.request('GET', '/dealer/summary');
      }
    };
  });