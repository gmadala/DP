'use strict';

angular.module('nextgearWebApp')
  .directive('nxgMessages', function ($dialog, messages) {
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
              templateUrl: 'scripts/directives/nxg-messages/nxg-messages-modal.html',
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
  })
  .controller('MessagesModalCtrl', function ($scope, messages) {

    $scope.$watch(function () { return messages.list(); }, function (list) {
      // de-duplicate
      var resultList = [],
        seen = {};
      angular.forEach(list, function (msg) {
        if (!seen[msg.text]) {
          resultList.push(msg);
          seen[msg.text] = true;
        }
      });
      $scope.messages = resultList;

      if (resultList.length === 1) {
        $scope.title = list[0].title;
      } else if (resultList.length > 1) {
        $scope.title = 'Multiple Messages';
      }
    }, true);

    $scope.close = function () {
      // Destructive array operation - work with copy of array
      angular.forEach(messages.list().slice(), function (msg) {
        msg.dismiss();
      });
      // parent directive will perform the actual close operation
    };

  });
