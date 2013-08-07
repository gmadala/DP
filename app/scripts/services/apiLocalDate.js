'use strict';

/**
 * Read a numeric date value from the API into a Date object,
 * interpreting it as if it's already in local time.
 *
 * Why? Most date display in this app is "bare" dates - that is,
 * dates without time of day or time zone information. The implication,
 * as with many financial services, is that these dates are in terms of
 * NextGear's timezone, not the customer's. As such, date values
 * provided by the API are relative to Eastern Standard Time (but
 * otherwise match UNIX time, i.e. seconds since midnight Jan 1, 1970).
 *
 * Since it's impossible to tell a JavaScript date object to be in
 * a timezone other than that of the local host environment, this
 * service does the next best thing: it makes a date in the local
 * timezone but with values for year, month, day, hour, etc. that
 * match the source timezone.
 *
 * For example:
 * 2013-08-07T23:59:59-0500 => 2013-08-07T23:59:59-0700.
 *
 * As long as the time zone is not shown, this date can be rendered
 * consistently on any host with no further logic.
 *
 * This logic relies upon the API *not* applying Daylight Saving Time
 * to such date values. If it does, some dates (especially those with
 * "low" time values) could become shifted by 1 day.
 */
angular.module('nextgearWebApp')
  .factory('ApiLocalDate', function() {
    return function (apiValue) {
      // convert seconds to milliseconds & read as UTC
      var date = new Date(apiValue * 1000);
      // treat resulting UTC as if it were local time
      return new Date(date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds());
    };
  });
