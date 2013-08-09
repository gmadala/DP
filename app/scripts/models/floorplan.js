'use strict';

angular.module('nextgearWebApp')
  .factory('Floorplan', function(api) {
    return {
      fetchStatusSummary: function() {
        return api.request('GET', '/dealer/summary').then(function(result) {
          return {
            approved: result.ApprovedFloorplans,
            pending: result.PendingFloorplans,
            denied: result.DeniedFloorplans  // availability pending Leaf API change ticket DTWO-1891
          };
      });
      }
    };
  });