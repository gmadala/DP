'use strict';

angular.module('nextgearWebApp')
  .factory('URLParser', function() {
    return {
      extractParams: function(url) {
        // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
        var match,
          pl = /\+/g,  // Regex for replacing addition symbol with a space
          search = /([^&=]+)=?([^&]*)/g,
          decode = function(s) {
            return decodeURIComponent(s.replace(pl, ' '));
          },
          query = url.substring(url.indexOf('?') + 1),
          params = {};

        while (match = search.exec(query)) {
          params[decode(match[1])] = decode(match[2]);
        }
        return params;
      }
    };
  });
