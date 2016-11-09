(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('ReviewRequestCtrl', ReviewRequestCtrl);

  ReviewRequestCtrl.$inject = [
    '$scope',
    'User'];

  function ReviewRequestCtrl(
    $scope,
    User) {

    var vm = this;

    vm.vinDetailsErrorFlag = false;

    $scope.isDealer = User.isDealer();

    $scope.$parent.wizardFloor.stateChangeCounterFix(5);

    $scope.$parent.wizardFloor.transitionValidation = function () {
      $scope.form.$submitted = true;
      $scope.$parent.wizardFloor.validity = angular.copy($scope.form);
      return $scope.form.$valid;
    };
  $scope.isBuyerPayBuyersPossession = $scope.$parent.wizardFloor.options.buyerPayWhenTitleIsInBuyersPossession;
  }

})();
