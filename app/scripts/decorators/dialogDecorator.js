'use strict';

/**
 * Adds a closeAll funtion to the twitter dialogs
 */
angular.module('nextgearWebApp')
  .config( function ($provide) {
    $provide.decorator('$dialog', function($delegate, $q, $timeout) {
      var OriginalDialog = $delegate.dialog,
          currentlyOpen = [],
          body = angular.element(document.body),
          OriginalMessageBox = $delegate.messageBox;

      var preventScrollingOnBody = function(scrollEvent){
        // Prevent default key action if using arrow keys
        if(scrollEvent.keyCode >= 37 && scrollEvent.keyCode <= 40){
          scrollEvent.preventDefault();
        }
      };

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

            if (currentlyOpen.length === 1) {
              body.addClass('modal-open');

              // Disable scrolling
              angular.element(document).on('keydown', preventScrollingOnBody);
            }
            $delegate.enforceFocus.call(this);

            return deferred.promise;
          };

          dialog._addElementsToDom = function() {
            body.append(this.backdropEl);
            body.append(this.modalEl);
          };

          dialog._removeElementsFromDom = function() {
            this.modalEl.remove();
            this.backdropEl.remove();
          };

          dialog.close = function () {
            currentlyOpen = _.reject(currentlyOpen, dialog);
            originalClose.apply(dialog, arguments);

            if (currentlyOpen.length === 0) {
              body.removeClass('modal-open');

              // Re-enable scrolling
              angular.element(document).off('keydown', preventScrollingOnBody);
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

        enforceFocus: function() {
          // force tabbing to focus only on elements within modal while it is open.
          var doc = angular.element(document);
          var which = this;

          // Add a hidden button at the end of modals that is still able to get focus.
          // When it gets focus the listener below sends focus back to the first element
          // in the modal, which prevents the URL from ever getting focus.
          // This is for IE9, which shows an element as still having focus when the URL
          // actually has focus.
          var hiddenButton = angular.element('<button></button>')
            .css({
              position: 'fixed',
              left: '-100px',
              top: '-100px'
            });

          // modalEl is wiped and replaced with new content after this point, so
          // the hiddenButton needs to be added asynchronously, after the other
          // content is added.
          // 10ms caused bugs, so 100ms is being used
          $timeout(function () {
            which.modalEl.append(hiddenButton);
          }, 100);

          hiddenButton.on('focusin', function () {
            var focusable = which.modalEl.find('input, button, select, a:visible').first();

            if(focusable.length > 0){
              // sometimes one works, sometimes the other.
              focusable[0].focus();
              $timeout(function() {
                focusable[0].focus();
              }, 10);
            }
          });

          doc.off('focusin')
          .on('focusin', function (e) {

            if (which.modalEl[0]!== e.target && !which.modalEl.has(e.target).length) {
              // focus on first focusable element inside modal
              var focusable = which.modalEl.find('input, button, select, a:visible').first();

              if(focusable.length > 0){
                // sometimes one works, sometimes the other.
                focusable[0].focus();
                $timeout(function() {
                  focusable[0].focus();
                }, 10);
              }
            }
          });
        },

        messageBox: function(title, message, buttons) {
          var msgBox = new OriginalMessageBox(title, message, buttons);

          msgBox._addElementsToDom = function() {
            body.append(this.backdropEl);
            body.append(this.modalEl);
          };

          msgBox._removeElementsFromDom = function() {
            this.modalEl.remove();
            this.backdropEl.remove();
          };

          msgBox.modalEl.addClass('nxg-autofocus');
          $delegate.enforceFocus.call(msgBox);
          return msgBox;
        }

      });
    });
  });
