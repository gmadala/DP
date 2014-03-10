'use strict';

angular.module('nextgearWebApp')
  .factory('TitleReleases', function(api, TitleAddresses, $q) {

    var eligibility;

    var cacheEligibility = function() {
      eligibility = api.request('GET', '/dealer/getTitleReleaseEligibility');
    };
    cacheEligibility();

    var queue = [];

    return {

      isEligible: function() {
        return eligibility.then(function(result) {
          return result.DealerIsEligibleToReleaseTitles;
        });
      },

      getTitleReleaseEligibility: function() {
        return eligibility;
      },

      getQueue: function() {
        return queue;
      },

      addToQueue: function(floorplan) {
        queue.push(floorplan);
      },

      removeFromQueue: function(floorplan) {
        var indexOf = _.findIndex(queue, function(item) {
          return item.FloorplanId === floorplan.FloorplanId;
        });

        if(indexOf !== -1) {
          queue.splice(indexOf, 1);
        }
      },

      isFloorplanOnQueue: function(floorplan) {
        return _.some(queue, function(item) {
          return floorplan.FloorplanId === item.FloorplanId;
        });
      },

      makeRequest: function() {

        // Get the default address to send with non-overridden floorplans
        var needDefaultAddress = !_.every(queue, function(floorplan) {
          return floorplan.overrideAddress;
        });
        var getDefaultAddress;
        if(needDefaultAddress){
          getDefaultAddress = TitleAddresses.getDefaultAddress();
        } else {
          getDefaultAddress = $q.when(true);
        }

        // Get the default address (if needed) and make the API request
        return getDefaultAddress.then(function(defaultAddress) {
          var floorplans = _.map(queue, function(floorplan) {
            return {
              FloorplanId: floorplan.FloorplanId,
              ReleaseAddressId: floorplan.overrideAddress ? floorplan.overrideAddress.BusinessAddressId : defaultAddress.BusinessAddressId
            };
          });
          var data = {
            TitleReleases: floorplans
          };
          return api.request('POST', '/Floorplan/RequestTitleRelease', data);
        }).then(function(response) {
          // Re-run the eligibility request
          cacheEligibility();
          return response;
        });
      }

    };
  });
