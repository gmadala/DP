'use strict';

/**
 * Adds a closeAll funtion to the twitter dialogs
 */
angular.module('nextgearWebApp')
  .config( function ($provide) {
    $provide.decorator('$dialog', function($delegate, $q) {
      var OriginalDialog = $delegate.dialog,
          currentlyOpen = [],
          body = angular.element(document.body),
          OriginalMessageBox = $delegate.messageBox;

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

            body.addClass('modal-open');

            return deferred.promise;
          };

          dialog.close = function () {
            currentlyOpen = _.reject(currentlyOpen, dialog);
            originalClose.apply(dialog, arguments);

            if (currentlyOpen.length === 0) {
              body.removeClass('modal-open');
            }
          };

          return dialog;
        },

        closeAll: function() {
          angular.forEach(currentlyOpen, function(openDialog){
            openDialog.close();
          });
          currentlyOpen = [];
        },

        openDialogsCount: function() {
          return currentlyOpen.length;
        },

        messageBox: function(title, message, buttons) {
          var msgBox = new OriginalMessageBox(title, message, buttons);

          msgBox.modalEl.addClass('nxg-autofocus');
          return msgBox;
        }

      });
    });
  });
