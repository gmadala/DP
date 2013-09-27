'use strict';

angular.module('nextgearWebApp')
  .factory('activity', function () {
    // Private

    var activityMap = {},
      indicatorCount = 0,
      indicatorsOn = true;

    // Public API
    return {
      add: function (id, indicator) {
        var oldActivity = activityMap[id];
        indicator = indicatorsOn && (!angular.isDefined(indicator) || indicator === true);
        activityMap[id] = {
          indicator: indicator
        };
        if (indicator && (!oldActivity || !oldActivity.indicator)) {
          indicatorCount++;
        } else if (!indicator && oldActivity && oldActivity.indicator) {
          indicatorCount--;
        }
      },
      remove: function (id) {
        var activity = activityMap[id];
        if (activity && activity.indicator && indicatorCount > 0) {
          indicatorCount--;
        }
        delete activityMap[id];
      },
      indicators: {
        off: function () {
          indicatorsOn = false;
        },
        on: function () {
          indicatorsOn = true;
        },
        arePresent: function () {
          return indicatorCount > 0;
        }
      }
    };
  });
