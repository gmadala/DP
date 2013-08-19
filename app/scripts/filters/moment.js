'use strict';

/**
 * Pipe a date/time value through the moment.js library's parse and format functionality
 *
 * @param {String} outputFormat the output format you want; see http://momentjs.com/docs/#/displaying/format/
 * @param {String} [inputFormat] if the input value is a non-ISO 8601 string, the format to read it as
 */
angular.module('nextgearWebApp')
  .filter('moment', function (moment) {
    return function (input, outputFormat, inputFormat) {
      return moment(input, inputFormat).format(outputFormat);
    };
  });
