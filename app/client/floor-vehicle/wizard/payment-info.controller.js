(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('PaymentInfoCtrl', PaymentInfoCtrl);

  PaymentInfoCtrl.$inject = [
    '$scope',
    'User',
    'gettextCatalog'
  ];

  function PaymentInfoCtrl($scope, User, gettextCatalog) {
    var vm = this;

    vm.data = null;

    $scope.$parent.wizardFloor.transitionValidation = function() {
      $scope.form.$submitted = true;
      $scope.$parent.wizardFloor.validity = angular.copy($scope.form);
      $scope.$parent.wizardFloor.formParts.three = $scope.form.$valid;
      return $scope.form.$valid;
    };

  }

})();
