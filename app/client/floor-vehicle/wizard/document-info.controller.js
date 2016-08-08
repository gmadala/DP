(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('DocumentInfoCtrl', DocumentInfoCtrl);

  DocumentInfoCtrl.$inject = ['$scope'];

  function DocumentInfoCtrl($scope) {
    var vm = this;
    vm.sample = 'This document info is coming from the controller';

    $scope.$parent.wizardFloor.formParts.oneValidation = function() {
      return true;
    };

  }

})();
