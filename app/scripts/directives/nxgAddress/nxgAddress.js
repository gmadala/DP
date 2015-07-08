(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgAddress', address);

  /**
   * Directive for rendering addresses - currently used in financial accounts in account management
   */
  function address() {

    var directive;
    directive = {
      link: link,
      templateUrl: 'scripts/directives/nxgAddress/nxgAddress.html',
      scope: {
        city: '=',
        info: '=',
        line1: '=',
        line2: '=',
        state: '=',
        validity: '=',
        zip: '='
      },
      restrict: 'E'
    };

    return directive;

    function link() {
      // TODO
      // Obtain endpoint for GUID -- state

      // TODO
      // Obtain Address GUID
    }
  }

})();
