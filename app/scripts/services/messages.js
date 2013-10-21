'use strict';

angular.module('nextgearWebApp')
  .factory('messages', function () {
    // Private
    var items = [],
        noop = function () {};

    // Public
    return {
      add: function (text, debug, title, next) {
        var msg = {
          title: title || 'Error',
          text: text,
          debug: debug,
          dismiss: function () {
            var index = items.indexOf(msg);
            next = next || noop;
            if (index >= 0) {
              items.splice(index, 1);
            }
            next();
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
