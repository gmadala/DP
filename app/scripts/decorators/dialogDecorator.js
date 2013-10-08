'use strict';

/**
 * Adds a closeAll funtion to the twitter dialogs
 */
angular.module('nextgearWebApp')
  .config( function ($provide) {
    $provide.decorator('$dialog', function($delegate, $q) {
      var OriginalDialog = $delegate.dialog,
          currentlyOpen = [];

      return _.extend($delegate, {
        dialog: function(opts) {
          var dialog = new OriginalDialog(opts),
              originalOpen = dialog.open,
              originalClose = dialog.close;

          dialog.open = function () {
            var deferred = $q.defer();

            currentlyOpen.push(dialog);
            originalOpen.apply(dialog, arguments).then(
              function(response) {
                deferred.resolve(response);
              },
              function(response) {
                deferred.resolve($q.reject(response));
              }
            );

            return deferred.promise;
          };

          dialog.close = function () {
            currentlyOpen = _.reject(currentlyOpen, dialog);
            originalClose.apply(dialog, arguments);
          };

          dialog.closeAll = function() {
            angular.forEach(currentlyOpen, function(openDialog){
              openDialog.close();
            });
            currentlyOpen = [];
          };

          return dialog;
        }
      });
    });
  });