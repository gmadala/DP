'use strict';

angular.module('nextgearWebApp')
  .factory('messages', function (gettextCatalog) {
    // Private
    var items = [],
        noop = function () {};

    // Public
    return {
      add: function (text, debug, title, onDismiss) {
        var msg = {
          title: title || gettextCatalog.getString('Error'),
          text: text,
          debug: debug,
          dismiss: function () {
            var index = items.indexOf(msg);
            onDismiss = onDismiss || noop;
            if (index >= 0) {
              items.splice(index, 1);
            }
            onDismiss();
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
