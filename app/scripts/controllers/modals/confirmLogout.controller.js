(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ConfirmLogoutCtrl', ConfirmLogoutCtrl);

  ConfirmLogoutCtrl.$inject = ['$scope', 'dialog', 'User'];

  function ConfirmLogoutCtrl($scope, dialog, User) {

    $scope.logoutPending = false;

    $scope.close = function(confirmed) {
      if (confirmed) {
        $scope.logoutPending = true;
        User.logout().then(function () {
          $scope.logoutPending = false;
          dialog.close(confirmed);
        });
      } else {
        dialog.close(confirmed);
      }
    };

  }

})();
