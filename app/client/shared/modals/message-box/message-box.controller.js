(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('MessageBoxCtrl', MessageBoxCtrl);

  MessageBoxCtrl.$inject = ['$scope', 'title', 'message', 'buttons', '$uibModalInstance'];

  function MessageBoxCtrl($scope, title, message, buttons, $uibModalInstance) {
    var uibModalInstance = $uibModalInstance;

    $scope.title = title;
    $scope.message = message;

    $scope.buttons = {
      label : buttons[0].label,
      cssClass : buttons[0].cssClass
    };

    $scope.ok = function() {
      uibModalInstance.close();
    };

  }
})();
