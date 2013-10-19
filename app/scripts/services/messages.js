'use strict';

angular.module('nextgearWebApp')
  .factory('messages', function () {
    // Private
    var items = [];

    // Public
    return {
      add: function (text, debug, title) {
        var msg = {
          title: title || 'Error',
          text: text,
          debug: debug,
          dismiss: function () {
            var index = items.indexOf(msg);
            if (index >= 0) {
              items.splice(index, 1);
            }
          }
        };

        items.push(msg);
        return msg;
      },
      list: function () {
        return items;
      }
    };
  });
