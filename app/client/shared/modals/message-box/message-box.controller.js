(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('MessageBoxCtrl', MessageBoxCtrl);

  MessageBoxCtrl.$inject = ['$scope', 'title', 'message', 'buttons', '$uibModalInstance','gettextCatalog'];

  function MessageBoxCtrl($scope, title, message, buttons, $uibModalInstance, gettextCatalog) {
    var uibModalInstance = $uibModalInstance;

    $scope.title = gettextCatalog.getString(title);
    $scope.message = message;

    $scope.buttons = {
      label : gettextCatalog.getString(buttons[0].label),
      cssClass : buttons[0].cssClass
    };

    $scope.ok = function() {
      uibModalInstance.close();
    };

  }
})();
