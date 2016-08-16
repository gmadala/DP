(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('CarInfoCtrl', CarInfoCtrl);

  CarInfoCtrl.$inject = [
    '$scope',
    'User',
    'gettextCatalog'
  ];

  function CarInfoCtrl($scope, User, gettextCatalog) {
    var vm = this;

    vm.data = null;

    vm.vinDetailsErrorFlag = false;

    vm.mileageOrOdometer = User.isUnitedStates() ? gettextCatalog.getString('Mileage') : gettextCatalog.getString('Odometer');

    $scope.$parent.wizardFloor.transitionValidation = function() {
      $scope.form.$submitted = true;
      $scope.$parent.wizardFloor.validity = angular.copy($scope.form);
      $scope.$parent.wizardFloor.formParts.one = $scope.form.$valid;
      return $scope.form.$valid;
    };

  }

})();
