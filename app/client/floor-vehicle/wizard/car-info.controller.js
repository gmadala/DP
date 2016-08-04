(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('CarInfoCtrl', CarInfoCtrl);

  CarInfoCtrl.$inject = [];

  function CarInfoCtrl() {
    var vm = this;
    vm.sample = 'This car info is coming from the controller';
  }

})();