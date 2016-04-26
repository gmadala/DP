(function() {
  'use strict';

  /**
   * Pipe a date/time value through the moment.js library's parse and format functionality
   *
   * There are two versions of this filter: moment will act on the incoming value in terms of local time,
   * whereas momentUTC will act on the incoming value in terms of UTC.
   *
   * @param {String} [outputFormat] the output format you want; see http://momentjs.com/docs/#/displaying/format/
   *  if not specified, outputFormat will default to a typical short US date format like M/D/YYYY
   * @param {String} [inputFormat] if the input value is a non-ISO 8601 string, the format to read it as
   */
  angular
    .module('nextgearWebApp')
    .filter('moment', momentFn);

  momentFn.$inject = ['moment', 'gettextCatalog'];

  function momentFn(moment, gettextCatalog) {
    return function (input, outputFormat, inputFormat) {
      var languageId = gettextCatalog.currentLanguage;
      if( outputFormat === undefined ) {
        if (languageId === 'es' || languageId === 'fr_CA') {
          outputFormat = 'DD/MM/YYYY';
        }
        else {
          outputFormat = 'MM/DD/YYYY';
        }
      }else {
        outputFormat = outputFormat;
      }
      if (input === null || !angular.isDefined(input)) {
        return input;
      }
      return moment(input, inputFormat).format(outputFormat);
    };
  }
})();
