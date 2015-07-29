(function () {

  'use strict';

  // Following the guide here (thanks to John Daley):
  // https://code.angularjs.org/1.3.16/docs/guide/production
  angular.module('nextgearWebApp')
    .config(enableDebugMessage);

  enableDebugMessage.$inject = ['$compileProvider'];

  function enableDebugMessage($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
  }

})();
