(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('WizardFloorCtrl', WizardFloorCtrl);

  WizardFloorCtrl.$inject = [];

  function WizardFloorCtrl() {
    var vm = this;
    vm.sample = 'This wizard info is coming from the controller';
  }

})();