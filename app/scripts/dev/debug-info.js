(function () {

  'use strict';

  // app/scripts/debugInfo.js disabled debug info so enable it here for dev.
  // https://code.angularjs.org/1.3.16/docs/guide/production
  angular.module('nextgearWebApp')
    .config(enableDebugMessage);

  enableDebugMessage.$inject = ['$compileProvider'];

  function enableDebugMessage($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
  }

})();
