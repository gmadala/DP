(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('MessagesModalCtrl', MessagesModalCtrl);

  MessagesModalCtrl.$inject = ['$scope', 'messages'];

  function MessagesModalCtrl($scope, messages) {

    $scope.$watch(function () {
      return messages.list();
    }, function (list) {
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

  }
})();
