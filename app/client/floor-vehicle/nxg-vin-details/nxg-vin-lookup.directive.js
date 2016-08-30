/**
 * Created by gayathri.madala on 8/29/16.
 */
(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgVinLookup', nxgVinLookup);

  nxgVinLookup.$inject = [];

  function nxgVinLookup() {

    return {
      restrict: 'A',
      templateUrl: 'client/floor-vehicle/nxg-vin-details/nxg-vin-lookup.template.html',
      scope: {
        data: '=floorModel',
        validity: '=',
        form: '=',
        errorFlag: '='
      },
      controller: 'VinLookupCtrl'
    };

  }
})();
