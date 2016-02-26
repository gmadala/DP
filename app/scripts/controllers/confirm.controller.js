(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ConfirmCtrl', ConfirmCtrl);

  ConfirmCtrl.$inject = ['$scope', 'dialog'];

  function ConfirmCtrl($scope, dialog) {

    $scope.close = function (result) {
      dialog.close(result);
    };

    $scope.agree = false;

  }
})();
