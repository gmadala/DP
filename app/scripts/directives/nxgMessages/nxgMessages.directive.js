(function() {
  'use strict';

angular
  .module('nextgearWebApp')
  .directive('nxgMessages', nxgMessages);

  nxgMessages.$inject = [];

  function nxgMessages($dialog, messages) {

    return {
      restrict: 'A',
      link: function (scope) {
        var currentDialog = null;
        scope.$watch(function () {
          return messages.list().length > 0;
        }, function (hasMessages) {
          if (hasMessages && !currentDialog) {
            var dialogOptions = {
              backdrop: true,
              keyboard: true,
              backdropClick: false,
              templateUrl: 'scripts/directives/nxgMessages/nxgMessagesModal.html',
              controller: 'MessagesModalCtrl',
              dialogClass: 'modal',
              topmost: true,
              topmostClass: 'topmost'
            };
            currentDialog = $dialog.dialog(dialogOptions);
            currentDialog.open().then(function () {
              // Destructive array operation - work with copy of array
              angular.forEach(messages.list().slice(), function (msg) {
                msg.dismiss();
              });
              currentDialog = null;
            });
          } else if (!hasMessages && currentDialog) {
            currentDialog.close();
          }
        });
      }
    };

  }
})();
