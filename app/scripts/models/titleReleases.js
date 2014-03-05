'use strict';

angular.module('nextgearWebApp')
  .factory('TitleReleases', function(api) {

    var eligibility = api.request('GET', '/dealer/getTitleReleaseEligibility');

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

        var floorplans = _.map(queue, function(floorplan) {
          return {
            FloorplanId: floorplan.FloorplanId
          };
        });
        var data = {
          ReleaseAddressId: '5', /* TODO Add address here */
          TitleReleaseFloorplans: floorplans
        };

        return api.request('POST', '/Floorplan/RequestTitleRelease', data);
      }

    };
  });
