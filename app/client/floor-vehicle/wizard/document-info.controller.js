(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('DocumentInfoCtrl', DocumentInfoCtrl);

  DocumentInfoCtrl.$inject = ['$scope'];

  function DocumentInfoCtrl($scope) {
    var vm = this;
    vm.sample = 'This document info is coming from the controller';

    $scope.$parent.wizardFloor.transitionValidation = function() {
      $scope.$parent.wizardFloor.formParts.three = true;
      return true;
    };

  }

})();
