'use strict';

angular.module('nextgearWebApp')
  .factory('BusinessHours', function($rootScope, api, moment, $timeout) {

    var prv = {
      cachedBusinessHours: null,
      CHANGE_EVENT: 'businessHours.change',
      getBusinessHours: function() {
        if(!prv.cachedBusinessHours) {
          prv.cachedBusinessHours = api.request('GET', '/info/v1_1/businesshours').then(function(result) {

            var toReturn = _.map(result.BusinessHours, function(day) {
              return {
                start: moment(day.StartDateTime),
                end: moment(day.EndDateTime)
              };
            });

            // When we go from outside to inside business hours, or vice versa,
            // trigger an event and wipe the cached business hours
            $timeout(function() {
              prv.cachedBusinessHours = null;
              $rootScope.$broadcast(prv.CHANGE_EVENT);
            }, prv.msToNextEdge(toReturn));

            return toReturn;
          }, function(/* error */) {
            $timeout(function() {
              prv.cachedBusinessHours = null;
              $rootScope.$broadcast(prv.CHANGE_EVENT);
            }, prv.msToNextEdge([]));
          });
        }
        return prv.cachedBusinessHours;
      },
      msToNextEdge: function(hoursArray) {
        var nextEdge;
        var now = moment();
        _.forEach(hoursArray, function(hours) {
          if(now.isBefore(hours.start)) {
            nextEdge = hours.start;
            return false;
          } else if(now.isBefore(hours.end)) {
            nextEdge = hours.end;
            return false;
          }
        });

        // API messed up, only request new hours every 10 seconds
        // in this case
        if(!nextEdge) {
          return 10 * 1000; // 10 seconds
        }

        var diff = nextEdge.diff(now);
        // if the next edge is really far away like next year then just return 24 hours. $timeout will just keep
        // invoking its function with larger ms values such as next year (AngularJS bug perhaps).
        // This is relevant at least when using the mock API.
        diff = Math.min(diff, 86400000);
        return diff;
      },

      /**
       * Based on an array of business hours objects (start and end keys for moment objects)
       * determine if the current time is inside or outside business hours
       * @param  {array of objects} hoursArray The business hours to check
       * @return {boolean}            Whether or now we're currently inside business hours
       */
      insideBusinessHours: function(hoursArray) {
        var inside = false;
        var now = moment();
        _.forEach(hoursArray, function(hours) {
          if(hours.start.isBefore(now) && hours.end.isAfter(now)) {
            // Inside this business hour
            inside = true;
          }
        });

        return inside;
      },
      getDay: function(hoursObject) {
        if(!hoursObject) {
          return null;
        }
        // We shift the GMT time by 4 hours. This is eastern daylight savings
        // time. If the east coast isn't in daylight savings time it has an
        // offset of -5hours. However, the date returned here will be the same
        // with an offset of 4 hours (1am instead of 12 midnight).
        //
        // This will only be a problem if NextGear ever sets their business hours
        // to start at 11pm. Since this is extremely unlikely we can assume
        // it will never happen. If this is going to happen this line will need
        // to change.
        return hoursObject.start.zone('-04:00').format('YYYY-MM-DD');
      }
    };

    return {
      CHANGE_EVENT: prv.CHANGE_EVENT,
      insideBusinessHours: function() {
        return prv.getBusinessHours().then(function(hours) {
          return prv.insideBusinessHours(hours);
        });
      },
      nextBusinessDay: function() {
        return prv.getBusinessHours().then(function(hoursArray) {
          var nextBusinessDay;
          var now = moment();
          _.times(hoursArray.length, function(index) {
            if(nextBusinessDay) {
              return; // Already found
            }

            if(hoursArray[index].start.isBefore(now)) {
              // Inside this business hour set - get next set's day and return that
              // OR it is after business hours but before the next day.
              // Assume last item in array will never be the business hours we're inside
              nextBusinessDay = hoursArray[index+1];
            } else {
              // Not inside these business hours yet, and next business day
              // not yet found - this is the next business day
              nextBusinessDay = hoursArray[index];
            }
          });

          return prv.getDay(nextBusinessDay);
        });
      }
    };
  });
