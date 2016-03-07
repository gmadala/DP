'use strict';

angular.module('nextgearWebApp')
  .factory('status', function () {
    // Private

    var showStatus = true;

    // Public API
    return {
      hide: function () {
        showStatus = false;
      },
      show: function () {
        showStatus = true;
      },
      isShown: function () {
        return showStatus;
      }
    };
  });
