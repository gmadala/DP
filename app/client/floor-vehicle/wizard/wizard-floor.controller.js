(function () {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('WizardFloorCtrl', WizardFloorCtrl);

  WizardFloorCtrl.$inject = ['$state', '$scope', '$q', 'User', 'AccountManagement', 'Addresses'];

  function WizardFloorCtrl($state, $scope, $q, User, AccountManagement, Addresses) {
    var vm = this;
    vm.counter = 1;
    vm.validForm = true;
    vm.data = null;
    vm.transition = false;
    vm.formParts = {
      one: false,
      two: false,
      three: false
    };

    vm.pageCount = 3;

    $q.all([User.getStatics(), User.getInfo(), AccountManagement.getDealerSummary()]).then(function (result) {
      vm.options = angular.extend({}, result[0], result[1]);

      vm.options.locations = Addresses.getActivePhysical();
    });

    vm.tabClick = function (count) {
      vm.transition = true;

      if (canTransition(count)) {
        vm.transition = false;
        vm.counter = count;
        switchState();
      }
      vm.transition = false;
    };

    vm.nextAvailable = function () {
      return vm.counter < vm.pageCount;
    };

    vm.next = function () {
      console.log('next transition: ', vm.transition);
      var nextCount = vm.counter + 1;
      vm.transition = true;

      if (vm.nextAvailable() && canTransition(nextCount)) {
        vm.counter++;
        // vm.transition = false;
        switchState();
      }
      // vm.transition = false;
    };

    vm.previousAvailable = function () {
      return vm.counter > 1;
    };

    vm.previous = function () {
      if (vm.previousAvailable()) {
        vm.counter--;
        switchState();
      }
    };

    function switchState() {
      switch (vm.counter) {
        case 1:
          $state.go('flooringWizard.car');

          break;
        case 2:
          if (vm.formParts.one) {
            $state.go('flooringWizard.sales');
          }

          break;
        case 3:
          if (vm.formParts.one && vm.formParts.two) {
            $state.go('flooringWizard.document');
          }

          break;
      }
    }

    function canTransition(count) {
      console.log('Can Transition: ', count);
      switch (count) {
        case 1:
          return true
          break;
        case 2:
          console.log('Can Transition; ', vm.formParts.one);
          if (vm.formParts.oneValidation()) {
            vm.formParts.one = true;
            return vm.formParts.one
          } else {
            return false;
          }
          break;
        case 3:
          return vm.formParts.one && vm.formParts.two
          break;
      }
    }
  }

})();
