(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ConfirmCtrl', ConfirmCtrl);

  ConfirmCtrl.$inject = ['$scope', '$uibModalInstance'];

  function ConfirmCtrl($scope, $uibModalInstance) {

    var uibModalInstance = $uibModalInstance;

    $scope.close = function (result) {
      uibModalInstance.close(result);
    };

    $scope.agree = false;

  }
})();
