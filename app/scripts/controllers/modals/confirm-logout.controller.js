'use strict';

angular.module('nextgearWebApp')
  .controller('ConfirmLogoutCtrl', function($rootScope, $scope, $uibModalInstance, User) {
    var uibModalInstance = $uibModalInstance;
    $scope.logoutPending = false;

    $scope.close = function(confirmed) {
      if (confirmed) {
        $scope.logoutPending = true;
        User.logout().then(function () {
          $scope.logoutPending = false;
          uibModalInstance.close(confirmed);
        });
      } else {
        uibModalInstance.close(confirmed);
      }
    };
  });
