(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgAlternateAddress', nxgAlternateAddress);

  nxgAlternateAddress.$inject = [];

  function nxgAlternateAddress() {

    return {
      templateUrl: 'scripts/directives/nxgAlternateAddress/nxgAlternateAddress.html',
      restrict: 'A',
      replace: true,
      scope: {
        payment: '=nxgAlternateAddress',
        showTooltip: '=showTooltip',
        isEnabled: '=isEnabled',
        ngDisabled: '='
      },
      controller: function($scope, $attrs, Addresses) {
        var showSelectMenuAttr = !($attrs.showSelectMenu === undefined || $attrs.showSelectMenu === 'false');
        $scope.selectedAddress = null;
        $scope.showSelectMenu = $scope.payment.overrideAddress || showSelectMenuAttr ? true : false;
        $scope.addrLoaded = false;

        $scope.addrList = Addresses.getTitleAddresses();
        $scope.addrLoaded = true;

        $scope.defaultAddress = Addresses.getDefaultTitleAddress();

        // If address for this payment has not been overridden,
        // make sure model for the menu is set to the default
        if (!$scope.payment.overrideAddress) {
          $scope.selectedAddress = $scope.defaultAddress;
        } else {
          $scope.selectedAddress = $scope.payment.overrideAddress;
        }

        $scope.canChangeTitleAddress = function() {
          return ($scope.isEnabled || $scope.isEnabled === undefined) && $scope.addrLoaded && $scope.addrList.length > 1;
        };

        $scope.onClickAddress = function() {
          // display the select menu
          $scope.showSelectMenu = true;
        };

        $scope.$watch('selectedAddress', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            // if user changes the address back to the default, set id value back to null
            if (newVal === $scope.defaultAddress) {
              $scope.payment.overrideAddress = null;
            } else {
              $scope.payment.overrideAddress = newVal;
            }
          }
        });
      }
    };

  }
})();
