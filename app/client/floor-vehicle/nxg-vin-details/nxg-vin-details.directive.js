(function() {
  'use strict';

  angular
    .module('nextgearWebApp')
    .directive('nxgVinDetails', nxgVinDetails);

  nxgVinDetails.$inject = [];

  function nxgVinDetails() {

    return {
      restrict: 'A',
      templateUrl: 'client/floor-vehicle/nxg-vin-details/nxg-vin-details.html',
      scope: {
        data: '=floorModel',
        validity: '=',
        form: '=',
        errorFlag: '='
      },
      controller: 'VinDetailsCtrl'
    };

  }
})();
