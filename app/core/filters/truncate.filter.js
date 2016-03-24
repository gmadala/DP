(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .filter('truncate', truncate);

  /**
   * Truncate long string and add something at the end of the string (default to '...').
   * @returns {Function}
   */
  function truncate() {

    return function (text, length, end) {
      if (isNaN(length)) {
        length = 10;
      }

      if (end === undefined) {
        end = '...';
      }
      if(text){
        if (text.length <= length || text.length - end.length <= length) {
          return text;
        } else {
          return String(text).substring(0, length - end.length) + end;
        }
      }
    };

  }
})();
