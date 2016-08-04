(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .controller('DocumentInfoCtrl', DocumentInfoCtrl);

  DocumentInfoCtrl.$inject = [];

  function DocumentInfoCtrl() {
    var vm = this;
    vm.sample = 'This document info is coming from the controller';
  }

})();