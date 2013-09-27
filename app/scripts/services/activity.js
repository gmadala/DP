'use strict';

angular.module('nextgearWebApp')
  .factory('activity', function () {
    // Private

    var activityMap = {},
      activityCount = 0,
      indicatorsAllowed = true;

    // Public API
    return {
      add: function (id) {
        var oldActivity = activityMap[id];
        if (!oldActivity) { activityCount++; }
        activityMap[id] = true;
      },
      remove: function (id) {
        var activity = activityMap[id];
        if (activity && activityCount > 0) {
          activityCount--;
        }
        delete activityMap[id];
      },
      indicators: {
        suppress: function () {
          indicatorsAllowed = false;
        },
        allow: function () {
          indicatorsAllowed = true;
        },
        arePresent: function () {
          return indicatorsAllowed && activityCount > 0;
        }
      }
    };
  });
