(function () {

  'use strict';

  /**
   * Solution offered by EUI inside uiRouterStateNoop.js doesn't seems to be work after upgrading to 1.3.17.
   *
   * This is another solution offered in the relevant github ticket:
   * - https://github.com/angular-ui/ui-router/issues/212
   */

  angular.module('nextgearWebApp')
    .config(disableOtherwise);

  disableOtherwise.$inject = ['$urlRouterProvider'];

  function disableOtherwise($urlRouterProvider) {
    $urlRouterProvider.otherwise(
      function () {
        return false;
      }
    );
  }

})();