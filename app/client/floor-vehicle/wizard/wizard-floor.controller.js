(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('WizardFloorCtrl', WizardFloorCtrl);

  WizardFloorCtrl.$inject = ['$state'];

  function WizardFloorCtrl($state) {
    var vm = this;
    vm.counter = 1;
    vm.validForm = true;

    vm.pageCount = 3;

    vm.nextAvailable = function() {
      return vm.counter < vm.pageCount;
    };

    vm.next = function() {
      if (vm.nextAvailable()) {
        vm.counter++;
        switchState();
      }
    };

    vm.previousAvailable = function() {
      return vm.counter > 1;
    };

    vm.previous = function() {
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
          $state.go('flooringWizard.sales');
          break;
        case 3:
          $state.go('flooringWizard.document');
          break;
      }
    }
  }

})();