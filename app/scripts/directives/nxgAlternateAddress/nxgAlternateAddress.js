'use strict';

angular.module('nextgearWebApp')
  .directive('nxgAlternateAddress', function () {
    return {
      templateUrl: 'scripts/directives/nxgAlternateAddress/nxgAlternateAddress.html',
      restrict: 'A',
      replace: true,
      scope: {
        payment: '=nxgAlternateAddress',
        showTooltip: '=showTooltip',
        enabled: '=enabled',
        ngDisabled: '='
      },
      controller: function($scope, $attrs, TitleAddresses, metric) {
        var showSelectMenuAttr = !($attrs.showSelectMenu === undefined || $attrs.showSelectMenu === 'false');
        $scope.metric = metric;
        $scope.selectedAddress = null;
        $scope.showSelectMenu = $scope.payment.overrideAddress || showSelectMenuAttr ? true : false;
        $scope.addrList = null;
        $scope.addrLoaded = false;
        $scope.defaultAddress = null;

        // Get the title addresses and the default address
        TitleAddresses.getAddresses().then(
          function(result) {
            $scope.addrList = result;
            $scope.addrLoaded = true;

            TitleAddresses.getDefaultAddress().then(function(defaultAddress) {
              $scope.defaultAddress = defaultAddress;

              // If address for this payment has not been overridden,
              // make sure model for the menu is set to the default
              if (!$scope.payment.overrideAddress) {
                $scope.selectedAddress = $scope.defaultAddress;
              } else {
                $scope.selectedAddress = $scope.payment.overrideAddress;
              }
            });
          }
        );

        $scope.canChangeTitleAddress = function() {
          return ($scope.enabled || $scope.enabled === undefined) && $scope.addrLoaded && $scope.addrList.length > 1;
        };

        $scope.onClickAddress = function() {
          // display the select menu
          $scope.showSelectMenu = true;
        };

        $scope.toShortAddress = function(addressObj) {
          return addressObj ? addressObj.Line1 + (addressObj.Line2 ? ' ' + addressObj.Line2 : '') + ' / ' + addressObj.City + ' ' + addressObj.State : '';
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
  });
