(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('WizardFloorCtrl', WizardFloorCtrl);

  WizardFloorCtrl.$inject = [
    'moment',
    '$scope',
    '$state',
    '$q',
    'User',
    'Addresses'
  ];

  function WizardFloorCtrl(
    moment,
    $scope,
    $state,
    $q,
    User,
    Addresses
  ) {
    var vm = this;
    vm.sample = 'This wizard info is coming from the controller';

    var today = new Date();
    vm.today = moment([today.getFullYear(), today.getMonth(), today.getDate()]).toDate();

    vm.data = null;

    $q.all([User.getStatics(), User.getInfo()]).then(function(res) {
      vm.options = angular.extend({}, res[0], res[1]);

      vm.options.locations = Addresses.getActivePhysical();
    });

    vm.next = function(form, nextState) {
      vm.validity = angular.copy(form);

      if (form.$valid) {
        $state.go(nextState);
      }
    };

  }

})();
