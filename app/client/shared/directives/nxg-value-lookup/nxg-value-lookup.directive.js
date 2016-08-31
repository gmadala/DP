(function() {

  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgValueLookup', nxgCreditAvailability);

  nxgCreditAvailability.$inject = [];

  function nxgCreditAvailability() {

    return {
      templateUrl: 'client/shared/directives/nxg-value-lookup/nxg-value-lookup.template.html',
      restrict: 'E',
      scope: {
        vin: '=',
        odometer: '=',
        zipCode: '='
      },
      replace: 'true',
      link: linkFn
    };

    function linkFn(scope) {
      var options = {

      };
      element.find('.nxg-value-lookup').highcharts(options);

      scope.$watch('vin', function(newValue, oldValue) {
        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }

        // update blackbook and mmr values
        if (scope.odometer) {
          // only update the kbb if the zipCode is set
          if (scope.zipCode) {
          }
        }
      });

      scope.$watch('odometer', function(newValue, oldValue) {
        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }

        // update blackbook and mmr values
        if (scope.vin) {
          // only update the kbb if the zipCode is set
          if (scope.zipCode) {
          }
        }
      });

      scope.$watch('zipCode', function(newValue, oldValue) {
        // skip doing anything when the value is not changing
        if (oldValue === newValue) {
          return;
        }

        // update the kbb value only
        if (scope.vin && scope.odometer) {
        }
      });
    }
  }
})();