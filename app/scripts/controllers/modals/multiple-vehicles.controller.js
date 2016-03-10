(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('MultipleVehiclesCtrl', MultipleVehiclesCtrl);

  MultipleVehiclesCtrl.$inject = ['$scope', '$uibModalInstance', 'matchList'];

  function MultipleVehiclesCtrl($scope, $uibModalInstance, matchList) {

    var uibModalInstance = $uibModalInstance;

    $scope.matches = matchList;

    var focusField = angular.element('#inputVin');

    $scope.select = function(match) {
      uibModalInstance.close(match);
      if (focusField.length > 0) {
        focusField.focus();
      }
    };

    $scope.close = function() {
      uibModalInstance.close();
      if (focusField.length > 0) {
        focusField.focus();
      }
    };

  }
})();
