(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('MultipleVehiclesCtrl', MultipleVehiclesCtrl);

  MultipleVehiclesCtrl.$inject = ['$scope', 'dialog', 'matchList'];

  function MultipleVehiclesCtrl($scope, dialog, matchList) {

    $scope.matches = matchList;

    var focusField = angular.element('#inputVin');

    $scope.select = function(match) {
      dialog.close(match);
      if (focusField.length > 0) {
        focusField.focus();
      }
    };

    $scope.close = function() {
      dialog.close();
      if (focusField.length > 0) {
        focusField.focus();
      }
    };

  }

})();
