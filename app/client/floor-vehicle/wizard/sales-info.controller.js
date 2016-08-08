(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('SalesInfoCtrl', SalesInfoCtrl);

  SalesInfoCtrl.$inject = ['$scope'];

  function SalesInfoCtrl($scope) {
    var vm = this;
    vm.sample = 'This sales info is coming from the controller';

    $scope.$parent.wizardFloor.transitionValidation = function() {
      $scope.$parent.wizardFloor.formParts.two = true;
      return true;
    };

  }

})();
