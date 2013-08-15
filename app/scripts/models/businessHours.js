'use strict';

angular.module('nextgearWebApp')
  .factory('BusinessHours', function(api) {

    return {
      get: function() {
        return api.request('GET', '/Info/businesshours').then(function(results) {
          return {
            startTime: new Date(results.StartDateTime),
            endTime: new Date(results.EndDateTime)
          };
        });
      }
    };
  });
