(function () {
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

    function link(scope) {
      scope.line1Regex = /\d{1,5}\s\w*\s.*/;
      scope.zipRegex = /\d{5}(-\d{4})?/;

      /* TODO Implement
      // Obtain Address GUID
      function getAddressGuid() {
        return false;
      }

      // Obtain endpoint for GUID -- state
      function getStateGuid() {
        return false;
      }
      */
    }
  }
})();
