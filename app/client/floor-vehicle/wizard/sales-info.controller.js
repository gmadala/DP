(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('SalesInfoCtrl', SalesInfoCtrl);

  SalesInfoCtrl.$inject = [];

  function SalesInfoCtrl() {
    var vm = this;
    vm.sample = 'This sales info is coming from the controller';
  }

})();