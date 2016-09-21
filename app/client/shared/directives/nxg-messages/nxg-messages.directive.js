(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgMessages', nxgMessages);

  nxgMessages.$inject = ['$uibModal', 'messages'];

  function nxgMessages($uibModal, messages) {

    var uibModal = $uibModal;

    return {
      restrict: 'A',
      link: function (scope) {
        var currentDialog = null;
        scope.$watch(function () {
          return messages.list().length > 0;
        }, function (hasMessages) {
          if (hasMessages && !currentDialog) {
            var dialogOptions = {
              backdrop: 'static',
              keyboard: false,
              backdropClick: false,
              templateUrl: 'client/shared/directives/nxg-messages/nxg-messages-modal.template.html',
              controller: 'MessagesModalCtrl',
              dialogClass: 'modal',
              topmost: true,
              topmostClass: 'topmost'
            };
            currentDialog = uibModal.open(dialogOptions);
            currentDialog.result.then(function () {
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
