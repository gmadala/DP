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
        address: '=',
        city: '=',
        state: '=',
        zip: '='
      },
      restrict: 'E'
    };

    return directive;

    function link(scope, element, attrs) {
      scope.addressDisplayed= isAddressDisplayed();
      scope.cityDisplayed = isCityDisplayed();
      scope.stateDisplayed = isStateDisplayed();
      scope.zipDisplayed = isZipDisplayed();

      function isAddressDisplayed() {
        return attrs.address;
      }

      function isCityDisplayed() {
        return attrs.city;
      }

      function isStateDisplayed() {
        return attrs.state;
      }

      function isZipDisplayed() {
        return attrs.zip;
      }
    }
  }
})();
